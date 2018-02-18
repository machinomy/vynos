import NetworkController from "./NetworkController";
import BackgroundController from "./BackgroundController";
import { PaymentChannel } from "machinomy/lib/channel";
import Payment from "machinomy/lib/Payment";
import VynosBuyResponse from "../../lib/VynosBuyResponse";
import Machinomy from 'machinomy'
import ZeroClientProvider = require("web3-provider-engine/zero")
import {ProviderOpts} from "web3-provider-engine";
import ProviderOptions from "./ProviderOptions";
import Web3 = require("web3")
import TransactionService from "../TransactionService";
import * as transactions from '../../lib/transactions'
import PurchaseMeta from "../../lib/PurchaseMeta";
import ChannelMetaStorage from "../../lib/storage/ChannelMetaStorage";
import TransactionState from "../../lib/TransactionState";
import TransactionMeta from "../../lib/TransactionMeta";
import * as actions from "../actions";
import bus from '../../lib/bus'
import {CHANGE_NETWORK} from "../../lib/constants";
import {SharedState} from "../WorkerState";
import * as events from '../../lib/events'

const timeparse = require('timeparse');

export default class MicropaymentsController {
  network: NetworkController
  background: BackgroundController
  account: string
  machinomy: Machinomy
  transactions: TransactionService
  channels: ChannelMetaStorage
  web3: Web3

  constructor(network: NetworkController, background: BackgroundController, transactions: TransactionService) {
    this.network = network
    this.background = background
    this.transactions = transactions
    this.channels = new ChannelMetaStorage()
    this.background.awaitUnlock(() => {
      this.background.getAccounts().then(accounts => {
        this.account = accounts[0]
        let provider = ZeroClientProvider(this.providerOpts(network.rpcUrl))
        this.web3 = new Web3(provider)
      })
    })
  }

  providerOpts(rpcUrl: string): ProviderOpts {
    let providerOptions = new ProviderOptions(this.background, this.transactions, rpcUrl)
    return providerOptions.approving()
  }

  openChannel(receiver: string, amount: number): Promise<PaymentChannel> {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  closeChannel(channelId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.background.awaitUnlock(() => {
        this.background.getAccounts().then(accounts => {
          let account = accounts[0]
          let machinomy = new Machinomy(account, this.web3, { engine: 'nedb', databaseFile: 'vynos' })
          machinomy.close(channelId).then(() => {
            let channelDescription = JSON.stringify({channelId: channelId})
            let transaction = transactions.closeChannel(channelDescription)
            return this.transactions.addTransaction(transaction).then(() => {
              resolve(channelId)
            })
          }).catch(reject)
        })
      })
    })
  }

  payInChannel(channel: PaymentChannel, amount: number, override?: boolean): Promise<[PaymentChannel, Payment]> {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  private async checkPrereqs (sharedState : SharedState, amount : number, transaction: TransactionMeta) {
    let interval = Date.now() - sharedState.lastMicropaymentTime
    let throttlingInMs = -1
    if (sharedState.preferences.micropaymentThrottlingHumanReadable === '-1ms'
      || sharedState.preferences.micropaymentThrottlingHumanReadable === '0'
      || sharedState.preferences.micropaymentThrottlingHumanReadable.length === 0) {
      throttlingInMs = -1
    } else if (/^\d+$/.test(sharedState.preferences.micropaymentThrottlingHumanReadable)) {
      throttlingInMs = parseInt(sharedState.preferences.micropaymentThrottlingHumanReadable)
    } else {
      throttlingInMs = timeparse(sharedState.preferences.micropaymentThrottlingHumanReadable)
    }

    if (amount > sharedState.preferences.micropaymentThreshold || interval < throttlingInMs) {
      transaction.state = TransactionState.PENDING
      await this.transactions.addTransaction(transaction)
      await this.transactions.store.dispatch(actions.setTransactionPending(true))
    }
  }


  buy(receiver: string, amount: number, gateway: string, meta: string, purchaseMeta: PurchaseMeta, channelValue?: number): Promise<VynosBuyResponse> {
    return new Promise<VynosBuyResponse>((resolve, reject) => {
      this.background.awaitUnlock(async () => {
        let transaction = transactions.micropayment(purchaseMeta, receiver, amount)
        let sharedState = await this.background.getSharedState()
        await this.checkPrereqs(sharedState, amount, transaction)
        let id = transaction.id

        let approvedEvent = events.txApproved(transaction.id)
        bus.once(approvedEvent,  async () => {
          try {
            let accounts = await this.background.getAccounts()
            let account = accounts[0]
            let options: any
            if (channelValue !== undefined) {
              options = {engine: 'nedb', databaseFile: 'vynos', minimumChannelAmount: channelValue}
            } else {
              options = {engine: 'nedb', databaseFile: 'vynos'}
            }
            let machinomy = new Machinomy(account, this.web3, options)
            let response: VynosBuyResponse = await machinomy.buy({
              receiver: receiver,
              price: amount,
              gateway: gateway,
              meta: meta
            })
            let channelFound = this.channels.firstById(response.channelId)
            if (!channelFound) {
              await this.channels.save({
                channelId: response.channelId,
                title: purchaseMeta.siteName,
                host: purchaseMeta.origin,
                icon: '/frame/styles/images/channel.png',
                openingTime: Date.now()
              })
              let channelDescription = JSON.stringify({channelId: response.channelId})
              let transaction = transactions.openChannel('Opening of channel', channelDescription, account, receiver, channelValue ? channelValue : amount * 10)
              await this.transactions.addTransaction(transaction)
            }
            transaction.state = TransactionState.APPROVED
            await this.background.setLastMicropaymentTime(Date.now())
            resolve(response)
          } catch (e) {
            reject(e)
          }
        })

        let rejectedEvent = events.txRejected(id)
        bus.once(rejectedEvent, ()=> {
          reject('Micropayment is rejected by the user')
        })
      })
    })
  }

  listChannels(): Promise<Array<PaymentChannel>> {
    return new Promise((resolve, reject) => {
      this.background.awaitUnlock(() => {
        this.background.getAccounts().then(accounts => {
          let account = accounts[0]
          let machinomy = new Machinomy(account, this.web3, { engine: 'nedb', databaseFile: 'vynos' })
          machinomy.channels().then(resolve).catch(reject)
        })
      })
    })
  }
}
