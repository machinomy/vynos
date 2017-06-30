import {JSONRPC, randomId, RequestPayload, Response} from "../Payload"

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

export interface InitAccountResponse extends Response {
  params: string[]
}
