import {SharedState} from "../../worker/State";

export const SharedStateBroadcastType = "worker/broadcast/SharedState"

export interface SharedStateBroadcast {
  type: string,
  payload: SharedState
}

export function isSharedStateBroadcast(data: Object): data is SharedStateBroadcast {
  let probablyBroadcast = (data as SharedStateBroadcast)
  return probablyBroadcast.type === SharedStateBroadcastType
}
