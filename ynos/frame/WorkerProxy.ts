import StreamProvider from "../lib/StreamProvider";
import {EventEmitter} from "events";
import {INITIAL_STATE, SharedState} from "../worker/State";
import {JSONRPC, randomId} from "../lib/Payload";
import {isSharedStateBroadcast, SharedStateBroadcastType} from "../lib/rpc/SharedStateBroadcast";
import {
  GenKeyringRequest, GenKeyringResponse, GetSharedStateRequest, GetSharedStateResponse, SetPageRequest,
  SetPageResponse
} from "../lib/rpc/yns";
import {Action} from "redux";

export default class WorkerProxy extends EventEmitter {
  stream: StreamProvider

  constructor() {
    super()
    this.stream = new StreamProvider("WorkerProxy")
    this.stream.listen(SharedStateBroadcastType, data => {
      if (isSharedStateBroadcast(data)) {
        this.emit(SharedStateBroadcastType, data)
      }
    })
  }

  setPage(name: string): Promise<SharedState> {
    let request: SetPageRequest = {
      id: randomId(),
      jsonrpc: JSONRPC,
      method: SetPageRequest.method,
      params: [name]
    }
    return this.stream.ask(request).then((response: SetPageResponse) => {
      return response.result
    })
  }

  genKeyring(password: string): Promise<string> {
    let request: GenKeyringRequest = {
      id: randomId(),
      jsonrpc: JSONRPC,
      method: GenKeyringRequest.method,
      params: [password]
    }
    return this.stream.ask(request).then((response: GenKeyringResponse) => {
      return response.result
    })
  }

  getSharedState(): Promise<SharedState> {
    let request: GetSharedStateRequest = {
      id: randomId(),
      jsonrpc: JSONRPC,
      method: GetSharedStateRequest.method,
      params: []
    }
    return this.stream.ask(request).then((response: GetSharedStateResponse) => {
      return response.result
    })
  }

  dispatch<A extends Action>(action: A) {
    console.warn("WorkerProxy#dispatch", action)
  }
}
