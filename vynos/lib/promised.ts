import {BuyProcessEvent, buyProcessEvent} from "./rpc/buyProcessEventBroadcast";
import {WalletBuyArguments} from "./Vynos";
import VynosBuyResponse from "./VynosBuyResponse";
import VynosClient from "../inpage/VynosClient";


export default class PromisedWalletResponse {
  result : Promise<VynosBuyResponse>
  eventOnAddingCallbackName: string
  walletArgs: WalletBuyArguments
  walletClient: VynosClient

  constructor(walletClient: VynosClient, buyResponse: Promise<VynosBuyResponse>, eventOnAddingCallbackName?: string, walletArgs?: WalletBuyArguments) {
    this.walletClient = walletClient
    this.result = buyResponse
    this.eventOnAddingCallbackName = eventOnAddingCallbackName || 'PromisedWalletResponse'
    this.walletArgs = walletArgs || new WalletBuyArguments()
  }

  on(eventName: string, fn: (...args: any[]) => void) : PromisedWalletResponse {
    this.walletClient.addCallbackForBuyProcessEvent(buyProcessEvent(eventName as BuyProcessEvent, this.walletArgs), fn)
    return this
  }
}
