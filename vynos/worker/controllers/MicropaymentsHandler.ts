import MicropaymentsController from './MicropaymentsController'
import { RequestPayload } from '../../lib/Payload'
import { EndFunction } from '../../lib/StreamServer'
import {
  BuyRequest,
  BuyResponse,
  CloseChannelRequest,
  CloseChannelResponse,
  ListChannelsRequest,
  ListChannelsResponse,
  OpenChannelRequest,
  OpenChannelResponse,
  SetApproveByIdRequest,
  SetApproveByIdResponse,
  SetRejectByIdRequest,
  SetRejectByIdResponse
} from '../../lib/rpc/yns'
import { PaymentChannelSerde } from 'machinomy/dist/lib/payment_channel'

export default class MicropaymentsHandler {
  controller: MicropaymentsController

  constructor (controller: MicropaymentsController) {
    this.controller = controller
    this.handler = this.handler.bind(this)
  }

  openChannel (message: OpenChannelRequest, next: Function, end: EndFunction) {
    let receiver = message.params[0]
    let amount = parseInt(message.params[1], 10) // FIXME Quite a real bug
    this.controller.openChannel(receiver, amount).then(channel => {
      let response: OpenChannelResponse = {
        id: message.id,
        jsonrpc: message.jsonrpc,
        result: [PaymentChannelSerde.instance.serialize(channel)]
      }
      end(null, response)
    }).catch(end)
  }

  closeChannel (message: CloseChannelRequest, next: Function, end: EndFunction) {
    let channelId = message.params[0]
    this.controller.closeChannel(channelId).then(channelId => {
      let response: CloseChannelResponse = {
        id: message.id,
        jsonrpc: message.jsonrpc,
        result: [channelId]
      }
      end(null, response)
    }).catch(end)
  }

  listChannels (message: ListChannelsRequest, next: Function, end: EndFunction) {
    this.controller.listChannels().then(channels => {
      let response: ListChannelsResponse = {
        id: message.id,
        jsonrpc: message.jsonrpc,
        result: channels.map(pc => PaymentChannelSerde.instance.serialize(pc))
      }
      end(null, response)
    }).catch(end)
  }

  buy (message: BuyRequest, next: Function, end: EndFunction) {
    let receiver = message.params[0]
    let amount = message.params[1]
    let gateway = message.params[2]
    let meta = message.params[3]
    let purchaseMeta = message.params[4]
    let channelValue = message.params[5]
    this.controller.buy(receiver, amount, gateway, meta, purchaseMeta, channelValue).then(vynosBuyResponse => {
      let response: BuyResponse = {
        id: message.id,
        jsonrpc: message.jsonrpc,
        result: [vynosBuyResponse]
      }
      end(null, response)
    }).catch(end)
  }

  setApproveById (message: SetApproveByIdRequest, next: Function, end: EndFunction) {
    let id = message.params[0]
    this.controller.transactions.setApproveById(id).then(() => {
      let response: SetApproveByIdResponse = {
        id: message.id,
        jsonrpc: message.jsonrpc,
        result: null
      }
      end(null, response)
    }).catch(end)
  }

  setRejectById (message: SetRejectByIdRequest, next: Function, end: EndFunction) {
    let id = message.params[0]
    this.controller.transactions.setRejectById(id).then(() => {
      let response: SetRejectByIdResponse = {
        id: message.id,
        jsonrpc: message.jsonrpc,
        result: null
      }
      end(null, response)
    }).catch(end)
  }

  handler (message: RequestPayload, next: Function, end: EndFunction) {
    if (OpenChannelRequest.match(message)) {
      this.openChannel(message, next, end)
    } else if (CloseChannelRequest.match(message)) {
      this.closeChannel(message, next, end)
    } else if (ListChannelsRequest.match(message)) {
      this.listChannels(message, next, end)
    } else if (BuyRequest.match(message)) {
      this.buy(message, next, end)
    } else if (SetApproveByIdRequest.match(message)) {
      this.setApproveById(message, next, end)
    } else if (SetRejectByIdRequest.match(message)) {
      this.setRejectById(message, next, end)
    } else {
      next()
    }
  }
}
