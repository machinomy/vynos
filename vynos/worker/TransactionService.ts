import Transaction, {TransactionState} from "../lib/Transaction";
import Promise = require('bluebird')
import TransactionStorage from "../lib/TransactionStorage";
import {WorkerState} from "./WorkerState";
import {Store} from "redux";
import * as actions from "./actions"

export default class TransactionService {
  storage: TransactionStorage
  store: Store<WorkerState>

  constructor (store: Store<WorkerState>) {
    this.storage = new TransactionStorage()
    this.store = store
  }

  approveTransaction(transaction: Transaction): Promise<boolean> {
    return this.storage.add(transaction).then(() => {
      this.store.dispatch(actions.setTransactionPending(true))
      return new Promise((resolve, reject) => {
        this.store.subscribe(() => {
          this.storage.byId(transaction.id).then(found => {
            if (found) {
              if (found.state === TransactionState.APPROVED) {
                resolve(true)
              } else if (found.state === TransactionState.REJECTED) {
                resolve(false)
              }
            } else {
              reject(`Can not find transaction #${transaction.id}`)
            }
          })
        })
      })
    })
  }
}
