import {Transaction, TransactionState} from '../Transaction'

export default class MicropaymentTransaction implements Transaction {
  id: string
  title: string
  description?: string
  icon?: string
  time: number
  amount: number
  fee?: number
  kind: string
  state: string

  static KIND = 'MicropaymentTransaction'

  constructor (options: Transaction) {
    this.id = options.id
    this.title = options.title
    this.description = options.description
    this.time = options.time
    this.amount = options.amount
    this.fee = 0
    this.kind = MicropaymentTransaction.KIND
  }
}
