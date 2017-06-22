import ethereumWallet from "ethereumjs-wallet";
import passworder from "browser-passworder";

interface BufferLike {
  type: string;
  data: string;
}

export default class Keyring {
  wallet: ethereumWallet;

  static serialize (keyring: Keyring, password: string): Promise<string> {
    let privateKey = keyring.wallet.getPrivateKey();
    return passworder.encrypt(password, privateKey).then((string: string) => {
      return Buffer.from(string).toString("base64")
    })
  }

  static deserialize (string: string, password: string): Promise<Keyring> {
    let unbase64 = Buffer.from(string, "base64").toString();
    return passworder.decrypt(password, unbase64).then((privateKey: Buffer) => {
      return new Keyring(privateKey)
    })
  }

  constructor (privateKey: Buffer) {
    this.wallet = ethereumWallet.fromPrivateKey(privateKey);
  }
}
