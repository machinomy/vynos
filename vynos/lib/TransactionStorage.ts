import Datastore = require('nedb')
import Promise = require('bluebird')
import Transaction from "./Transaction";
import TransactionState from "./TransactionState";

export default class TransactionStorage {
  datastore: Datastore

  constructor () {
    this.datastore = new Datastore({filename: 'transactions', autoload: true})
  }

  add(transaction: Transaction): Promise<void> {
    return new Promise((resolve, reject) => {
      this.datastore.insert(transaction, err => {
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
      this.datastore.findOne<Transaction>({id: id}, (err, transaction) => {
        if (err) {
          reject(err)
        } else {
          resolve(transaction)
        }
      })
    })
  }

  pending(): Promise<Array<Transaction>> {
    let query = { state: TransactionState.PENDING.toString() }
    return new Promise((resolve, reject) => {
      this.datastore.find<Transaction>(query, (err, transactions) => {
        if (err) {
          reject(err)
        } else {
          resolve(transactions)
        }
      })
    })
  }

  all(): Promise<Array<Transaction>> {
    return this.find({}).then(transactions => {
      return transactions
    })
  }

  protected find(query: any): Promise<Array<Transaction>> {
    return new Promise((resolve, reject) => {
      this.datastore.find<Transaction>(query, (err, transactions) => {
        if (err) {
          reject(err)
        } else {
          resolve(transactions)
        }
      })
    })
  }
}
