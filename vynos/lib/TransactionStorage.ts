import Datastore = require('nedb')
import Transaction from "./Transaction";
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
}
