import Datastore = require('nedb')
import Promise = require('bluebird')
import TransactionMeta from "../TransactionMeta";
import TransactionState from "../TransactionState";

export default class TransactionMetaStorage {
  datastore: Datastore

  constructor () {
    this.datastore = new Datastore({filename: 'transactions', autoload: true})
  }

  add(transaction: TransactionMeta): Promise<void> {
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

  byId(id: string): Promise<TransactionMeta|null> {
    return new Promise((resolve, reject) => {
      this.datastore.findOne<TransactionMeta>({id: id}, (err, transaction) => {
        if (err) {
          reject(err)
        } else {
          resolve(transaction)
        }
      })
    })
  }

  pending(): Promise<Array<TransactionMeta>> {
    let query = { state: TransactionState.PENDING.toString() }
    return new Promise((resolve, reject) => {
      this.datastore.find<TransactionMeta>(query, (err, transactions) => {
        if (err) {
          reject(err)
        } else {
          resolve(transactions)
        }
      })
    })
  }

  all(): Promise<Array<TransactionMeta>> {
    return this.find({}).then(transactions => {
      return transactions
    })
  }

  protected find(query: any): Promise<Array<TransactionMeta>> {
    return new Promise((resolve, reject) => {
      this.datastore.find<TransactionMeta>(query, (err, transactions) => {
        if (err) {
          reject(err)
        } else {
          resolve(transactions)
        }
      })
    })
  }
}
