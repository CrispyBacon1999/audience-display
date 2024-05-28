import { ArtNet, type Sender } from 'lib/dmx';

type RGBLightConfig = {
  startIndex: number;
  dimmerChannel: number;
  redChannel: number;
  greenChannel: number;
  blueChannel: number;
  fieldSide: 'red' | 'blue';
};

class DMXLight {
  private dmx: Sender;
  readonly config: RGBLightConfig;
  constructor(dmxSender: Sender, config: RGBLightConfig) {
    this.dmx = dmxSender;
    this.config = config;
  }

  setRGB(
    red: number,
    green: number,
    blue: number,
    instantSend: boolean = false
  ) {
    this.dmx.prepChannel(this.config.startIndex + this.config.redChannel, red);
    this.dmx.prepChannel(
      this.config.startIndex + this.config.greenChannel,
      green
    );
    this.dmx.prepChannel(
      this.config.startIndex + this.config.blueChannel,
      blue
    );
    if (instantSend) {
      this.dmx.transmit();
    }
  }

  setDimmer(value: number, instantSend: boolean = false) {
    this.dmx.prepChannel(
      this.config.startIndex + this.config.dimmerChannel,
      value
    );
    if (instantSend) {
      this.dmx.transmit();
    }
  }

  off() {
    this.setRGB(0, 0, 0);
    this.setDimmer(0);
  }

  white(dimmer: number = 255) {
    this.setRGB(255, 255, 255);
    this.setDimmer(dimmer);
  }

  red(dimmer: number = 255) {
    this.setRGB(255, 0, 0);
    this.setDimmer(dimmer);
  }

  green(dimmer: number = 255) {
    this.setRGB(0, 255, 0);
    this.setDimmer(dimmer);
  }

  blue(dimmer: number = 255) {
    this.setRGB(0, 0, 255);
    this.setDimmer(dimmer);
  }
}

export class Lighting {
  private dmx: ArtNet;
  private dmxSender: Sender;
  private lights: DMXLight[];
  constructor({ unicastIP }: { unicastIP?: string }) {
    this.dmx = new ArtNet({
      sName: 'Audience Display',
      lName: 'Audience Display - DMX Lighting Integration',
    });
    this.dmxSender = this.dmx.newSender({
      ip: unicastIP ?? '255.255.255.255',
      subnet: 0,
      universe: 0,
    });
    this.lights = [];
  }

  addLight(config: RGBLightConfig) {
    const light = new DMXLight(this.dmxSender, {
      ...config,
      startIndex: config.startIndex - 1,
    });
    this.lights.push(light);
    return light;
  }

  white() {
    this.lights.forEach((light) => light.white());

    // Update all lights
    this.dmxSender.transmit();
  }

  fullRed() {
    this.lights.forEach((light) => light.red());

    // Update all lights
    this.dmxSender.transmit();
  }

  fullGreen() {
    this.lights.forEach((light) => light.green());

    // Update all lights
    this.dmxSender.transmit();
  }

  fullBlue() {
    this.lights.forEach((light) => light.blue());

    // Update all lights
    this.dmxSender.transmit();
  }

  allianceColor() {
    // Set all lights to alliance color
    // but don't transmit until all lights are set
    this.lights.forEach((light) => {
      if (light.config.fieldSide === 'red') {
        light.red();
      } else {
        light.blue();
      }
    });

    // Update all lights
    this.dmxSender.transmit();
  }
}
