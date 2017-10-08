export enum State {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

function buildState(name: string): Promise<State> {
  switch (name) {
    case State.PENDING:
      return Promise.resolve(State.PENDING)
    case State.APPROVED:
      return Promise.resolve(State.APPROVED)
    case State.REJECTED:
      return Promise.resolve(State.REJECTED)
    default:
      return Promise.reject(new Error(`Can not deserialize state from ${name}`))
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
  state: State

  constructor (id: string, title: string, state?: State) {
    this.id = id
    this.title = title
    this.state = state || State.PENDING
  }

  static fromJSON (json: TransactionJSON): Promise<Transaction> {
    let id = json.id
    let title = json.title
    return buildState(json.state).then(state => {
      return new Transaction(id, title, state)
    })
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
