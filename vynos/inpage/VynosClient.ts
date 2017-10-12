import StreamProvider from './../lib/StreamProvider'
import { Duplex } from 'readable-stream'
import {AccountsRequest, AccountsResponse} from '../lib/rpc/eth'
import {
  BuyRequest, BuyResponse,
  CloseChannelRequest, CloseChannelResponse, InitAccountRequest, InitAccountResponse, ListChannelsRequest,
  ListChannelsResponse,
  OpenChannelRequest,
  OpenChannelResponse, PayInChannelRequest, PayInChannelResponse
} from '../lib/rpc/yns';
import {JSONRPC, randomId} from "../lib/Payload";
import Promise = require('bluebird')
import Web3 = require("web3")
import {PaymentChannel, PaymentChannelJSON} from "machinomy/lib/channel";
import VynosPayInChannelResponse from "../lib/VynosPayInChannelResponse";
import Vynos from '../lib/Vynos'
import VynosBuyResponse from "../lib/VynosBuyResponse";
import { ChannelMeta } from "../lib/storage/ChannelMetaStorage"
import PurchaseMeta, {purchaseMetaFromDocument} from "../lib/PurchaseMeta";

function isPaymentChannel(pc: PaymentChannel|PaymentChannelJSON): pc is PaymentChannel {
  return !!((pc as PaymentChannel).toJSON)
}

export default class VynosClient implements Vynos {
  depositToChannel (ch: PaymentChannel): Promise<PaymentChannel> {
    return Promise.resolve(ch)
  }


  makePayment () {
    throw new Error("Not Implemented")
  }

  provider: StreamProvider

  constructor (stream: Duplex) {
    this.provider = new StreamProvider("VynosClient")
    this.provider.pipe(stream).pipe(this.provider)
  }

  getAccount(): Promise<string> {
    let request = new AccountsRequest()
    return this.provider.ask(request).then((response: AccountsResponse) => {
      return response.result[0]
    })
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

  getWeb3(): Promise<Web3> {
    return Promise.resolve(new Web3(this.provider))
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

  closeChannel(channel: string): Promise<string> {
    let request: CloseChannelRequest = {
      id: randomId(),
      method: CloseChannelRequest.method,
      jsonrpc: JSONRPC,
      params: [channel]
    }
    // if (isPaymentChannel(channel)) {
    //   request.params = [channel.toJSON()]
    // }
    return this.provider.ask(request).then((response: CloseChannelResponse) => {
      // return PaymentChannel.fromDocument(response.result[0])
      return response.result[0]
    })
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

  buy (receiver: string, amount: number, gateway: string, purchase?: PurchaseMeta): Promise<VynosBuyResponse> {
    let _purchase = purchase || purchaseMetaFromDocument(document)
    let request: BuyRequest = {
      id: randomId(),
      method: BuyRequest.method,
      jsonrpc: JSONRPC,
      params: [receiver, amount, gateway, _purchase]
    }
    return this.provider.ask(request).then((response: BuyResponse) => {
      return response.result[0]
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
}
