import {DevWindow, YnosWindow} from "./YnosWindow";
import {Duplex} from "readable-stream";
import FrameStream from "./lib/FrameStream";
import dnode from "dnode/browser";
import {PortStream} from "./lib/PortStream";
import StreamProvider from "./lib/StreamProvider";
import {AccountsRequest, AccountsResponse} from "./lib/rpc/eth";
import {randomId} from "./lib/Payload"
import {InitAccountRequest, InitAccountResponse} from "./lib/rpc/yns";

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
  frame.setAttribute("sandbox", "allow-scripts allow-modals allow-same-origin");
  return frame;
}

export interface Ynos {
  getAccount: () => Promise<string>
  openChannel: () => void
  depositToChannel: () => void
  closeChannel: () => void
  listChannels: () => void
  makePayment: () => void
  payInChannel: () => void
  initAccount: () => Promise<string>
  initFrame: () => Promise<void>
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
    let request = new InitAccountRequest()
    return this.streamProvider.ask(request).then((response: InitAccountResponse) => {
      return response.result[0]
    })
  }
}

class YnosImpl implements Ynos {
  frame: HTMLIFrameElement;
  stream: Duplex;
  client: YnosClient

  getAccount (): Promise<string> {
    return this.client.getAccount();
  }

  openChannel () {

  }

  closeChannel () {

  }

  listChannels () {

  }

  makePayment () {

  }

  payInChannel () {

  }

  depositToChannel (): void {

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
}

let ynosPresent = _window.ynos && _window.ynos instanceof YnosImpl;
if (!ynosPresent) {
  _window.ynos = new YnosImpl();
}
