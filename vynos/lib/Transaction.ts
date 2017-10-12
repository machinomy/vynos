import {randomId} from './Payload'
import TransactionKind from "./TransactionKind";

export default interface Transaction {
  id: string
  title: string
  description?: string
  icon?: string
  time: number
  amount: number
  fee?: number
  kind: TransactionKind
  state: string
}

export namespace Transaction {

}
