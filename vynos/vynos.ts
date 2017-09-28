import {DevWindow, VynosWindow} from "./YnosWindow";
import {Duplex} from "readable-stream";
import FrameStream from "./lib/FrameStream";
import Web3 = require("web3")
import BigNumber from "bignumber.js";
import {PaymentChannel, PaymentChannelJSON} from "machinomy/lib/channel";
import Promise = require('bluebird')
import Vynos from './lib/Vynos'
import VynosClient from './inpage/VynosClient'
import VynosPayInChannelResponse from './lib/VynosPayInChannelResponse'

let _window = (<DevWindow & VynosWindow>window);

function buildFrame(script: HTMLScriptElement, frame?: HTMLIFrameElement): HTMLIFrameElement {
  if (!frame) {
    frame = document.createElement('iframe');
    frame.id = 'ynos_frame';
    frame.style.borderWidth = '0px';
    frame.style.position = 'fixed';
    frame.style.top = '0px';
    frame.style.right = '110px';
    frame.style.bottom = '0px';
    frame.style.boxShadow = 'rgba(0, 0, 0, 0.1) 7px 10px 60px 10px';
    frame.height = '440px';
    frame.width = '320px';

    //frame.style.marginRight = '-320px';
  }
  let currentScriptAddress = script.src
  frame.src = currentScriptAddress.replace('vynos.bundle.js', 'frame.html')
  frame.setAttribute("sandbox", "allow-scripts allow-modals allow-same-origin allow-popups allow-forms");
  return frame;
}

class VynosImpl implements Vynos {
  frame: HTMLIFrameElement
  stream: Duplex
  client: VynosClient
  currentScript: HTMLScriptElement

  constructor(currentScript: HTMLScriptElement) {
    this.currentScript = currentScript
  }

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

  payInChannel (ch: PaymentChannel, amount: number, override?: boolean): Promise<VynosPayInChannelResponse> {
    if (!this.client) return Promise.reject(new Error("Do initFrame first"))

    return this.client.payInChannel(ch, amount, override)
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
        this.frame = buildFrame(this.currentScript, frame);
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
  }

  getWeb3(): Promise<Web3> {
    if (!this.client) return Promise.reject(new Error("Do initFrame first"));

    return Promise.resolve(this.client.getWeb3())
  }
}

let ynosPresent = _window.vynos && _window.vynos instanceof VynosImpl;
if (!ynosPresent) {
  _window.vynos = new VynosImpl(document.currentScript as HTMLScriptElement)
}
