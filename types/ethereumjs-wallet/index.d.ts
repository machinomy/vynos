declare module "ethereumjs-wallet" {
  import { Buffer } from "buffer";

  class Wallet {
    static fromPrivateKey(key: Buffer): Wallet;
    static fromV3(json: string, password: string): Wallet;
    getPrivateKey(): Buffer;
    getAddressString(): string;
  }

  export = Wallet;
}

declare module "ethereumjs-wallet/hdkey" {
  import Wallet = require("ethereumjs-wallet");

  class EthereumHDKey {
    getWallet(): Wallet
    derivePath(path: string): EthereumHDKey
    deriveChild(i: number): EthereumHDKey
  }

  export function fromMasterSeed(seed: string): EthereumHDKey
}
