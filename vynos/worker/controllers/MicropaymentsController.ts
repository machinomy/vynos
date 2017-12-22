import NetworkController from "./NetworkController";
import BackgroundController from "./BackgroundController";
import { PaymentChannel } from "machinomy/lib/channel";
import Promise = require('bluebird')
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
            resolve(channelId)
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

  buy(receiver: string, amount: number, gateway: string, meta: string, purchaseMeta: PurchaseMeta, channelValue?: number): Promise<VynosBuyResponse> {
    return new Promise((resolve, reject) => {
      this.background.awaitUnlock(() => {
        this.background.getAccounts().then(accounts => {
          let account = accounts[0]
          let options
          if (channelValue !== undefined) {
            options = {engine: 'nedb', databaseFile: 'vynos', minimumChannelAmount: channelValue}
          } else {
            options = {engine: 'nedb', databaseFile: 'vynos'}
          }
          let machinomy = new Machinomy(account, this.web3, options)
          return machinomy.buy({
            receiver: receiver,
            price: amount,
            gateway: gateway,
            meta: meta
          }).then(response => {
            return this.channels.insertIfNotExists({
              channelId: response.channelId.toString(),
              title: purchaseMeta.siteName,
              host: purchaseMeta.origin,
              icon: purchaseMeta.siteIcon,
              openingTime: Date.now()
            }).then(() => {
              return response
            })
          }).then(response =>{
            let transaction = transactions.micropayment(purchaseMeta, receiver, amount)
            return this.transactions.addTransaction(transaction).then(() => {
              return response
            })
          }).then(resolve).catch(reject)
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
