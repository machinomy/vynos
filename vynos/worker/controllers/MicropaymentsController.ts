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
import { Meta } from "../../lib/storages/channel_meta_database"
import * as storage from '../../lib/storage'

export default class MicropaymentsController {
  network: NetworkController
  background: BackgroundController
  account: string
  machinomy: Machinomy
  transactions: TransactionService
  web3: Web3

  constructor(network: NetworkController, background: BackgroundController, transactions: TransactionService) {
    this.network = network
    this.background = background
    this.transactions = transactions
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
          let machinomy = new Machinomy(account, this.network.web3, { engine: 'nedb', databaseFile: 'vynos' })
          machinomy.close(channelId).then(() => {
            resolve(channelId)
          }).catch((e: Error) => {
            console.log(e)
          })
        })
      })
    })
  }

  payInChannel(channel: PaymentChannel, amount: number, override?: boolean): Promise<[PaymentChannel, Payment]> {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  buy(title: string, receiver: string, amount: number, gateway: string, metaSite: Meta): Promise<VynosBuyResponse> {
    console.log('insideBuy');
    return new Promise((resolve, reject) => {
      this.background.awaitUnlock(() => {
        this.background.getAccounts().then(accounts => {
          let account = accounts[0]
          let machinomy = new Machinomy(account, this.network.web3, { engine: 'nedb', databaseFile: 'vynos' })
          machinomy.buy({
            receiver: receiver,
            price: amount,
            gateway: gateway
          }).then((res: VynosBuyResponse) => {
            let s = storage.build(this.web3, 'vynos', 'sender', false, 'nedb')
            s.channelMeta.insertIfNotExists({
              channelId: res.channelId.toString(),
              title: metaSite.title,
              desc: metaSite.desc,
              host: metaSite.host,
              icon: metaSite.icon
            });
            resolve(res);
          }).catch((e: Error) => {
            console.log(e)
          })
        })
      })
    })
  }

  listChannels(): Promise<Array<PaymentChannel>> {
    return new Promise((resolve, reject) => {
      this.background.awaitUnlock(() => {
        this.background.getAccounts().then(accounts => {
          let account = accounts[0]
          let machinomy = new Machinomy(account, this.network.web3, { engine: 'nedb', databaseFile: 'vynos' })
          machinomy.channels().then((res: any) => {
            resolve(res)
          }).catch((e: Error) => {
            console.log(e)
          })
        })
      })
    })
  }
}
