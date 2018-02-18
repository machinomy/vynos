import Datastore = require('nedb')
import TransactionMeta from "../TransactionMeta";
import TransactionState from "../TransactionState";
import Storage from "../Storage";
import bus from '../../lib/bus'
import * as events from '../events'

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
      .then(array => {
        let eventName = events.txApproved(id)
        bus.emit(eventName)
        return array
      })
  }

  reject (id: string) {
    return this.update({ id }, { '$set': { state: 'REJECTED' } })
      .then(array => {
        let eventName = events.txRejected(id)
        bus.emit(eventName)
        return array
    })
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

  clear() {
    this.datastore.then(datastore => {
      // https://github.com/louischatriot/nedb/issues/84
      datastore.remove({ }, { multi: true }, function (err, numRemoved) {
        datastore.loadDatabase(function (err) {
          if (err) {
            console.error('Error while deleting transactions local database')
            console.error(err)
          }
        });
      });
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
