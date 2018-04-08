import VynosClient from './VynosClient'
import Frame from './Frame'
import FrameStream from '../lib/FrameStream'

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
  private readonly _baseAddress: string
  private readonly document: HTMLDocument
  private _frame?: Frame
  private _client?: VynosClient

  constructor (scriptAddress: string, document: HTMLDocument) {
    this._baseAddress = scriptAddress
    this.document = document
  }

  async frame (): Promise<Frame> {
    if (!this._frame) {
      await isReady(this.document)
      this._frame = new Frame(this._baseAddress)
      this._frame.attach(this.document)
    }

    return this._frame
  }

  async client (): Promise<VynosClient> {
    if (!this._client) {
      let _frame = await this.frame()
      let stream = new FrameStream('vynos').toFrame(_frame.element)
      this._client = new VynosClient(stream)
    }

    return this._client
  }
}
