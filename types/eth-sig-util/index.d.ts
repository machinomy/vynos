declare module "eth-sig-util" {
  function concatSig(v: number, r: Buffer, s: Buffer): Buffer

  export = {
    concatSig
  }
}
