import NetworkController from "./NetworkController";
import BackgroundController from "./BackgroundController";
import PaymentChannel from "../../lib/PaymentChannel";
import {buildMachinomyClient} from "../../lib/micropayments";
import * as machinomy from "machinomy";

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
    if (this.account) {
      return this.client.contract.buildPaymentChannel(this.account, receiver, amount).then(pc => {
        return new PaymentChannel(pc)
      })
    } else {
      return Promise.reject("account is not ready")
    }
  }
}
