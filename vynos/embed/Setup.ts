import VynosClient from './VynosClient'
import Frame from './Frame'
import FrameStream from '../lib/FrameStream'
import BrowserSupport from './BrowserSupport'
import * as resourceAddress from '../lib/resourceAddress'

async function isReady (document: HTMLDocument): Promise<void> {
  return new Promise<void>(resolve => {
    const state = document.readyState
    if (state === 'complete' || state === 'interactive') {
      return setTimeout(resolve, 0)
    }

    document.addEventListener('DOMContentLoaded', () => {
      resolve()
    })
  })
}

export default class Setup {
  private readonly baseAddress: string
  private readonly window: Window
  private readonly browserSupport: BrowserSupport
  private _frame?: Frame
  private _client?: VynosClient

  constructor (scriptElement: HTMLScriptElement | any, window: Window) {
    this.baseAddress = resourceAddress.embed(scriptElement)
    this.window = window
    this.browserSupport = new BrowserSupport(this.window)
  }

  private async canProceed (): Promise<void> {
    await isReady(this.window.document)
    await this.browserSupport.assert()
  }

  async frame (): Promise<Frame> {
    await this.canProceed()
    if (!this._frame) {
      this._frame = new Frame(this.baseAddress, this.window.document)
      await this._frame.attach()
    }

    return this._frame
  }

  async client (): Promise<VynosClient> {
    await this.canProceed()
    if (!this._client) {
      let frame = await this.frame()
      let frameElement = await frame.element()
      let stream = new FrameStream('vynos').toFrame(frameElement)
      this._client = new VynosClient(stream)
    }

    return this._client
  }
}
