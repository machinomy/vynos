import NetworkController from "./NetworkController";
import BackgroundController from "./BackgroundController";
import {buildMachinomyClient} from "../../lib/micropayments";
import Sender from "machinomy/lib/sender";
import { PaymentChannel } from "machinomy/lib/channel";
import Promise = require('bluebird')
import * as BigNumber from 'bignumber.js'
import Payment from "machinomy/lib/Payment";
import {BuyResponse} from "../../lib/rpc/yns";
import {PaymentRequired} from "machinomy/lib/transport";
import VynosBuyResponse from "../../lib/VynosBuyResponse";
import Machinomy from 'machinomy'

export default class MicropaymentsController {
  network: NetworkController
  background: BackgroundController
  account: string
  client: Sender
  machinomy: Machinomy

  constructor(network: NetworkController, background: BackgroundController) {
    this.network = network
    this.background = background
    this.background.awaitUnlock(() => {
      this.background.getAccounts().then(accounts => {
        this.account = accounts[0]
        this.client = buildMachinomyClient(this.network.web3, this.account)
      })
    })
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

  buy (title: string, receiver: string, amount: number, gateway: string): Promise<VynosBuyResponse> {
    return new Promise((resolve, reject) => {
      this.background.awaitUnlock(() => {
        this.background.getAccounts().then(accounts => {
          let account = accounts[0]
          let machinomy = new Machinomy(account, this.network.web3, { engine: 'nedb', databaseFile: 'vynos' })
          machinomy.buy({
            receiver: receiver,
            price: amount,
            gateway: gateway
          }).then((res: VynosBuyResponse)=>{
            resolve(res)
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
