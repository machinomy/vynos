import Payload from "./Payload";

export interface Response extends Payload {
  id: number
  jsonrpc: string
  result: any
}

export default Response
