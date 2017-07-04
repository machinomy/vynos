import {DevWindow, YnosWindow} from "./YnosWindow";
import {Duplex} from "readable-stream";
import FrameStream from "./lib/FrameStream";
import StreamProvider from "./lib/StreamProvider";
import {AccountsRequest, AccountsResponse} from "./lib/rpc/eth";
import {JSONRPC, randomId} from "./lib/Payload"
import {InitAccountRequest, InitAccountResponse, OpenChannelRequest, OpenChannelResponse} from "./lib/rpc/yns";
import Web3 from "web3"
import PaymentChannel from "./lib/PaymentChannel";
import BigNumber from "bignumber.js";

let _window = (<DevWindow & YnosWindow>window);

function buildFrame(): HTMLIFrameElement {
  let frame = document.createElement('iframe');
  frame.id = 'ynos_frame';
  frame.src = _window.FRAME_URL;
  frame.style.borderWidth = '0px';
  frame.style.position = 'fixed';
  frame.style.top = '0px';
  frame.style.right = '0px';
  frame.style.bottom = '0px';
  frame.height = '100%';
  frame.width = '320px';
  //frame.style.marginRight = '-320px';
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
  payInChannel: (ch: PaymentChannel, amount: number) => Promise<PaymentChannel> // FIXME What about lifecycle events?
  initAccount: () => Promise<string>
  initFrame: () => Promise<void>
  getWeb3(): Promise<Web3>
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

  initAccount(): Promise<string> {
    let request: InitAccountRequest = {
      id: randomId(),
      method: InitAccountRequest.method,
      jsonrpc: JSONRPC,
      params: []
    }
    return this.streamProvider.ask(request).then((response: InitAccountResponse) => {
      return response.result[0]
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
      return new PaymentChannel(response.result[0])
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
    return Promise.resolve(ch)
  }

  listChannels (): Promise<Array<PaymentChannel>> {
    return Promise.resolve([])
  }

  makePayment () {

  }

  payInChannel (ch: PaymentChannel, amount: number): Promise<PaymentChannel> {
    return Promise.resolve(ch)
  }

  depositToChannel (ch: PaymentChannel): Promise<PaymentChannel> {
    return Promise.resolve(ch)
  }

  initAccount (): Promise<string> {
    if (!this.client) return Promise.reject(new Error("Do initFrame first"))

    return this.client.initAccount()
  }

  initFrame (): Promise<void> {
    if (this.frame) return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
      try {
        this.frame = buildFrame();
        this.stream = new FrameStream("ynos").toFrame(this.frame);
        this.client = new YnosClient(this.stream)
        document.body.appendChild(this.frame);
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
