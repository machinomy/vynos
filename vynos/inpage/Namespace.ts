import VynosClient from './VynosClient'
import Promise = require('bluebird')
import Frame from './Frame'
import FrameStream from '../lib/FrameStream'
import Vynos from '../lib/Vynos'
import { BROWSER_NOT_SUPPORTED_TEXT } from '../frame/constants'

// DOM and Window is ready.
export function isReady(callback: () => void) {
  var state = document.readyState
  if (state === 'complete' || state === 'interactive') {
    return setTimeout(callback, 0)
  }

  document.addEventListener('DOMContentLoaded', function onLoad () {
    callback()
  })
}

export default class Namespace {
  scriptAddress: string
  window: Window
  client?: Promise<VynosClient>
  frame: Frame

  constructor (scriptElement: HTMLScriptElement, window: Window) {
    this.scriptAddress = scriptElement.src
    this.window = window
  }

  // Initialize frame container for the Wallet.
  // Optional to use.
  init (frameElement?: HTMLIFrameElement, frame?: Frame): Promise<Vynos> {
    this.client = new Promise(resolve => {
      isReady(() => {
        this.frame = frame ? frame : new Frame(this.scriptAddress, frameElement)
        this.frame.attach(this.window.document)
        let stream = new FrameStream("vynos").toFrame(this.frame.element);
        let client = new VynosClient(stream)
        client.onSharedStateUpdate(state => {
          if (state.isTransactionPending) {
            this.display()
          }
        })
        resolve(client)
      })
    })
    return this.client
  }

  display (): void {
    this.ready().then(() => {
      this.frame.display()
    })
  }

  setContainerStyle (style: CSSStyleDeclaration): void {
    this.frame.setContainerStyle(style)
  }

  hide (): void {
    this.ready().then(() => {
      this.frame.hide()
    })
  }

  ready (): Promise<Vynos> {
    if ("serviceWorker" in navigator) {
      if (this.client) {
        return this.client
      } else {
        return this.init()
      }
    }else{
      return Promise.reject(new Error(BROWSER_NOT_SUPPORTED_TEXT))
    }
  }
}
