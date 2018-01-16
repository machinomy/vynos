import Datastore = require('nedb')
import Promise = require('bluebird')
import TransactionMeta from "../TransactionMeta";
import TransactionState from "../TransactionState";
import SettingStorage from "./SettingStorage";
import { default as globalEvents } from "../GlobalEvents";

const settingStorage = new SettingStorage()

export default class TransactionMetaStorage {
  datastore: Datastore

  constructor () {
    this.load().catch(console.error)
    globalEvents.on('changeNetwork', () => {
      this.load().catch(console.error)
    })
  }

  load () {
    return new Promise(resolve => {
      settingStorage.getNetwork().then((network: any) => {
        this.datastore = new Datastore({ filename: 'transactions_' + network.name, autoload: true })
        this.datastore.loadDatabase(() => {
          resolve()
        })
      })
    })
  }

  ready (): Promise<void> {
    return new Promise(resolve => {
      if (this.datastore) {
        resolve()
      } else {
        this.load().then(() => {
          resolve()
        })
      }
    })
  }

  add (transaction: TransactionMeta): Promise<TransactionMeta> {
    return new Promise((resolve, reject) => {
      this.ready().then(() => {
        this.datastore.insert(transaction, err => {
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
      this.ready().then(() => {
        this.datastore.loadDatabase(() => {
          this.datastore.findOne<TransactionMeta>({ id: id }, (err, transaction) => {
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
      this.ready().then(() => {
        this.datastore.update(query, update, { multi: true }, (err: Error, res: any) => {
          this.datastore.persistence.compactDatafile()
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
      this.ready().then(() => {
        this.datastore.loadDatabase(() => {
          this.find({}).then(transactions => {
            return resolve(transactions);
          })
        })
      })
    })
  }

  protected find (query: any): Promise<Array<TransactionMeta>> {
    return new Promise((resolve, reject) => {
      this.ready().then(() => {
        this.datastore.find<TransactionMeta>(query).sort({ time: 1 }).exec((err, transactions) => {
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
