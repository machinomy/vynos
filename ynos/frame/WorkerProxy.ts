import StreamProvider from "../lib/StreamProvider";
import {EventEmitter} from "events";
import {INITIAL_STATE, SharedState} from "../worker/State";
import {randomId} from "../lib/Payload";
import {isSharedStateBroadcast, SharedStateBroadcastType} from "../lib/rpc/SharedStateBroadcast";
import {GetSharedStateRequest, GetSharedStateResponse} from "../lib/rpc/yns";

export default class WorkerProxy extends EventEmitter {
  stream: StreamProvider

  constructor() {
    super()
    this.stream = new StreamProvider("WorkerProxy")
    this.stream.addListener('data', data => {
      if (isSharedStateBroadcast(data)) {
        this.emit(SharedStateBroadcastType, data)
      }
    })
  }

  getSharedState(): Promise<SharedState> {
    let request: GetSharedStateRequest = {
      id: randomId(),
      jsonrpc: "2.0",
      method: "yns_getSharedState",
      params: []
    }
    return this.stream.ask(request).then((response: GetSharedStateResponse) => {
      return response.result
    })
  }
}
