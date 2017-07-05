import NetworkController from "./NetworkController";
import BackgroundController from "./BackgroundController";
import PaymentChannel from "../../lib/PaymentChannel";
import {buildMachinomyClient} from "../../lib/micropayments";
import machinomy, {Payment} from "machinomy";

export default class MicropaymentsController {
  network: NetworkController
  background: BackgroundController
  account: string
  client: machinomy.Sender

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
      return this.client.contract.buildPaymentChannel(this.account, receiver, amount).then(pc => {
        return new PaymentChannel(pc)
      })
    } else {
      return Promise.reject("account is not ready")
    }
  }

  startSettle(paymentChannel: PaymentChannel): Promise<PaymentChannel> {
    console.log("MicropaymentsController.startSettle")
    let channelId = paymentChannel.channelId
    let payment = paymentChannel.spent
    return this.client.contract.startSettle(this.account, channelId, payment).then(() => {
      let next = { ...paymentChannel.toJSON(), state: 1 }
      return new PaymentChannel(next)
    })
  }

  claim(paymentChannel: PaymentChannel): Promise<PaymentChannel> {
    console.log("MicropaymentsController.claim")
    let channelId = paymentChannel.channelId
    let storage: machinomy.Storage = this.client.storage
    let contract = this.client.contract
    return storage.payments.firstMaximum(channelId).then(paymentDoc => {
      let canClaim = contract.canClaim(channelId, paymentDoc.value, Number(paymentDoc.v), paymentDoc.r, paymentDoc.s)
      if (canClaim) {
        return contract.claim(paymentChannel.receiver, paymentChannel.channelId, paymentDoc.value, Number(paymentDoc.v), paymentDoc.r, paymentDoc.s).then(value => {
          console.log('Claimed ' + value + ' out of ' + paymentChannel.value + ' from channel ' + channelId)
          let next = { ...paymentChannel.toJSON(), state: 2 }
          return new PaymentChannel(next)
        })
      } else {
        return Promise.reject(new Error('Can not claim ' + paymentDoc.value + ' from channel ' + channelId))
      }
    })
  }

  finishSettle(paymentChannel: PaymentChannel): Promise<PaymentChannel> {
    console.log("MicropaymentsController.finishSettle")
    let contract = this.client.contract
    if (contract.canFinishSettle(this.account, paymentChannel.channelId)) {
      return contract.finishSettle(this.account, paymentChannel.channelId).then(payment => {
        console.log('Settled to pay ' + payment + ' to ' + paymentChannel.receiver)
        let next = { ...paymentChannel.toJSON(), state: 2 }
        return new PaymentChannel(next)
      })
    } else {
      let until = contract.getUntil(paymentChannel.channelId)
      return Promise.reject(new Error('Can not finish settle until ' + until))
    }
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

  payInChannel(channel: PaymentChannel, amount: number): Promise<[PaymentChannel, Payment]> {
    return machinomy.Payment.fromPaymentChannel(this.network.web3, channel, amount).then(payment => {
      let nextPaymentChannel = new PaymentChannel(machinomy.channel.PaymentChannel.fromPayment(payment))
      let result: [PaymentChannel, Payment] = [nextPaymentChannel, payment]
      return result
    })
  }
}
