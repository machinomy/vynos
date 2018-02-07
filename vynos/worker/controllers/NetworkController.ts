import BackgroundController from "./BackgroundController";
import ZeroClientProvider = require("web3-provider-engine/zero")
import { ProviderOpts } from "web3-provider-engine";
import Engine = require('web3-provider-engine')
import { Payload } from "../../lib/Payload";
import { EndFunction } from "../../lib/StreamServer";
import Web3 = require("web3")
import ProviderOptions from "./ProviderOptions";
import TransactionService from "../TransactionService";
import SettingStorage from "../../lib/storage/SettingStorage";
import Promise = require('bluebird')
import { default as globalEvents } from '../../lib/GlobalEvents'
import { CHANGE_NETWORK } from '../../lib/constants'

const settingStorage = new SettingStorage()

export default class NetworkController {
  background: BackgroundController
  provider: Engine
  web3: Web3
  transactions: TransactionService
  rpcUrl: string
  ready: Promise<void>

  constructor (backgroundController: BackgroundController, transactions: TransactionService) {
    this.background = backgroundController
    this.transactions = transactions
    this.handler = this.handler.bind(this)
    this.getNetwork()

    globalEvents.on(CHANGE_NETWORK, () => {
      this.getNetwork()
    })
  }

  handler (message: Payload, next: Function, end: EndFunction) {
    this.ready.then(() => {
      this.provider.sendAsync(message, (error, response) => {
        if (error) {
          end(error)
        } else {
          end(null, response)
        }
      })
    })
  }

  providerOpts (rpcUrl: string): ProviderOpts {
    let providerOptions = new ProviderOptions(this.background, this.transactions, rpcUrl)
    return providerOptions.walled()
  }

  getNetwork () {
    this.ready = settingStorage.getNetwork().then((network: any) => {
      this.rpcUrl = network.value
      this.provider = ZeroClientProvider(this.providerOpts(this.rpcUrl))
      this.web3 = new Web3(this.provider)
    })
  }
}
