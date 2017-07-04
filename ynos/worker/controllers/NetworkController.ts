import BackgroundController from "./BackgroundController";
import ZeroClientProvider from "web3-provider-engine/zero"
import {Engine, ProviderOpts} from "web3-provider-engine";
import {Payload} from "../../lib/Payload";
import {EndFunction} from "../../lib/StreamServer";

export default class NetworkController {
  background: BackgroundController
  provider: Engine

  constructor (backgroundController: BackgroundController) {
    this.background = backgroundController
    this.provider = ZeroClientProvider(this.providerOpts())

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

  getAccounts(callback: (err: any, accounts?: Array<string>) => void) {
    this.background.getAccounts().then(accounts =>
      callback(null, accounts)
    ).catch(error => {
      callback(error)
    })
  }

  providerOpts(): ProviderOpts {
    return {
      getAccounts: this.getAccounts.bind(this)
    }
  }
}
