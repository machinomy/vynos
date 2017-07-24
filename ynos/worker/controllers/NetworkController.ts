import BackgroundController from "./BackgroundController";
import ZeroClientProvider = require("web3-provider-engine/zero")
import {ProviderOpts} from "web3-provider-engine";
import Engine = require('web3-provider-engine')
import {Payload} from "../../lib/Payload";
import {EndFunction} from "../../lib/StreamServer";
import Tx from 'ethereumjs-tx'
import {Buffer} from "buffer";
import Web3 = require("web3")
import {DevWindow} from "../../YnosWindow";
const ethUtil = require('ethereumjs-util')
const sigUtil = require('eth-sig-util')

export type ApproveTransactionCallback = (error: any, isApproved: true) => void

export default class NetworkController {
  background: BackgroundController
  provider: Engine
  web3: Web3

  constructor (backgroundController: BackgroundController) {
    this.background = backgroundController
    this.provider = ZeroClientProvider(this.providerOpts())
    console.log('NetworkControler')
    console.log(this.providerOpts())
    this.web3 = new Web3(this.provider)

    this.handler = this.handler.bind(this)
  }

  handler(message: Payload, next: Function, end: EndFunction) {
    this.provider.sendAsync(message, (error, response) => {
      if (error) {
        end(error)
      } else {
        end(null, response)
      }
    })
  }

  getAccounts(callback: (err: any, accounts?: Array<string>) => void) {
    this.background.getAccounts().then(accounts =>
      callback(null, accounts)
    ).catch(error => {
      callback(error)
    })
  }

  approveTransaction(txParams: any, callback: ApproveTransactionCallback) {
    callback(null, true)
  }

  signTransaction(rawTx: any, callback: any) {
    this.background.getPrivateKey().then(privateKey => {
      let tx = new Tx(rawTx)
      tx.sign(privateKey)
      let txHex = '0x' + Buffer.from(tx.serialize()).toString('hex')
      callback(null, txHex)
    }).catch(error => {
      callback(error)
    })
  }

  signMessage(messageParams: any, callback: any) {
    this.background.getPrivateKey().then(privateKey => {
      let message = Buffer.from(messageParams.data.replace(/0x/, ''), 'hex')
      let msgSig = ethUtil.ecsign(message, privateKey)
      let rawMsgSig = ethUtil.bufferToHex(sigUtil.concatSig(msgSig.v, msgSig.r, msgSig.s))
      console.log('sign message: ', messageParams)
      callback(null, rawMsgSig)
    }).catch(error => {
      callback(error)
    })
  }

  providerOpts(): ProviderOpts {
    let rpcUrl = (window as DevWindow).RPC_URL || 'https://ropsten.infura.io/T1S8a0bkyrGD7jxJBgeH'
    return {
      static: {
        eth_syncing: false,
        web3_clientVersion: `LiteratePayments/v${1.0}`,
      },
      rpcUrl: rpcUrl,
      getAccounts: this.getAccounts.bind(this),
      approveTransaction: this.approveTransaction.bind(this),
      signTransaction: this.signTransaction.bind(this),
      signMessage: this.signMessage.bind(this)
      // tx signing, newUnapprovedTransaction
      //processTransaction: processTransaction,
      // old style msg signing, newUnsignedMessage
      //processMessage: processMessage,
      // new style msg signing, newUnsignedPersonalMessage
      //processPersonalMessage: processPersonalMessage,
    }
  }
}
