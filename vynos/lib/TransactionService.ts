import localForage from "localforage";
import { extendPrototype } from "localforage-observable";
import Transaction from "./Transaction";

export default class TransactionService {
  storage: LocalForage

  constructor () {
    const forage = extendPrototype(localForage);
    this.storage = forage.createInstance({
      name: 'transactions'
    })
    forage.ready().then(() => {
      // TypeScript will find `newObservable()` after the casting that `extendPrototype()` does
      let observable = forage.newObservable();
      observable.subscribe({
        next: this._handleNext.bind(this),
        error: this._handleError.bind(this),
        complete: this._handleComplete.bind(this)
      })
    });

  }

  addTransaction(transaction: Transaction) {
    console.log('Add Transaction')
  }

  _handleNext (change: LocalForageObservableChange) {
    console.log('_handleNext', change)
  }

  _handleError (err: any) {

  }

  _handleComplete() {

  }
}
