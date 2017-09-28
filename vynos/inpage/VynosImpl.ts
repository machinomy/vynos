import Vynos from '../lib/Vynos'
import {Duplex} from 'readable-stream'
import VynosClient from './VynosClient'
import Promise = require('bluebird')
import {PaymentChannel} from 'machinomy/lib/channel'
import FrameStream from '../lib/FrameStream'
import Web3 = require('web3')
import VynosPayInChannelResponse from "../lib/VynosPayInChannelResponse";
import Frame from './Frame'

export default class VynosImpl implements Vynos {
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

  getWeb3(): Promise<Web3> {
    if (!this.client) return Promise.reject(new Error("Do initFrame first"));

    return Promise.resolve(this.client.getWeb3())
  }
}
