import {SharedState} from "../../worker/WorkerState";
import {ResponsePayload} from "../Payload";
import {WalletBuyArguments} from "../Vynos";

export const BuyProcessEventBroadcastType = "worker/broadcast/buyProcessEvent"
export const BuyProcessOnSentPaymentType = "worker/broadcast/onSentPaymentBuyProcessEvent"

export interface BuyProcessEventBroadcast extends ResponsePayload {
  id: string,
  type: string,
  result: string
  args: WalletBuyArguments
}

export function isBuyProcessEventBroadcast(data: Object): data is BuyProcessEventBroadcast {
  let probablyBroadcast = (data as BuyProcessEventBroadcast)
  return probablyBroadcast.id === buyProcessEventBroadcastType
}
