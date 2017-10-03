import {SharedState} from "../../worker/WorkerState";
import {ResponsePayload} from "../Payload";

export const SharedStateBroadcastType = "worker/broadcast/SharedState"

export interface SharedStateBroadcast extends ResponsePayload {
  id: typeof SharedStateBroadcastType,
  result: SharedState
}

export function isSharedStateBroadcast(data: Object): data is SharedStateBroadcast {
  let probablyBroadcast = (data as SharedStateBroadcast)
  return probablyBroadcast.id === SharedStateBroadcastType
}
