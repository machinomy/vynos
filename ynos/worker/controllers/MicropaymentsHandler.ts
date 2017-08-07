import MicropaymentsController from "./MicropaymentsController";
import {RequestPayload} from "../../lib/Payload";
import {EndFunction} from "../../lib/StreamServer";
import {
  CloseChannelRequest, CloseChannelResponse, ListChannelsRequest, ListChannelsResponse, OpenChannelRequest,
  OpenChannelResponse,
  PayInChannelRequest, PayInChannelResponse
} from "../../lib/rpc/yns";
import {PaymentChannel} from "machinomy/lib/channel";
import Payment from "machinomy/lib/Payment";

export default class MicropaymentsHandler {
  controller: MicropaymentsController

  constructor(controller: MicropaymentsController) {
    this.controller = controller
    this.handler = this.handler.bind(this)
  }

  openChannel(message: OpenChannelRequest, next: Function, end: EndFunction) {
    let receiver = message.params[0]
    let amount = parseInt(message.params[1]) // FIXME Quite a real bug
    this.controller.openChannel(receiver, amount).then(channel => {
      let response: OpenChannelResponse = {
        id: message.id,
        jsonrpc: message.jsonrpc,
        result: [channel.toJSON()]
      }
      end(null, response)
    }).catch(end)
  }

  closeChannel(message: CloseChannelRequest, next: Function, end: EndFunction) {
    let channel = PaymentChannel.fromDocument(message.params[0])
    this.controller.closeChannel(channel).then(channel => {
      let response: CloseChannelResponse = {
        id: message.id,
        jsonrpc: message.jsonrpc,
        result: [channel.toJSON()]
      }
      end(null, response)
    }).catch(end)
  }

  payInChannel(message: PayInChannelRequest, next: Function, end: EndFunction) {
    let channel = PaymentChannel.fromDocument(message.params[0])
    let amount = message.params[1]
    let override = message.params[2]
    this.controller.payInChannel(channel, amount, override).then(tuple => {
      let channel: PaymentChannel = tuple[0]
      let payment: Payment = tuple[1]
      let response: PayInChannelResponse = {
        id: message.id,
        jsonrpc: message.jsonrpc,
        result: [channel.toJSON(), payment]
      }
      end(null, response)
    }).catch(end)
  }

  listChannels(message: ListChannelsRequest, next: Function, end: EndFunction) {
    this.controller.listChannels().then(channels => {
      let response: ListChannelsResponse = {
        id: message.id,
        jsonrpc: message.jsonrpc,
        result: channels.map(pc => pc.toJSON())
      }
      end(null, response)
    })
  }

  handler (message: RequestPayload, next: Function, end: EndFunction) {
    if (OpenChannelRequest.match(message)) {
      this.openChannel(message, next, end)
    } else if (CloseChannelRequest.match(message)) {
      this.closeChannel(message, next, end)
    } else if (PayInChannelRequest.match(message)) {
      this.payInChannel(message, next, end)
    } else if (ListChannelsRequest.match(message)) {
      this.listChannels(message, next, end)
    } else {
      next()
    }
  }
}
