import VynosClient from './VynosClient'
import Vynos from '../lib/Vynos'
import Frame from './Frame'

export default class Wallet {
  private readonly client: Promise<VynosClient>
  private readonly frame: Promise<Frame>

  constructor (client: Promise<VynosClient>, frame: Promise<Frame>) {
    this.client = client
    this.frame = frame

    this.client.then(client => {
      client.onSharedStateUpdate(async state => {
        if (state.isTransactionPending) {
          await this.display()
        }
      })
      client.onBuyProcessEventReceived()
    })
  }

  async display (): Promise<void> {
    await this.ready()
    let frame = await this.frame
    return frame.display()
  }

  async hide (): Promise<void> {
    await this.ready()
    let frame = await this.frame
    return frame.hide()
  }

  ready (): Promise<Vynos> {
    return this.client
  }
}
