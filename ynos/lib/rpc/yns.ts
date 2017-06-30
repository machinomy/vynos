import {JSONRPC, randomId, RequestPayload, ResponsePayload} from "../Payload"
import {SharedState} from "../../worker/State";

export class InitAccountRequest implements RequestPayload {
  method: string;
  params: any[];
  id: number;
  jsonrpc: string;

  static METHOD = "yns_initAccount"

  constructor() {
    this.id = randomId()
    this.method = InitAccountRequest.METHOD
    this.jsonrpc = JSONRPC
    this.params = []
  }
}

export interface InitAccountResponse extends ResponsePayload {
  params: string[]
}

export class GetSharedStateRequest implements RequestPayload {
  id: number;
  jsonrpc: typeof JSONRPC
  method: "yns_getSharedState"
  params: any[];

  static match(payload: RequestPayload): payload is GetSharedStateRequest {
    return payload.method === "yns_getSharedState"
  }
}

export interface GetSharedStateResponse extends ResponsePayload {
  result: SharedState
}
