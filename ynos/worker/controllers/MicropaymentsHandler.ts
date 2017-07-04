import MicropaymentsController from "./MicropaymentsController";
import {RequestPayload} from "../../lib/Payload";
import {EndFunction} from "../../lib/StreamServer";
import {OpenChannelRequest, OpenChannelResponse} from "../../lib/rpc/yns";

export default class MicropaymentsHandler {
  controller: MicropaymentsController

  constructor(controller: MicropaymentsController) {
    this.controller = controller
    this.handler = this.handler.bind(this)
  }

  openChannel(message: OpenChannelRequest, next: Function, end: EndFunction) {
    let receiver = message.params[0]
    let amount = message.params[1]
    console.log("openChannel", message.params)
    this.controller.openChannel(receiver, parseInt(amount)).then(channel => {
      let response: OpenChannelResponse = {
        id: message.id,
        jsonrpc: message.jsonrpc,
        result: [channel.toJSON()]
      }
      end(null, response)
    }).catch(end)
  }

  handler (message: RequestPayload, next: Function, end: EndFunction) {
    if (OpenChannelRequest.match(message)) {
      this.openChannel(message, next, end)
    } else {
      next()
    }
  }
}
