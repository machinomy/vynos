import * as redux from "redux";
import reducers from "../reducers";
import {buildSharedState, INITIAL_STATE, PersistentState, Preferences, SharedState, WorkerState} from "../WorkerState";
import {Store} from "redux";
import * as actions from "../actions";
import bip39 =require("bip39")
import hdkey = require("ethereumjs-wallet/hdkey")
import Keyring from "../../frame/lib/Keyring";
import {createLogger} from "redux-logger";
import Wallet = require("ethereumjs-wallet")
import { persistStore, autoRehydrate } from 'redux-persist';
import localForage = require("localforage")
import {EventEmitter} from "events";
import bus from '../../lib/bus'
import { CHANGE_NETWORK } from '../../lib/constants'
import TransactionService from "../TransactionService";
import ChannelMetaStorage from "../../lib/storage/ChannelMetaStorage";

const STATE_UPDATED_EVENT = "stateUpdated"

export default class BackgroundController {
  store: Store<WorkerState>
  events: EventEmitter
  hydrated: boolean
  channels?: ChannelMetaStorage
  transactionService?: TransactionService

  constructor() {
    let middleware = redux.compose(redux.applyMiddleware(createLogger()), autoRehydrate())
    this.store = redux.createStore(reducers, INITIAL_STATE, middleware) as Store<WorkerState>
    this.events = new EventEmitter()
    this.hydrated = false
    localForage.config({driver: localForage.INDEXEDDB})
    persistStore(this.store, { blacklist: ['runtime', 'shared'], storage: localForage }, (error, result) => {
      this.hydrated = true
      this.events.emit(STATE_UPDATED_EVENT)
    })
  }

  setChannelMetastorage(channelMetaStorage : ChannelMetaStorage) {
    this.channels = channelMetaStorage
  }

  setTransactionService(transactionService : TransactionService) {
    this.transactionService = transactionService
  }

  awaitHydrated(fn: Function) {
    if (this.hydrated) {
      fn()
    } else {
      this.events.once(STATE_UPDATED_EVENT, () => {
        fn()
      })
    }
  }

  awaitUnlock(fn: Function) {
    const tryCall = () => {
      this.getSharedState().then(sharedState => {
        let isUnlocked = !sharedState.isLocked && sharedState.didInit
        if (isUnlocked) {
          fn()
        } else {
          this.events.once(STATE_UPDATED_EVENT, tryCall)
        }
      })
    }
    tryCall()
  }

  resolveTransaction() {
    this.store.dispatch(actions.setLastUpdateDb(Date.now()))
  }

  rememberPage(path: string) {
    this.store.dispatch(actions.rememberPage(path))
  }

  getSharedState(): Promise<SharedState> {
    return this.getState().then(buildSharedState)
  }

  getState(): Promise<WorkerState> {
    return new Promise(resolve => {
      this.awaitHydrated(() => {
        resolve(this.store.getState())
      })
    })
  }

  genKeyring(password: string): Promise<string> {
    let mnemonic = bip39.generateMnemonic()
    let keyring = this._generateKeyring(password, mnemonic)
    return Keyring.serialize(keyring, password).then(serialized => {
      this.store.dispatch(actions.setKeyring(serialized))
      return mnemonic
    })
  }

  _generateKeyring (password: string, mnemonic: string): Keyring {
    let wallet = hdkey.fromMasterSeed(mnemonic).getWallet()
    this.store.dispatch(actions.setWallet(wallet))
    let privateKey = wallet.getPrivateKey()
    return new Keyring(privateKey)
  }

  restoreWallet (password: string, mnemonic: string): Promise<void> {
    let keyring = this._generateKeyring(password, mnemonic)
    let wallet = keyring.wallet
    return Keyring.serialize(keyring, password).then(serialized => {
      this.store.dispatch(actions.restoreWallet({ keyring: serialized, wallet: wallet }))
    })
  }

  getAccounts(): Promise<Array<string>> {
    return this.getWallet().then(wallet => {
      let account = wallet.getAddressString()
      return [account]
    }).catch(() => {
      return []
    })
  }

  getWallet(): Promise<Wallet> {
    return this.getState().then(state => {
      let wallet = state.runtime.wallet
      if (wallet) {
        return Promise.resolve(wallet)
      } else {
        return Promise.reject(new Error("Wallet is not available"))
      }
    })
  }

  getPrivateKey(): Promise<Buffer> {
    return this.getWallet().then(wallet => {
      return wallet.getPrivateKey()
    })
  }

  didStoreMnemonic(): Promise<void> {
    return new Promise(resolve => {
      this.awaitHydrated(() => {
        this.store.dispatch(actions.setDidStoreMnemonic(true))
        resolve()
      })
    })
  }

  unlockWallet(password: string): Promise<void> {
    return this.getState().then(state => {
      let keyring = state.persistent.keyring
      if (keyring) {
        return Promise.resolve(Keyring.deserialize(keyring, password))
      } else {
        return Promise.reject(new Error("Keyring is not present"))
      }
    }).then((keyring: Keyring) => {
      this.store.dispatch(actions.setWallet(keyring.wallet))
    })
  }

  lockWallet(): Promise<void> {
    return this.getState().then(() => {
      this.store.dispatch(actions.setWallet(undefined))
    })
  }

  didChangeSharedState(fn: (state: SharedState) => void) {
    this.store.subscribe(() => {
      this.events.emit(STATE_UPDATED_EVENT)
      this.getSharedState().then(sharedState => {
        fn(sharedState)
      })
    })
  }

  changeNetwork(): Promise<void> {
    return new Promise(resolve => {
      bus.emit(CHANGE_NETWORK)
      return resolve()
    })
  }

  setPreferences(preferences: Preferences): Promise<void> {
    return new Promise(resolve => {
      this.store.dispatch(actions.setPreferences(preferences))
      resolve()
    })
  }

  setLastMicropaymentTime(lastMicropaymentTime: number): Promise<void> {
    return new Promise(resolve => {
      this.store.dispatch(actions.setLastMicropaymentTime(lastMicropaymentTime))
      resolve()
    })
  }

  clearChannelMetastorage() {
    this.channels!.clear()
  }

  clearTransactionMetastorage() {
    this.transactionService!.storage.clear()
  }

  clearReduxPersistentStorage () {
      this.store.dispatch(this.store.dispatch(actions.setPersistentState({} as PersistentState)))
  }
}
