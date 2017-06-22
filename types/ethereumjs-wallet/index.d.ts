declare module "ethereumjs-wallet" {
  class Wallet {
    static fromPrivateKey(key: Buffer): Wallet;
    getPrivateKey(): Buffer;
  }

  export = Wallet;
}

declare module "ethereumjs-wallet/hdkey" {
  import Wallet = require("ethereumjs-wallet");

  class EthereumHDKey {
    getWallet(): Wallet
  }

  function fromMasterSeed(seed: string): EthereumHDKey

  export default {
    fromMasterSeed: fromMasterSeed
  }
}
