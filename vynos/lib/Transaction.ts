export enum TransactionState {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

function buildState(name: string): TransactionState {
  switch (name) {
    case TransactionState.PENDING:
      return TransactionState.PENDING
    case TransactionState.APPROVED:
      return TransactionState.APPROVED
    case TransactionState.REJECTED:
      return TransactionState.REJECTED
    default:
      throw new Error(`Can not deserialize state from ${name}`)
  }
}

export interface TransactionJSON {
  id: string
  title: string
  state: string
}

export default class Transaction {
  id: string
  title: string
  state: TransactionState

  constructor (id: string, title: string, state?: TransactionState) {
    this.id = id
    this.title = title
    this.state = state || TransactionState.PENDING
  }

  static fromJSON (json: TransactionJSON): Transaction {
    let id = json.id
    let title = json.title
    let state = buildState(json.state)
    return new Transaction(id, title, state)
  }

  toString () {
    return this.state + ': ' + this.title
  }

  toJSON (): TransactionJSON {
    return {
      id: this.id,
      title: this.title,
      state: this.state.toString()
    }
  }
}
