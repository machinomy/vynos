import bus from "./bus";
import {BuyProcessEvent, buyProcessEvent} from "./rpc/buyProcessEventBroadcast";
import {WalletBuyArguments} from "./Vynos";
import VynosBuyResponse from "./VynosBuyResponse";


export default class PromisedWalletResponse {
  result : Promise<VynosBuyResponse>
  eventOnAddingCallbackName: string
  walletArgs: WalletBuyArguments

  constructor(buyResponse: Promise<VynosBuyResponse>, eventOnAddingCallbackName?: string, walletArgs?: WalletBuyArguments) {
    this.result = buyResponse
    this.eventOnAddingCallbackName = eventOnAddingCallbackName || 'PromisedWalletResponse'
    this.walletArgs = walletArgs || new WalletBuyArguments()
  }

  on(eventName: string, fn: (...args: any[]) => void) : PromisedWalletResponse {
    bus.emit(this.eventOnAddingCallbackName, buyProcessEvent(eventName as BuyProcessEvent, this.walletArgs), fn)
    bus.on(eventName, fn)
    return this
  }

  once(eventName: string, fn: (...args: any[]) => void) : PromisedWalletResponse {
    bus.emit(this.eventOnAddingCallbackName, buyProcessEvent(eventName as BuyProcessEvent, this.walletArgs), fn)
    bus.once(eventName, fn)
    return this
  }
}
