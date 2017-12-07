import Promise = require('bluebird')
import TransactionStorage from "../lib/storage/TransactionMetaStorage";
import { WorkerState } from "./WorkerState";
import { Store } from "redux";
import * as actions from './actions'
import Transaction from '../lib/TransactionMeta'
import TransactionState from "../lib/TransactionState";

export default class TransactionService {
  storage: TransactionStorage
  store: Store<WorkerState>

  constructor(store: Store<WorkerState>) {
    this.storage = new TransactionStorage()
    this.store = store
  }

  addTransaction(transaction: Transaction): Promise<void> {
    return this.storage.add(transaction).then(() => {
      this.store.dispatch(actions.setLastUpdateDb(Date.now()));
    })
  }

  approveTransaction(transaction: Transaction): Promise<boolean> {
    return this.storage.add(transaction).then((res) => {
      return this.dispatchTransaction(transaction)
    })
  }

  checkPendingTrasactions() {
    this.storage.pending().then((transactions)=>{
      if (transactions.length) {
        this.store.dispatch(actions.setTransactionPending(true))
      } else {
        this.store.dispatch(actions.setTransactionPending(false))
      }
    })
  }

  dispatchTransaction(transaction: Transaction): Promise<boolean> {
    let resolved = false
    this.store.dispatch(actions.setTransactionPending(true))
    return new Promise((resolve, reject) => {
      this.store.subscribe(() => { // FIX ME perfomance problem
        if (resolved) {
          return 
        }
        this.storage.byId(transaction.id).then(found => {
          if (!found) {
            return reject(`Can not find transaction #${transaction.id}`)
          }
          if (found.state !== TransactionState.APPROVED && found.state !== TransactionState.REJECTED ) {
            return
          }
          if (this.store.getState().runtime.isTransactionPending){
            resolved = true
          }
          this.checkPendingTrasactions()
          if (found.state === TransactionState.APPROVED ) {
            resolve(true)
          } else if (found.state === TransactionState.REJECTED) {
            resolve(false)
          }
        })
      })
    })
  }
}
