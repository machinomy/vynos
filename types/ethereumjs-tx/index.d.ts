declare module "ethereumjs-tx" {
  export interface TransactionProperties {
    nonce: Buffer,
    gasPrice: Buffer,
    gasLimit: Buffer,
    to: Buffer,
    value: Buffer,
    data: Buffer,
    v: Buffer
    r: Buffer
    s: Buffer,
    chainId?: number
  }

  class Tx {
    constructor (raw: Buffer|TransactionProperties);
    sign(privateKey: Buffer): void;
    serialize(): string;
  }

  export default Tx
}
