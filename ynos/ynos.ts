import {DevWindow, YnosWindow} from "./YnosWindow";
import {Duplex} from "readable-stream";
import FrameStream from "./lib/FrameStream";
import StreamProvider from "./lib/StreamProvider";
import {AccountsRequest, AccountsResponse} from "./lib/rpc/eth";
import {JSONRPC, randomId} from "./lib/Payload"
import {
  CloseChannelRequest, CloseChannelResponse, InitAccountRequest, InitAccountResponse, ListChannelsRequest,
  ListChannelsResponse,
  OpenChannelRequest,
  OpenChannelResponse, PayInChannelRequest, PayInChannelResponse
} from "./lib/rpc/yns";
import Web3 from "web3"
import BigNumber from "bignumber.js";
import {Payment, PaymentChannel} from "machinomy/lib/channel";
import Promise = require('bluebird')

let _window = (<DevWindow & YnosWindow>window);

function buildFrame(frame?: HTMLIFrameElement): HTMLIFrameElement {
  if (!frame) {
    frame = document.createElement('iframe');
    frame.id = 'ynos_frame';
    frame.style.borderWidth = '0px';
    frame.style.position = 'fixed';
    frame.style.top = '0px';
    frame.style.right = '0px';
    frame.style.bottom = '0px';
    frame.height = '100%';
    frame.width = '320px';
    //frame.style.marginRight = '-320px';
  }
  frame.src = _window.FRAME_URL;
  frame.setAttribute("sandbox", "allow-scripts allow-modals allow-same-origin allow-popups allow-forms");
  return frame;
}

export interface Ynos {
  getAccount: () => Promise<string>
  openChannel: (receiverAccount: string, channelValue: BigNumber.BigNumber) => Promise<PaymentChannel>
  depositToChannel: (ch: PaymentChannel) => Promise<PaymentChannel>
  closeChannel: (ch: PaymentChannel) => Promise<PaymentChannel>;
  listChannels: () => Promise<Array<PaymentChannel>>;
  makePayment: () => void // web3.eth.sendTransaction
  payInChannel: (ch: PaymentChannel, amount: number) => Promise<YnosPayInChannelResponse> // FIXME What about lifecycle events? Amount is bignumber, actually.
  initAccount: () => Promise<void>
  initFrame: (frame?: HTMLIFrameElement) => Promise<void>
  getWeb3(): Promise<Web3>
}

export type YnosPayInChannelResponse = {
  channel: PaymentChannel
  payment: Payment
}

class YnosClient {
  streamProvider: StreamProvider

  constructor (stream: Duplex) {
    this.streamProvider = new StreamProvider("YnosClient")
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

  getWeb3(): Web3 {
    let web3 = new Web3()
    web3.setProvider(this.streamProvider)
    return web3
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

  closeChannel(channel: PaymentChannel): Promise<PaymentChannel> {
    let request: CloseChannelRequest = {
      id: randomId(),
      method: CloseChannelRequest.method,
      jsonrpc: JSONRPC,
      params: [channel.toJSON()]
    }
    return this.streamProvider.ask(request).then((response: CloseChannelResponse) => {
      return PaymentChannel.fromDocument(response.result[0])
    })
  }


  payInChannel (channel: PaymentChannel, amount: number): Promise<YnosPayInChannelResponse> {
    let request: PayInChannelRequest = {
      id: randomId(),
      method: PayInChannelRequest.method,
      jsonrpc: JSONRPC,
      params: [channel.toJSON(), amount]
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

class YnosImpl implements Ynos {
  frame: HTMLIFrameElement;
  stream: Duplex;
  client: YnosClient

  getAccount (): Promise<string> {
    if (!this.client) return Promise.reject(new Error("Do initFrame first"))

    return this.client.getAccount();
  }

  openChannel (receiverAccount: string, channelValue: BigNumber.BigNumber): Promise<PaymentChannel> {
    if (!this.client) return Promise.reject(new Error("Do initFrame first"))

    return this.client.openChannel(receiverAccount, channelValue)
  }

  closeChannel (ch: PaymentChannel): Promise<PaymentChannel> {
    if (!this.client) return Promise.reject(new Error("Do initFrame first"))

    return this.client.closeChannel(ch)
  }

  listChannels (): Promise<Array<PaymentChannel>> {
    if (!this.client) return Promise.reject(new Error("Do initFrame first"))

    return this.client.listChannels()
  }

  makePayment () {
    throw new Error("Not Implemented")
  }

  payInChannel (ch: PaymentChannel, amount: number): Promise<YnosPayInChannelResponse> {
    if (!this.client) return Promise.reject(new Error("Do initFrame first"))

    return this.client.payInChannel(ch, amount)
  }

  depositToChannel (ch: PaymentChannel): Promise<PaymentChannel> {
    return Promise.resolve(ch)
  }

  initAccount (): Promise<void> {
    if (!this.client) return Promise.reject(new Error("Do initFrame first"))

    return this.client.initAccount()
  }

  initFrame (frame?: HTMLIFrameElement): Promise<void> {
    if (this.frame) return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
      try {
        this.frame = buildFrame(frame);
        this.stream = new FrameStream("ynos").toFrame(this.frame);
        this.client = new YnosClient(this.stream)
        if (!this.frame.parentElement) {
          document.body.appendChild(this.frame);
        }
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  getWeb3(): Promise<Web3> {
    if (!this.client) return Promise.reject(new Error("Do initFrame first"));

    return Promise.resolve(this.client.getWeb3())
  }
}

let ynosPresent = _window.ynos && _window.ynos instanceof YnosImpl;
if (!ynosPresent) {
  _window.ynos = new YnosImpl()
}
