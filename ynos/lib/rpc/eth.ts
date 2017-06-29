import {JSONRPC, randomId, RequestPayload, Response} from "../Payload"

export class AccountsRequest implements RequestPayload {
  method: string;
  params: any[];
  id: number;
  jsonrpc: string;

  constructor() {
    this.id = randomId()
    this.method = "eth_accounts"
    this.jsonrpc = JSONRPC
    this.params = []
  }
}

export interface AccountsResponse extends Response {
  params: string[]
}
