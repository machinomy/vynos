import StreamProvider from './../lib/StreamProvider'
import { Duplex } from 'readable-stream'
import {
  BuyRequest, BuyResponse,
  CloseChannelRequest, CloseChannelResponse, InitAccountRequest, InitAccountResponse, ListChannelsRequest,
  ListChannelsResponse,
  OpenChannelRequest,
  OpenChannelResponse, PayInChannelRequest, PayInChannelResponse
} from '../lib/rpc/yns';
import {JSONRPC, randomId} from "../lib/Payload";
import Promise = require('bluebird')
import {PaymentChannel, PaymentChannelJSON} from "machinomy/lib/channel";
import VynosPayInChannelResponse from "../lib/VynosPayInChannelResponse";
import Vynos from '../lib/Vynos'
import VynosBuyResponse from "../lib/VynosBuyResponse";
import PurchaseMeta, {purchaseMetaFromDocument} from "../lib/PurchaseMeta";
import {SharedState} from "../worker/WorkerState";
import {SharedStateBroadcast, SharedStateBroadcastType} from "../lib/rpc/SharedStateBroadcast";

function isPaymentChannel(pc: PaymentChannel|PaymentChannelJSON): pc is PaymentChannel {
  return !!((pc as PaymentChannel).toJSON)
}

export default class VynosClient implements Vynos {
  depositToChannel (ch: PaymentChannel): Promise<PaymentChannel> {
    return Promise.resolve(ch)
  }

  provider: StreamProvider

  constructor (stream: Duplex) {
    this.provider = new StreamProvider("VynosClient")
    this.provider.pipe(stream).pipe(this.provider)
  }

  initAccount(): Promise<void> {
    let request: InitAccountRequest = {
      id: randomId(),
      method: InitAccountRequest.method,
      jsonrpc: JSONRPC,
      params: []
    }
    return this.provider.ask(request).then((response: InitAccountResponse) => {
      return;
    })
  }

  openChannel (receiverAccount: string, channelValue: BigNumber.BigNumber): Promise<PaymentChannel> {
    let request: OpenChannelRequest = {
      id: randomId(),
      method: OpenChannelRequest.method,
      jsonrpc: JSONRPC,
      params: [receiverAccount, channelValue.toString()]
    }
    return this.provider.ask(request).then((response: OpenChannelResponse) => {
      return PaymentChannel.fromDocument(response.result[0])
    })
  }

  closeChannel(channelId: string): Promise<void> {
    let request: CloseChannelRequest = {
      id: randomId(),
      method: CloseChannelRequest.method,
      jsonrpc: JSONRPC,
      params: [channelId]
    }
    return this.provider.ask<CloseChannelRequest, any>(request)
  }

  payInChannel (channel: PaymentChannel | PaymentChannelJSON, amount: number, override?: boolean): Promise<VynosPayInChannelResponse> {
    let request: PayInChannelRequest = {
      id: randomId(),
      method: PayInChannelRequest.method,
      jsonrpc: JSONRPC,
      params: [channel, amount, override as boolean]
    }
    if (isPaymentChannel(channel)) {
      request.params = [channel.toJSON(), amount, override as boolean]
    }
    return this.provider.ask(request).then((response: PayInChannelResponse) => {
      let paymentChannel = PaymentChannel.fromDocument(response.result[0])
      let payment = response.result[1]
      return {
        channel: paymentChannel,
        payment: payment
      }
    })
  }

  buy (receiver: string, amount: number, gateway: string, meta: string, purchase?: PurchaseMeta, channelValue?: number): Promise<VynosBuyResponse> {
    let _purchase = purchase || purchaseMetaFromDocument(document)
    let request: BuyRequest = {
      id: randomId(),
      method: BuyRequest.method,
      jsonrpc: JSONRPC,
      params: [receiver, amount, gateway, meta, _purchase, channelValue ? channelValue : amount * 10]
    }
    return this.provider.ask(request).then((response: BuyResponse) => {
      if (response.error) {
        return Promise.reject(response.error)
      } else if(!response.result[0].channelId){
        return Promise.reject(response.result[1])
      }else {
        return response.result[0]
      }
    })
  }

  listChannels(): Promise<Array<PaymentChannel>> {
    let request: ListChannelsRequest = {
      id: randomId(),
      method: ListChannelsRequest.method,
      jsonrpc: JSONRPC,
      params: []
    }
    return this.provider.ask(request).then((response: ListChannelsResponse) => {
      return response.result.map(pc => PaymentChannel.fromDocument(pc))
    })
  }

  onSharedStateUpdate(fn: (state: SharedState) => void): void {
    this.provider.listen<SharedStateBroadcast>(SharedStateBroadcastType, broadcast => {
      let state = broadcast.result
      fn(state)
    })
  }
}
