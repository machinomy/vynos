import BackgroundController from "./BackgroundController";
import {ProviderOpts} from "web3-provider-engine";
import ethUtil = require('ethereumjs-util')
import sigUtil = require('eth-sig-util')
import Tx = require('ethereumjs-tx')
import TransactionService from "../TransactionService";
import {randomId} from "../../lib/Payload";
import * as transactions from "../../lib/transactions";

export type ApproveTransactionCallback = (error: any, isApproved?: boolean) => void
export type ApproveSignCallback = (error: any, rawMsgSig?: string) => void

export default class ProviderOptions {
  background: BackgroundController
  rpcUrl: string
  transactions: TransactionService

  constructor (background: BackgroundController, transactions: TransactionService, rpcUrl: string) {
    this.background = background
    this.transactions = transactions
    this.rpcUrl = rpcUrl
  }

  getAccounts(callback: (err: any, accounts?: Array<string>) => void) {
    this.background.getAccounts().then(accounts =>
      callback(null, accounts)
    ).catch(error => {
      callback(error)
    })
  }

  approveTransaction(txParams: any, callback: ApproveTransactionCallback) {
    const description = 'Send to ' + txParams.to.slice(0, 8) + '..' + txParams.to.slice(-2)
    const meta = JSON.stringify(txParams)
    let transaction = transactions.ethereum(randomId().toString(), description, meta, txParams.value, 0)
    this.transactions.approveTransaction(transaction).then(result => {
      callback(null, result)
    }).catch(callback)
  }

  approveTransactionAlways(txParams: any, callback: ApproveTransactionCallback) {
    console.log('approveTransactionAlways')
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

  signMessage(messageParams: any, callback: ApproveSignCallback) {    
    this.background.getPrivateKey().then(privateKey => {
      const message = Buffer.from(messageParams.data.replace(/0x/, ''), 'hex')
      const messageBuffer = ethUtil.hashPersonalMessage(message)
      const msgSig = ethUtil.ecsign(messageBuffer, privateKey)
      const rawMsgSig = ethUtil.bufferToHex(sigUtil.concatSig(msgSig.v, msgSig.r, msgSig.s))
      
      const hex = message.toString('hex')
      const description = hex.slice(0, 8) + '..' + hex.slice(-2)
      const meta = JSON.stringify(messageParams)
      const transaction = transactions.signature(description, meta)

      this.transactions.approveTransaction(transaction).then(result => {
        if (result) {
          callback(null, rawMsgSig)
        } else {
          callback('Vynos: User rejected sign')
        }
      }).catch(callback)
    }).catch(error => {
      callback(error)
    })
  }

  walled(): ProviderOpts {
    return {
      static: {
        eth_syncing: false,
        web3_clientVersion: `LiteratePayments/v${1.0}`,
      },
      rpcUrl: this.rpcUrl,
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

  approving(): ProviderOpts {
    return {
      static: {
        eth_syncing: false,
        web3_clientVersion: `LiteratePayments/v${1.0}`,
      },
      rpcUrl: this.rpcUrl,
      getAccounts: this.getAccounts.bind(this),
      approveTransaction: this.approveTransactionAlways.bind(this),
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
