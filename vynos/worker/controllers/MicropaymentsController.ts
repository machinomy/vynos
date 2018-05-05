import NetworkController from './NetworkController'
import BackgroundController from './BackgroundController'
import { PaymentChannel } from 'machinomy/dist/lib/payment_channel'
import Payment from 'machinomy/dist/lib/payment'
import VynosBuyResponse from '../../lib/VynosBuyResponse'
import Machinomy from 'machinomy'
import ZeroClientProvider = require('web3-provider-engine/zero')
import { ProviderOpts } from 'web3-provider-engine'
import ProviderOptions from './ProviderOptions'
import Web3 = require('web3')
import TransactionService from '../TransactionService'
import * as transactions from '../../lib/transactions'
import PurchaseMeta from '../../lib/PurchaseMeta'
import ChannelMetaStorage from '../../lib/storage/ChannelMetaStorage'
import TransactionState from '../../lib/TransactionState'
import TransactionMeta from '../../lib/TransactionMeta'
import * as actions from '../actions'
import bus from '../../lib/bus'
import { SharedState } from '../WorkerState'
import * as events from '../../lib/events'
import { BuyProcessEvent } from '../../lib/rpc/buyProcessEventBroadcast'
import { WalletBuyArguments } from '../../lib/Vynos'
import { CHANGE_NETWORK_FOR_MICROPAYMENT_CONTROLLER } from '../../lib/constants'
import { resource } from '../../lib/helpers'

const timeparse = require('timeparse')

export default class MicropaymentsController {
  network: NetworkController
  background: BackgroundController
  transactions: TransactionService
  channels: ChannelMetaStorage
  web3: Web3 | undefined

  constructor (network: NetworkController, background: BackgroundController, transactions: TransactionService) {
    this.network = network
    this.background = background
    this.transactions = transactions
    this.channels = new ChannelMetaStorage()
    this.web3 = undefined
    this.background.awaitUnlock(() => {
      this.background.getAccounts().then(accounts => {
        let provider = ZeroClientProvider(this.providerOpts(network.rpcUrl))
        this.web3 = new Web3(provider)
      })
    })

    bus.on(CHANGE_NETWORK_FOR_MICROPAYMENT_CONTROLLER, async () => {
      this.transactions.storage.changeNetwork().catch((error) => console.error(error))
      this.channels.changeNetwork().catch((error) => console.error(error))
      let provider = ZeroClientProvider(this.providerOpts(this.network.rpcUrl))
      this.web3 = new Web3(provider)
    })
  }

  providerOpts (rpcUrl: string): ProviderOpts {
    let providerOptions = new ProviderOptions(this.background, this.transactions, rpcUrl)
    return providerOptions.approving()
  }

  openChannel (receiver: string, amount: number): Promise<PaymentChannel> {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  closeChannel (channelId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.background.awaitUnlock(() => {
        this.background.getAccounts().then(accounts => {
          let account = accounts[0]
          let machinomy = new Machinomy(account, this.web3!, { databaseUrl: 'nedb://vynos' })
          machinomy.close(channelId).then(() => {
            let channelDescription = JSON.stringify({ channelId: channelId })
            let transaction = transactions.closeChannel(channelDescription)
            return this.transactions.addTransaction(transaction).then(() => {
              resolve(channelId)
            })
          }).catch(reject)
        })
      })
    })
  }

  payInChannel (channel: PaymentChannel, amount: number, override?: boolean): Promise<[PaymentChannel, Payment]> {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  buy (receiver: string, amount: number, gateway: string, meta: string, purchaseMeta: PurchaseMeta, channelValue?: number): Promise<VynosBuyResponse> {
    return this.checkGateway(gateway).then(() => {
      return new Promise<VynosBuyResponse>((resolve, reject) => {
        this.background.awaitUnlock(async () => {
          let transaction = transactions.micropayment(purchaseMeta, receiver, amount)
          let sharedState = await this.background.getSharedState()
          await this.approve(sharedState, transaction, async () => {
            try {
              let walletBuyArguments: WalletBuyArguments = new WalletBuyArguments(receiver, amount, gateway, meta, purchaseMeta, channelValue)
              let accounts = await this.background.getAccounts()
              let account = accounts[0]
              let options: any
              if (channelValue !== undefined) {
                options = { databaseUrl: 'nedb://vynos', minimumChannelAmount: channelValue }
              } else {
                options = { databaseUrl: 'nedb://vynos' }
              }
              let machinomy = new Machinomy(account, this.web3!, options)
              let response: VynosBuyResponse = await machinomy.buy({
                receiver: receiver,
                price: amount,
                gateway: gateway,
                meta: meta
              })
              bus.emit(BuyProcessEvent.SENT_PAYMENT, walletBuyArguments)
              bus.emit(BuyProcessEvent.RECEIVED_TOKEN, walletBuyArguments, response.token)

              let channelFound = await this.channels.firstById(response.channelId)
              if (!channelFound) {
                bus.emit(BuyProcessEvent.NO_CHANNEL_FOUND, walletBuyArguments)
                bus.emit(BuyProcessEvent.OPENING_CHANNEL_STARTED, walletBuyArguments)

                let newChannelMeta = {
                  channelId: response.channelId,
                  title: purchaseMeta.siteName,
                  host: purchaseMeta.origin,
                  icon: resource('/frame/styles/images/channel.png'),
                  openingTime: Date.now()
                }
                await this.channels.save(newChannelMeta)
                let channelDescription = JSON.stringify({ channelId: response.channelId })
                let transaction = transactions.openChannel('Opening of channel', channelDescription, account, receiver, channelValue ? channelValue : amount * 10)
                await this.transactions.addTransaction(transaction)
                bus.emit(BuyProcessEvent.OPENING_CHANNEL_FINISHED, walletBuyArguments, newChannelMeta)
              } else {
                bus.emit(BuyProcessEvent.CHANNEL_FOUND, walletBuyArguments, channelFound)
              }
              transaction.state = TransactionState.APPROVED
              await this.background.setLastMicropaymentTime(Date.now())
              resolve(response)
              bus.emit(BuyProcessEvent.SENT_TOKEN, walletBuyArguments, response.token)
            } catch (e) {
              reject(e)
            }
          })
          let rejectedEvent = events.txRejected(transaction.id)
          bus.once(rejectedEvent, () => {
            reject('Micropayment is rejected by the user')
          })
        })
      })
    }).catch((error: Error) => { return { channelId: '', token: '' } as VynosBuyResponse })
  }

  listChannels (): Promise<Array<PaymentChannel>> {
    return new Promise((resolve, reject) => {
      this.background.awaitUnlock(() => {
        this.background.getAccounts().then(accounts => {
          let account = accounts[0]
          let machinomy = new Machinomy(account, this.web3!, { databaseUrl: 'nedb://vynos' })
          machinomy.channels().then(resolve).catch(reject)
        })
      })
    })
  }

  private checkGateway (gateway: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fetch(gateway, { method: 'HEAD' }).then(response => {
        if (response.status >= 200 && response.status < 300) {
          resolve()
        } else {
          reject('Unsuccessful response from gateway. Response status: ' + response.status)
        }
      }).catch(error => {
        console.error('Gateway unavailable. Error: ' + error)
        reject('Gateway unavailable. Error: ' + error)
      })
    })
  }

  private async approve (sharedState: SharedState, transaction: TransactionMeta, fn: () => void) {
    let interval = Date.now() - sharedState.lastMicropaymentTime
    let throttlingInMs = -1
    if (sharedState.preferences.micropaymentThrottlingHumanReadable === '-1ms'
      || sharedState.preferences.micropaymentThrottlingHumanReadable === '0'
      || sharedState.preferences.micropaymentThrottlingHumanReadable.length === 0) {
      throttlingInMs = -1
    } else if (/^\d+$/.test(sharedState.preferences.micropaymentThrottlingHumanReadable)) {
      throttlingInMs = parseInt(sharedState.preferences.micropaymentThrottlingHumanReadable, 10)
    } else {
      throttlingInMs = timeparse(sharedState.preferences.micropaymentThrottlingHumanReadable)
    }

    if (transaction.amount > sharedState.preferences.micropaymentThreshold || interval < throttlingInMs) {
      transaction.state = TransactionState.PENDING
      await this.transactions.addTransaction(transaction)
      await this.transactions.store.dispatch(actions.setTransactionPending(true))
      bus.once(events.txApproved(transaction.id), fn)
    } else {
      await this.transactions.addTransaction(transaction)
      fn()
    }
  }
}
