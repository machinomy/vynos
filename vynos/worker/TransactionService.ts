import Transaction from "../lib/Transaction";
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
      return Promise.resolve(true)
    })
  }
}
