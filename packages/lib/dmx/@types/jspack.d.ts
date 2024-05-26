declare module 'jspack' {
  export class JSPack {
    Unpack(format: string, data: Buffer, offset?: number): any;
    Pack(format: string, data: any): Buffer;
  }

  export const jspack: JSPack;
}
