declare module "ethereumjs-util" {
  interface Signature {
    v: number,
    r: Buffer,
    s: Buffer
  }

  function ecsign(message: Buffer, privateKey: Buffer): Signature

  function bufferToHex(buffer: Buffer): string

  export default {
    ecsign,
    bufferToHex
  }
}
