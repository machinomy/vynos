import VynosClient from './VynosClient'
import Promise = require('bluebird')
import Frame from "./Frame";
import FrameStream from "../lib/FrameStream";
import isReady from "../lib/isReady";

export default class Namespace {
  scriptAddress: string
  window: Window
  client?: Promise<VynosClient>

  constructor (scriptElement: HTMLScriptElement, window: Window) {
    this.scriptAddress = scriptElement.src
    this.window = window
  }

  init (frameElement?: HTMLIFrameElement): Promise<VynosClient> {
    console.log('Namespace.init')

    this.client = new Promise((resolve, reject) => {
      isReady(() => {
        let frame = new Frame(this.scriptAddress, frameElement)
        frame.attach(this.window.document)
        let stream = new FrameStream("vynos").toFrame(frame.element);
        resolve(new VynosClient(stream))
      })
    })
    return this.client
  }

  ready (): Promise<VynosClient> {
    if (this.client) {
      return this.client
    } else {
      return this.init()
    }
  }
}
