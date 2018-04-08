import { BuyProcessEvent, buyProcessEvent } from './rpc/buyProcessEventBroadcast'
import { WalletBuyArguments } from './Vynos'
import VynosBuyResponse from './VynosBuyResponse'
import Client from '../embed/Client'

export default class PromisedWalletResponse {
  result: Promise<VynosBuyResponse>
  eventOnAddingCallbackName: string
  walletArgs: WalletBuyArguments
  walletClient: Client

  constructor (walletClient: Client, buyResponse: Promise<VynosBuyResponse>, eventOnAddingCallbackName?: string, walletArgs?: WalletBuyArguments) {
    this.walletClient = walletClient
    this.result = buyResponse
    this.eventOnAddingCallbackName = eventOnAddingCallbackName || 'PromisedWalletResponse'
    this.walletArgs = walletArgs || new WalletBuyArguments()
  }

  on (eventName: string, fn: (...args: any[]) => void): PromisedWalletResponse {
    this.walletClient.addCallbackForBuyProcessEvent(buyProcessEvent(eventName as BuyProcessEvent, this.walletArgs), fn)
    return this
  }
}
