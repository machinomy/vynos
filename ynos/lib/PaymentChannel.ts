import {PaymentChannel as PC} from "machinomy";
import Web3 from "web3";
import {Buffer} from "buffer";
const util = require('ethereumjs-util')

function ethHash(message: Buffer): string {
  let buffer = Buffer.from('\x19Ethereum Signed Message:\n' + message.length.toString() + message.toString())
  return '0x' + util.sha3(buffer).toString('hex')
}

function personalSign (web3: Web3, account: string, messageHex: string): Promise<{r: Buffer, s: Buffer, v: number}> {
  return new Promise((resolve, reject) => {
    let message = Buffer.from(messageHex.replace('0x', ''), 'hex')
    let sha3 = ethHash(message)
    web3.eth.sign(account, sha3, (error, signature) => {
      let result = util.fromRpcSig(signature)
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}


export default class PaymentChannel {
  state: number;
  spent: number;
  value: number;
  channelId: string;
  receiver: string;
  sender: string;

  constructor(opts: PC) {
    this.state = opts.state
    this.spent = opts.spent
    this.value = opts.value
    this.channelId = opts.channelId
    this.receiver = opts.receiver
    this.sender = opts.sender
  }

  sign (web3: Web3, value: number) {
    let message = this.channelId + value.toString()
    let messageHex = '0x' + Buffer.from(message).toString('hex')
    return personalSign(web3, this.sender, messageHex).then(sig => {
      return {
        r: '0x' + sig.r.toString('hex'),
        s: '0x' + sig.s.toString('hex'),
        v: sig.v
      }
    })
  }

  toJSON(): PC {
    return {
      state: this.state,
      spent: this.spent,
      value: this.value,
      channelId: this.channelId,
      receiver: this.receiver,
      sender: this.sender
    }
  }
}
