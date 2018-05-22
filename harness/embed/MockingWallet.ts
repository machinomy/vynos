import Frame from '../../vynos/embed/Frame'
import Wallet from '../../vynos/embed/Wallet'
import MockingClient from './MockingClient'
import MockingVynos from '../lib/MockingVynos'

export default class MockingWallet extends Wallet {
  private readonly clientOwn: Promise<MockingClient>
  private readonly frameOwn: Promise<Frame>

  constructor (client: Promise<MockingClient>, frame: Promise<Frame>) {
    super(client, frame)
    this.clientOwn = client
    this.frameOwn = frame

    this.clientOwn.then(client => {
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
    let frame = await this.frameOwn
    return frame.display()
  }

  async hide (): Promise<void> {
    await this.ready()
    let frame = await this.frameOwn
    return frame.hide()
  }

  ready (): Promise<MockingVynos> {
    return this.clientOwn
  }
}
