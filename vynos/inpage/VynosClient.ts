import StreamProvider from './../lib/StreamProvider'
import { Duplex } from 'readable-stream'
import {AccountsRequest, AccountsResponse} from '../lib/rpc/eth'
import {
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


  initFrame (frame?: HTMLIFrameElement): Promise<void> {
    return Promise.reject('foo')
    /*
    if (this.frame) return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
      try {
        let f = new Frame(this.currentScript, frame)
        this.frame = f.build()
        this.stream = new FrameStream("vynos").toFrame(this.frame);
        this.client = new VynosClient(this.stream)
        if (!this.frame.parentElement) {
          document.body.appendChild(this.frame);
        }
        resolve();
      } catch (e) {
        reject(e);
      }
    });
    */
  }

  streamProvider: StreamProvider

  constructor (stream: Duplex) {
    this.streamProvider = new StreamProvider("VynosClient")
    this.streamProvider.pipe(stream).pipe(this.streamProvider)
  }

  getAccount(): Promise<string> {
    let request = new AccountsRequest()
    return this.streamProvider.ask(request).then((response: AccountsResponse) => {
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
    return this.streamProvider.ask(request).then((response: InitAccountResponse) => {
      return;
    })
  }

  getWeb3(): Promise<Web3> {
    return Promise.resolve(new Web3(this.streamProvider))
  }

  openChannel (receiverAccount: string, channelValue: BigNumber.BigNumber): Promise<PaymentChannel> {
    let request: OpenChannelRequest = {
      id: randomId(),
      method: OpenChannelRequest.method,
      jsonrpc: JSONRPC,
      params: [receiverAccount, channelValue.toString()]
    }
    return this.streamProvider.ask(request).then((response: OpenChannelResponse) => {
      return PaymentChannel.fromDocument(response.result[0])
    })
  }

  closeChannel(channel: PaymentChannel | PaymentChannelJSON): Promise<PaymentChannel> {
    let request: CloseChannelRequest = {
      id: randomId(),
      method: CloseChannelRequest.method,
      jsonrpc: JSONRPC,
      params: [channel]
    }
    if (isPaymentChannel(channel)) {
      request.params = [channel.toJSON()]
    }
    return this.streamProvider.ask(request).then((response: CloseChannelResponse) => {
      return PaymentChannel.fromDocument(response.result[0])
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
    return this.streamProvider.ask(request).then((response: PayInChannelResponse) => {
      let paymentChannel = PaymentChannel.fromDocument(response.result[0])
      let payment = response.result[1]
      return {
        channel: paymentChannel,
        payment: payment
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
    return this.streamProvider.ask(request).then((response: ListChannelsResponse) => {
      return response.result.map(pc => PaymentChannel.fromDocument(pc))
    })
  }
}
