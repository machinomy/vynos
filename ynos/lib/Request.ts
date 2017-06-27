import Payload from "./Payload";

export interface Request extends Payload {
  id: number
  jsonrpc: string
  method: string
  params: any
}

export default Request
