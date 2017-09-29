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

export default class MicropaymentsController {
  network: NetworkController
  background: BackgroundController
  account: string
  client: Sender

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
    console.log("MicropaymentsController.openChannel")
    if (this.account) {
      console.log(this.client.web3.currentProvider)
      return this.client.contract.buildPaymentChannel(this.account, receiver, amount).then(paymentChannelDocument => {
        return this.client.storage.channels.saveOrUpdate(paymentChannelDocument).then(() => {
          return PaymentChannel.fromDocument(paymentChannelDocument)
        })
      })
    } else {
      return Promise.reject("account is not ready")
    }
  }

  startSettle(paymentChannel: PaymentChannel): Promise<PaymentChannel> {
    console.log("MicropaymentsController.startSettle")
    let channelId = paymentChannel.channelId
    let payment = new BigNumber(paymentChannel.spent)
    return this.client.contract.startSettle(this.account, channelId, payment).then(() => {
      let next = { ...paymentChannel.toJSON(), state: 1 }
      let channl = PaymentChannel.fromDocument(next)
      return this.client.storage.channels.saveOrUpdate(channl).then(() => {
        return channl
      })
    })
  }

  claim(paymentChannel: PaymentChannel): Promise<PaymentChannel> {
    console.log("MicropaymentsController.claim")
    let channelId = paymentChannel.channelId
    let storage = this.client.storage
    let contract = this.client.contract
    return storage.payments.firstMaximum(channelId).then(paymentDoc => {
      if (paymentDoc) {
        let value = new BigNumber(paymentDoc.value)
        return contract.canClaim(channelId, value, Number(paymentDoc.v), paymentDoc.r, paymentDoc.s).then(canClaim => {
          if (canClaim) {
            return contract.claim(paymentChannel.receiver, paymentChannel.channelId, paymentDoc.value, Number(paymentDoc.v), paymentDoc.r, paymentDoc.s).then(value => {
              console.log('Claimed ' + value + ' out of ' + paymentChannel.value + ' from channel ' + channelId)
              let next = { ...paymentChannel, state: 2 }
              return PaymentChannel.fromDocument(next)
            }).then(channel => {
              return this.client.storage.channels.saveOrUpdate(channel).then(() => {
                return channel
              })
            })
          } else {
            return Promise.reject(new Error('Can not claim ' + paymentDoc.value + ' from channel ' + channelId))
          }
        })
      }
    })
  }

  finishSettle(paymentChannel: PaymentChannel): Promise<PaymentChannel> {
    console.log("MicropaymentsController.finishSettle")
    let contract = this.client.contract
    return contract.canFinishSettle(this.account, paymentChannel.channelId).then(canFinishSettle => {
      if (canFinishSettle) {
        return contract.finishSettle(this.account, paymentChannel.channelId).then(payment => {
          console.log('Settled to pay ' + payment + ' to ' + paymentChannel.receiver)
          let next = { ...paymentChannel.toJSON(), state: 2 }
          return PaymentChannel.fromDocument(next)
        }).then(channel => {
          return this.client.storage.channels.saveOrUpdate(channel).then(() => {
            return channel
          })
        })
      } else {
        let until = contract.getUntil(paymentChannel.channelId)
        return Promise.reject(new Error('Can not finish settle until ' + until))
      }
    })
  }

  closeChannel(paymentChannel: PaymentChannel): Promise<PaymentChannel> {
    console.log("MicropaymentsController.closeChannel")
    if (this.account) {
      let state = paymentChannel.state
      let channelId = paymentChannel.channelId
      switch (state) {
        case 0: // open
          console.log('Channel ' + channelId + ' is open')
          if (this.account === paymentChannel.sender) {
            return this.startSettle(paymentChannel)
          } else if (this.account === paymentChannel.receiver) {
            return this.claim(paymentChannel)
          }
        case 1: // settling
          console.log('Channel ' + channelId + ' is settling')
          if (this.account === paymentChannel.sender) {
            return this.finishSettle(paymentChannel)
          } else if (this.account === paymentChannel.receiver) {
            return this.claim(paymentChannel)
          }
        case 2: // settled, nothing to do
          console.log('Channel ' + channelId + ' is settled')
          return Promise.resolve(paymentChannel)
        default:
          return Promise.reject(new Error('Unsupported channel state: ' + state))
      }
    } else {
      return Promise.reject("account is not ready")
    }
  }

  payInChannel(channel: PaymentChannel, amount: number, override?: boolean): Promise<[PaymentChannel, Payment]> {
    return this.client.storage.channels.firstById(channel.channelId).then(paymentChannel => {
      if (paymentChannel) {
        return Payment.fromPaymentChannel(this.client.web3, paymentChannel, amount, override).then(payment => {
          let nextPaymentChannel = PaymentChannel.fromPayment(payment)
          return this.client.storage.channels.saveOrUpdate(nextPaymentChannel).then(() => {
            let result: [PaymentChannel, Payment] = [nextPaymentChannel, payment]
            return result
          })
        })
      } else {
        return Promise.reject(new Error('No channel present, really'))
      }
    })
  }

  _buyUsingExistingChannel(paymentChannel: PaymentChannel, paymentRequired: PaymentRequired): Promise<VynosBuyResponse> {
    return Payment.fromPaymentChannel(this.client.web3, paymentChannel, paymentRequired.price).then(payment => {
      let nextPaymentChannel = PaymentChannel.fromPayment(payment)
      return this.client.storage.channels.saveOrUpdate(nextPaymentChannel).then(() => {
        return this.client.transport.requestToken(paymentRequired.gateway, payment)
      }).then(token => {
        return {
          channel: nextPaymentChannel,
          token: token
        }
      })
    })
  }

  buy (title: string, receiver: string, amount: number, gateway: string): Promise<VynosBuyResponse> {
    let paymentRequired = new PaymentRequired(receiver, amount, gateway)
    return this.client.findOpenChannel(paymentRequired).then(paymentChannel => {
      if (paymentChannel) {
        return this._buyUsingExistingChannel(paymentChannel, paymentRequired)
      } else {
        let value = paymentRequired.price * 10 // FIXME Total value of the channel
        return this.client.contract.buildPaymentChannel(this.account, paymentRequired.receiver, value).then((paymentChannel: PaymentChannel) => {
          return this._buyUsingExistingChannel(paymentChannel, paymentRequired)
        })
      }
    })
  }

  listChannels(): Promise<Array<PaymentChannel>> {
    return this.client.storage.channels.all().then(channels => {
      return channels.map(ch => PaymentChannel.fromDocument(ch))
    })
  }
}
