import Datastore = require('nedb')
import Transaction, {TransactionJSON, TransactionState} from "./Transaction";
import Promise = require('bluebird')

export default class TransactionStorage {
  datastore: Datastore

  constructor () {
    this.datastore = new Datastore({filename: 'transactions', autoload: true})
  }

  add(transaction: Transaction): Promise<void> {
    return new Promise((resolve, reject) => {
      this.datastore.insert(transaction.toJSON(), err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  byId(id: string): Promise<Transaction|null> {
    return new Promise((resolve, reject) => {
      this.datastore.findOne<TransactionJSON>({id: id}, (err, doc) => {
        if (err) {
          reject(err)
        } else {
          if (doc) {
            resolve(Transaction.fromJSON(doc))
          } else {
            resolve(null)
          }
        }
      })
    })
  }

  allPending(): Promise<Array<Transaction>> {
    let query = { state: TransactionState.PENDING.toString() }
    return new Promise((resolve, reject) => {
      this.datastore.find<TransactionJSON>(query, (err, docs) => {
        if (err) {
          reject(err)
        } else {
          let transactions = docs.map(d => Transaction.fromJSON(d))
          resolve(transactions)
        }
      })
    })
  }
}
