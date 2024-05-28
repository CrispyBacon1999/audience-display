import type { udp } from 'bun';
import { jspack } from 'jspack';
import os, { type NetworkInterfaceInfo } from 'os';

const leftPad = (str: string, len: number, ch: string = ' ') => {
  return ch.repeat(len - str.length) + str;
};

const swap16 = (value: number) => {
  return ((value & 0xff) << 8) | ((value >> 8) & 0xff);
};

const isBroadcastAddr = (addr: string) => {
  return addr === '255.255.255.255';
};

export type ArtNetOptions = {
  oem?: number;
  esta?: number;
  port?: number;
  sName?: string;
  lName?: string;
  hosts?: string[];
};

export class ArtNet {
  oem: number;
  esta: number;
  port: number;
  sName: string;
  lName: string;
  hosts: string[];

  interfaces: Dict<NetworkInterfaceInfo[]>;
  ipv4Interfaces: NetworkInterfaceInfo[];
  ipv6Interfaces: NetworkInterfaceInfo[];

  pollReplyCount: number = 0;
  controllers: Controller[] = [];
  nodes: unknown[] = [];
  senders: Sender[] = [];
  receivers: Receiver[] = [];

  listener!: udp.Socket<'buffer'>;
  socket!: udp.Socket<'buffer'>;

  constructor(options: ArtNetOptions) {
    const opt = Object.assign(
      {
        oem: 0x2908,
        esta: 0x0000,
        port: 6454,
        sName: 'AD ArtNet',
        lName: 'Audience Display Artnet Node',
        hosts: [],
      },
      options
    );
    this.oem = opt.oem;
    this.esta = opt.esta;
    this.port = opt.port;
    this.sName = opt.sName;
    this.lName = opt.lName;
    this.hosts = opt.hosts;

    this.interfaces = os.networkInterfaces();
    this.ipv4Interfaces = [];
    this.ipv6Interfaces = [];

    Object.keys(this.interfaces).forEach((name) => {
      this.interfaces[name]?.forEach((iface) => {
        if (iface.family === 'IPv4') {
          this.ipv4Interfaces.push(iface);
        } else if (iface.family === 'IPv6') {
          this.ipv6Interfaces.push(iface);
        }
      });
    });

    console.log('IPv4 Interfaces:', this.ipv4Interfaces);
    console.log('IPv6 Interfaces:', this.ipv6Interfaces);

    this.setupListener();

    // setInterval(() => {
    //   if (this.controllers) {
    //     this.controllers.forEach((controller) => {
    //       // If no response from controller in 60 seconds, mark it as offline
    //       if (Date.now() - controller.lastSeen > 60000) {
    //         controller.online = false;
    //       }
    //     });
    //   }
    // });
  }

  private async setupListener() {
    this.listener = await Bun.udpSocket({
      binaryType: 'buffer',
      port: this.port,
      socket: {
        error(socket, error) {
          console.error('Socket Error:', error);
        },
        data: (socket, data, port, addr) => {
          dataParser(data, port, addr, this);
        },
      },
    });

    // Open socket for broadcast
    this.socket = await Bun.udpSocket({
      binaryType: 'buffer',
      port: 0,
      socket: {
        error(socket, error) {
          console.error('Socket Error:', error);
        },
      },
    });
  }

  newSender(options: SenderOptions) {
    const sender = new Sender(options, this);
    this.senders.push(sender);
    this.artPollReply();
    return sender;
  }

  private calcBroadcastIP = (sourceIP: string, subnetMask: string) => {
    const sourceIPParts = sourceIP.split('.');
    const subnetMaskParts = subnetMask.split('.');

    const broadcastIPParts = sourceIPParts.map((part, index) => {
      return parseInt(part) | ~parseInt(subnetMaskParts[index]);
    });

    return broadcastIPParts.join('.');
  };

  private artPollReply() {
    if (!this.socket) {
      return;
    }
    this.ipv4Interfaces.forEach((iface) => {
      let bindIndex = 1;
      let artPollReplyFormat = '!7sBHBBBBHHBBHBBH18s64s64sH4B4B4B4B4B3HB6B4BBB';
      let netSwitch = 0x01;
      let subSwitch = 0x01;
      let status = 0b11010000;
      let stateString = `#0001 [${leftPad(
        this.pollReplyCount.toString(),
        4,
        '0'
      )}] dmxnet ArtNet-Transceiver running`;
      let sourceIP = iface.address;
      // Calculate broadcast IP from source IP and subnet mask
      let broadcastIP = this.calcBroadcastIP(iface.address, iface.netmask);

      this.senders.forEach((sender) => {
        let portType = 0b01000000;
        let udpPacket = Buffer.from(
          jspack.Pack(artPollReplyFormat, [
            'Art-Net',
            0,
            0x0021,
            ...sourceIP.split('.').slice(0, 4),
            this.port,
            // Firmware version
            0x0001,
            sender.net,
            sender.subnet,
            this.oem,
            // UBEA, status1, 2 bytes ESTA
            0,
            status,
            swap16(this.esta),
            this.sName.substring(0, 16),
            this.lName.substring(0, 63),
            stateString,
            1,
            portType,
            0,
            0,
            0,
            0b10000000,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            sender.universe,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0x01,
            // MAC Address
            ...iface.mac
              .split(':')
              .slice(0, 6)
              .map((part) => parseInt(part, 16)),
            // Bind IP
            ...sourceIP.split('.').slice(0, 4),
            bindIndex,
            0b00001110,
          ])
        );
        bindIndex++;
        if (bindIndex > 255) {
          bindIndex = 1;
        }
        this.socket.send(udpPacket, 6454, broadcastIP);
      });
      this.senders.forEach((receiver) => {
        let portType = 0b01000000;
        let udpPacket = Buffer.from(
          jspack.Pack(artPollReplyFormat, [
            'Art-Net',
            0,
            0x0021,
            ...sourceIP.split('.').slice(0, 4),
            this.port,
            // Firmware version
            0x0001,
            receiver.net,
            receiver.subnet,
            this.oem,
            // UBEA, status1, 2 bytes ESTA
            0,
            status,
            swap16(this.esta),
            this.sName.substring(0, 16),
            this.lName.substring(0, 63),
            stateString,
            1,
            portType,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0b10000000,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            receiver.universe,
            0,
            0,
            0,
            0,
            0,
            0,
            0x01,
            // MAC Address
            ...iface.mac
              .split(':')
              .slice(0, 6)
              .map((part) => parseInt(part, 16)),
            // Bind IP
            ...sourceIP.split('.').slice(0, 4),
            bindIndex,
            0b00001110,
          ])
        );
        bindIndex++;
        if (bindIndex > 255) {
          bindIndex = 1;
        }
        this.socket.send(udpPacket, 6454, broadcastIP);
      });

      if (this.senders.length + this.receivers.length < 1) {
        // No senders or receivers, send empty reply
        let udpPacket = Buffer.from(
          jspack.Pack(artPollReplyFormat, [
            'Art-Net',
            0,
            0x0021,
            ...sourceIP.split('.').slice(0, 4),
            this.port,
            // Firmware version
            0x0001,
            netSwitch,
            subSwitch,
            this.oem,
            // UBEA, status1, 2 bytes ESTA
            0,
            status,
            swap16(this.esta),
            this.sName.substring(0, 16),
            this.lName.substring(0, 63),
            stateString,
            1,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0x01,
            // MAC Address
            ...iface.mac
              .split(':')
              .slice(0, 6)
              .map((part) => parseInt(part, 16)),
            // Bind IP
            ...sourceIP.split('.').slice(0, 4),
            1,
            0b00001110,
          ])
        );
        this.socket.send(udpPacket, 6454, broadcastIP);
      }
    });
    this.pollReplyCount++;
    if (this.pollReplyCount > 9999) {
      this.pollReplyCount = 0;
    }
  }
}

export type SenderOptions = {
  net?: number;
  subnet?: number;
  universe?: number;
  subUniverse?: number;
  ip?: string;
  port?: number;
  baseRefreshInterval?: number;
};

export class Sender {
  parent: ArtNet;

  net: number;
  subnet: number;
  universe: number;
  subUniverse: number;
  ip: string;
  port: number;
  baseRefreshInterval: number;

  artDmxSeq: number;
  values: number[] = [];

  socket: udp.Socket<'buffer'> | undefined;

  interval: Timer;

  constructor(options: SenderOptions, artnet: ArtNet) {
    const opt = Object.assign(
      {
        net: 0,
        subnet: 0,
        universe: 0,
        subUniverse: 0,
        ip: '255.255.255.255',
        port: 6454,
        baseRefreshInterval: 1000,
      },
      options
    );
    this.parent = artnet;
    this.net = opt.net;
    this.subnet = opt.subnet;
    this.universe = opt.universe;
    this.subUniverse = opt.subUniverse;
    this.ip = opt.ip;
    this.port = opt.port;
    this.baseRefreshInterval = opt.baseRefreshInterval;

    if (this.net > 127) {
      throw new Error('Net must be less than 128');
    }

    if (this.universe > 15) {
      throw new Error('Universe must be less than 16');
    }

    if (this.subnet > 15) {
      throw new Error('Subnet must be less than 16');
    }

    if (
      this.net < 0 ||
      this.subnet < 0 ||
      this.universe < 0 ||
      this.subUniverse < 0
    ) {
      throw new Error(
        'Net, Subnet, Universe, and Sub Universe must be greater than or equal to 0'
      );
    }

    // Initialize values array with 512 values
    this.values = [];
    for (let i = 0; i < 512; i++) {
      this.values.push(0);
    }

    if (!this.subUniverse) {
      this.subUniverse = (this.subnet << 4) | this.universe;
    }

    this.artDmxSeq = 1;

    console.log(`Binding Sender to ${this.ip}:${this.port}`);

    Bun.udpSocket({
      binaryType: 'buffer',
      port: this.port,
      socket: {
        error(socket, error) {
          console.error('Socket Error:', error);
        },
      },
    })
      .then((socket) => {
        this.socket = socket;
        console.log('Set up socket for artnet');
        this.transmit();
      })
      .catch((error) => {
        console.error('Error creating socket:', error);
      });

    this.interval = setInterval(() => {
      this.transmit();
    }, this.baseRefreshInterval);
  }

  transmit() {
    if (this.socket) {
      if (this.artDmxSeq > 255) {
        this.artDmxSeq = 1;
      }

      let dmxPacket = Buffer.from(
        jspack.Pack(
          '!7sBHHBBBBH512B',
          [
            'Art-Net',
            0,
            0x0050,
            14,
            this.artDmxSeq,
            0,
            this.subUniverse,
            this.net,
            512,
          ].concat(this.values.slice(0, 512) as number[])
        )
      );
      this.artDmxSeq++;

      const val = this.socket.send(dmxPacket, this.port, this.ip);
      // console.log(
      //   `Transmitting DMX to ${this.ip}:${this.port}, ${this.artDmxSeq} : ${val}`
      // );
      // console.log(dmxPacket);
    }
  }

  setChannel(channel: number, value: number) {
    this.prepChannel(channel, value);
    this.transmit();
  }

  prepChannel(channel: number, value: number) {
    if (channel < 0 || channel > 511) {
      throw new Error('Channel must be between 0 and 511');
    }
    // Clamp value between 0 and 255
    if (value < 0) {
      value = 0;
    } else if (value > 255) {
      value = 255;
    }
    this.values[channel] = value;
  }

  fillChannels(startChannel: number, endChannel: number, value: number) {
    if (startChannel < 0 || startChannel > 511) {
      throw new Error('Start Channel must be between 0 and 511');
    }
    if (endChannel < 0 || endChannel > 511) {
      throw new Error('End Channel must be between 0 and 511');
    }
    if (startChannel > endChannel) {
      throw new Error('Start Channel must be less than End Channel');
    }
    if (value < 0) {
      value = 0;
    } else if (value > 255) {
      value = 255;
    }
    for (let i = startChannel; i <= endChannel; i++) {
      this.values[i] = value;
    }
    this.transmit();
  }

  reset() {
    this.values = new Array(512).fill(0);
    this.transmit();
  }

  stop() {
    clearInterval(this.interval);
    this.parent.senders = this.parent.senders.filter(
      (sender) => sender !== this
    );
    this.socket?.close();
  }
}

class Receiver {}

class Controller {}

const dataParser = (
  data: Buffer,
  port: number,
  addr: string,
  artnet: ArtNet
) => {
  console.log(`Data from ${addr}:${port}`);
  console.log(data);

  let opcode = parseInt(jspack.Unpack('B', data, 8), 10);
  opcode += parseInt(jspack.Unpack('B', data, 9), 10) << 8;
  switch (opcode) {
    case 0x5000:
      let universe = parseInt(jspack.Unpack('H', data, 14), 10);
      let msgData = [];
      for (let i = 0; i < 512; i++) {
        msgData.push(data.readUInt8(i + 17));
      }
    // if(artnet.receiversSubUniverse[universe]) {
    //   parent.receiversSubUniverse[universe].receive(msgData);
    // }
  }
};
