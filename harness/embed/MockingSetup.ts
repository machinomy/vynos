import Frame from '../../vynos/embed/Frame'
import FrameStream from '../../vynos/lib/FrameStream'
import BrowserSupport from '../../vynos/embed/BrowserSupport'
import * as resourceAddress from '../../vynos/lib/resourceAddress'
import Setup from '../../vynos/embed/Setup'
import MockingClient from './MockingClient'

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

export default class MockingSetup extends Setup {
  private readonly mockingsBaseAddress: string
  private readonly mockingWindow: Window
  private readonly mockingBrowserSupport: BrowserSupport
  private mocking_frame?: Frame
  private mocking_client?: MockingClient

  constructor (scriptElement: HTMLScriptElement | any, window: Window) {
    super(scriptElement, window)
    this.mockingsBaseAddress = resourceAddress.embed(scriptElement)
    this.mockingWindow = window
    this.mockingBrowserSupport = new BrowserSupport(this.mockingWindow)
  }

  async frame (): Promise<Frame> {
    await this.canProceedOwn()
    if (!this.mocking_frame) {
      this.mocking_frame = new Frame(this.mockingsBaseAddress, this.mockingWindow.document)
      await this.mocking_frame.attach()
    }

    return this.mocking_frame
  }

  async client (): Promise<MockingClient> {
    await this.canProceedOwn()
    if (!this.mocking_client) {
      let frame = await this.frame()
      let frameElement = await frame.element()
      let stream = new FrameStream('mocking-vynos').toFrame(frameElement)
      this.mocking_client = new MockingClient(stream)
    }

    return this.mocking_client
  }

  private async canProceedOwn (): Promise<void> {
    await isReady(this.mockingWindow.document)
    await this.mockingBrowserSupport.assert()
  }
}
