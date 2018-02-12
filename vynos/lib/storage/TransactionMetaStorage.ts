import Datastore = require('nedb')
import TransactionMeta from "../TransactionMeta";
import TransactionState from "../TransactionState";
import Storage from "../Storage";

export default class TransactionMetaStorage {
  datastore: Promise<Datastore>

  constructor () {
    let d = new Storage('transactions')
    this.datastore = d.ready();
  }

  add (transaction: TransactionMeta): Promise<TransactionMeta> {
    return new Promise((resolve, reject) => {
      this.datastore.then((datastore) => {
        datastore.insert(transaction, err => {
          if (err) {
            reject(err)
          } else {
            resolve(transaction)
          }
        })
      })
    })
  }

  byId (id: string): Promise<TransactionMeta | null> {
    return new Promise((resolve, reject) => {
      this.datastore.then((datastore) => {
        datastore.loadDatabase(() => {
          datastore.findOne<TransactionMeta>({ id: id }, (err, transaction) => {
            if (err) {
              reject(err)
            } else {
              resolve(transaction)
            }
          })
        })
      })
    })
  }

  pending (): Promise<Array<TransactionMeta>> {
    let query = { state: TransactionState.PENDING.toString() }
    return this.find(query)
  }

  approved (): Promise<Array<TransactionMeta>> {
    let query = { state: TransactionState.APPROVED.toString() }
    return this.find(query)
  }

  view (id: string) {
    return this.update({ id }, { '$set': { state: 'VIEWED' } })
  }

  approve (id: string) {
    return this.update({ id }, { '$set': { state: 'APPROVED' } })
  }

  reject (id: string) {
    return this.update({ id }, { '$set': { state: 'REJECTED' } })
  }

  update (query: object, update: object): Promise<Array<TransactionMeta>> {
    return new Promise((resolve: Function, reject: Function) => {
      this.datastore.then((datastore) => {
        datastore.update(query, update, { multi: true }, (err: Error, res: any) => {
          datastore.persistence.compactDatafile()
          if (err) {
            return reject(err)
          }
          resolve(res)
        })
      })
    })
  }

  all (): Promise<Array<TransactionMeta>> {
    return new Promise((resolve, reject) => {
      this.datastore.then((datastore) => {
        datastore.loadDatabase(() => {
          this.find({}).then(transactions => {
            return resolve(transactions);
          })
        })
      })
    })
  }

  protected find (query: any): Promise<Array<TransactionMeta>> {
    return new Promise((resolve, reject) => {
      this.datastore.then((datastore) => {
        datastore.find<TransactionMeta>(query).sort({ time: 1 }).exec((err, transactions) => {
          if (err) {
            reject(err)
          } else {
            resolve(transactions)
          }
        })
      })
    })
  }
}
