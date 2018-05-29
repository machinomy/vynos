import BackgroundController from './BackgroundController'
import ZeroClientProvider = require('web3-provider-engine/zero')
import * as Engine from 'web3-provider-engine'
import { Payload } from '../../lib/Payload'
import { EndFunction } from '../../lib/StreamServer'
import * as Web3 from 'web3'
import ProviderOptions from './ProviderOptions'
import TransactionService from '../TransactionService'
import { default as SettingStorage, NetworkSetting } from '../../lib/storage/SettingStorage'
import bus from '../../lib/bus'
import {
  CHANGE_NETWORK,
  CHANGE_NETWORK_FOR_MICROPAYMENT_CONTROLLER
} from '../../lib/constants'

const settingStorage = new SettingStorage()

export default class NetworkController {
  background: BackgroundController
  provider: Engine | undefined
  web3: Web3 | undefined
  transactions: TransactionService
  rpcUrl: string
  ready: Promise<NetworkSetting> | undefined

  constructor (backgroundController: BackgroundController, transactions: TransactionService) {
    this.background = backgroundController
    this.transactions = transactions
    this.web3 = undefined
    this.provider = undefined
    this.rpcUrl = ''
    this.ready = undefined
    this.handler = this.handler.bind(this)
    this.getNetwork()

    bus.on(CHANGE_NETWORK, () => {
      this.getNetwork()
    })
  }

  handler (message: Payload, next: Function, end: EndFunction) {
    this.ready!.then((network: NetworkSetting) => {
      this.provider!.sendAsync(message, (error, response) => {
        if (error) {
          end(error)
        } else {
          end(null, response)
        }
      })
    })
  }

  providerOpts (rpcUrl: string): Engine.ProviderOpts {
    let providerOptions = new ProviderOptions(this.background, this.transactions, rpcUrl)
    return providerOptions.walled()
  }

  getNetwork () {
    this.ready = settingStorage.getNetwork().then((network: NetworkSetting) => {
      this.rpcUrl = network.value
      this.provider = ZeroClientProvider(this.providerOpts(this.rpcUrl))
      this.web3 = new Web3(this.provider)
      return Promise.resolve(network)
    })
    this.ready.then((network: NetworkSetting) => {
      bus.emit(CHANGE_NETWORK_FOR_MICROPAYMENT_CONTROLLER)
    })
  }

  getWeb3 (): Web3 | undefined {
    return this.web3
  }
}
