import VynosClient from './VynosClient'
import Vynos from '../lib/Vynos'
import { BROWSER_NOT_SUPPORTED_TEXT } from '../frame/constants'
import Setup from './Setup'

export default class Wallet {
  private client?: Promise<VynosClient>
  private setup: Setup

  constructor (scriptAddress: string, window: Window) {
    this.setup = new Setup(scriptAddress, window.document)
  }

  async load (): Promise<Vynos> {
    if (!this.client) {
      let client = await this.setup.client()
      client.onSharedStateUpdate(async state => {
        if (state.isTransactionPending) {
          await this.display()
        }
      })
      client.onBuyProcessEventReceived()
      this.client = Promise.resolve(client)
    }

    return this.client
  }

  async display (): Promise<void> {
    await this.ready()
    let frame = await this.setup.frame()
    return frame.display()
  }

  async hide (): Promise<void> {
    await this.ready()
    let frame = await this.setup.frame()
    return frame.hide()
  }

  ready (): Promise<Vynos> {
    if ('serviceWorker' in navigator) {
      if (this.client) {
        return this.client
      } else {
        return this.load()
      }
    } else {
      return Promise.reject(new Error(BROWSER_NOT_SUPPORTED_TEXT))
    }
  }
}
