import BackgroundController from "./BackgroundController";
import ZeroClientProvider = require("web3-provider-engine/zero")
import {ProviderOpts} from "web3-provider-engine";
import Engine = require('web3-provider-engine')
import {Payload} from "../../lib/Payload";
import {EndFunction} from "../../lib/StreamServer";
import Web3 = require("web3")
import ProviderOptions from "./ProviderOptions";

export type ApproveTransactionCallback = (error: any, isApproved: true) => void

export default class NetworkController {
  background: BackgroundController
  provider: Engine
  web3: Web3
  rpcUrl: string

  constructor (backgroundController: BackgroundController, rpcUrl: string) {
    this.rpcUrl = rpcUrl
    this.background = backgroundController
    this.provider = ZeroClientProvider(this.providerOpts(rpcUrl))
    this.web3 = new Web3(this.provider)

    this.handler = this.handler.bind(this)
  }

  handler(message: Payload, next: Function, end: EndFunction) {
    this.provider.sendAsync(message, (error, response) => {
      if (error) {
        end(error)
      } else {
        end(null, response)
      }
    })
  }

  providerOpts(rpcUrl: string): ProviderOpts {
    let providerOptions = new ProviderOptions(this.background, rpcUrl)
    return providerOptions.walled()
  }
}
