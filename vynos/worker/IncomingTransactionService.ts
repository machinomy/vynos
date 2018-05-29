import TransactionStorage from '../lib/storage/TransactionMetaStorage'
import * as Web3 from 'web3'
import * as transactions from '../lib/transactions'
import Transaction from '../lib/TransactionMeta'
import * as actions from './actions'
import { Store } from 'redux'
import { WorkerState } from './WorkerState'
import NetworkController from './controllers/NetworkController'

export default class IncomingTransactionService {
  private storage: TransactionStorage

  private store: Store<WorkerState>

  private networkController: NetworkController

  private web3: Web3 | undefined

  private web3Filter: any

  constructor (storage: TransactionStorage, store: Store<WorkerState>, networkController: NetworkController) {
    this.storage = storage
    this.store = store
    this.networkController = networkController
  }

  async start () {
    const self = this
    await this.networkController.ready!
    self.web3 = self.networkController.getWeb3()
    self.web3Filter = self.web3!.eth.filter('latest')
    self.web3Filter.watch((error: Error, result: any) => {
      self.web3!.eth.getBlock(result, true, (err: Error, blockObj: any) => {
        if (err) {
          console.error(err)
        } else {
          for (const txIndex in blockObj.transactions) {
            const tx = blockObj.transactions[txIndex]
            if (err) {
              console.error(err)
            } else {
              self.web3!.eth.getAccounts(async (err: Error, accounts: string[]) => {
                if (tx.to === accounts[0]) {
                  const transactionToAppend = transactions.incoming(tx.from, tx.value)
                  self.addTransaction(transactionToAppend)
                }
              })
            }
          }
        }
      })
    })
  }

  stop () {
    if (this.web3Filter) {
      this.web3Filter.stopWatching()
    }
  }

  private addTransaction (transaction: Transaction): Promise<void> {
    return this.storage.add(transaction).then(() => {
      this.store.dispatch(actions.setLastUpdateDb(Date.now()))
    })
  }
}
