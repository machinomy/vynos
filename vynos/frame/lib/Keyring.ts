import * as Wallet from 'ethereumjs-wallet'
import utils = require('ethereumjs-util')
import passworder = require('browser-passworder')
import { Buffer } from 'safe-buffer'

interface BufferLike {
  type: string
  data: string
}

function isBufferLike (something: BufferLike | any): something is BufferLike {
  return (something as BufferLike).type === 'Buffer'
}

export default class Keyring {
  wallet: Wallet

  constructor (privateKeyOrJson: Buffer, isJSON?: boolean, password?: string) {
    if (isJSON) {
      this.wallet = Wallet.fromV3(privateKeyOrJson.toString(), password!)
    } else {
      this.wallet = Wallet.fromPrivateKey(privateKeyOrJson)
    }
  }

  static serialize (keyring: Keyring, password: string): Promise<string> {
    let privateKey = keyring.wallet.getPrivateKey()
    return passworder.encrypt(password, privateKey).then((str: string) => {
      return Buffer.from(str).toString('base64')
    })
  }

  static deserialize (str: string, password: string): Promise<Keyring> {
    let unbase64 = Buffer.from(str, 'base64').toString()
    return passworder.decrypt(password, unbase64).then((privateKey: Buffer | BufferLike) => {
      if (isBufferLike(privateKey)) {
        return new Keyring(Buffer.from(privateKey.data))
      } else {
        return new Keyring(privateKey)
      }
    })
  }

  static isValidV3 (json: string, password: string): boolean {
    try {
      Wallet.fromV3(json, password)
      return true
    } catch (e) {
      return false
    }
  }

  static isValidPrivateKey (key: Buffer): boolean {
    return utils.isValidPrivate(key)
  }
}
