import * as redux from "redux";
import reducers from "../reducers";
import {INITIAL_STATE, SharedState, State} from "../State";
import {Store} from "redux";
import * as actions from "../actions";
import bip39 from "bip39";
import hdkey from "ethereumjs-wallet/hdkey";
import Keyring from "../../frame/lib/Keyring";
import {createLogger} from "redux-logger";
import {Buffer} from "buffer";
import Wallet from "ethereumjs-wallet";

export default class BackgroundController {
  store: Store<State>

  constructor() {
    let middleware = redux.applyMiddleware(createLogger())
    this.store = redux.createStore(reducers, INITIAL_STATE, middleware)
  }

  getSharedState(): Promise<SharedState> {
    return this.getState().then(state => state.shared)
  }

  getState(): Promise<State> {
    return Promise.resolve(this.store.getState())
  }

  genKeyring(password: string): Promise<string> {
    let mnemonic = bip39.generateMnemonic()
    let wallet = hdkey.fromMasterSeed(mnemonic).getWallet()
    this.store.dispatch(actions.setWallet(wallet))
    let privateKey = wallet.getPrivateKey()
    let keyring = new Keyring(privateKey)
    return Keyring.serialize(keyring, password).then(serialized => {
      this.store.dispatch(actions.setKeyring(serialized))
      return mnemonic
    })
  }

  getAccounts(): Promise<Array<string>> {
    return this.getWallet().then(wallet => {
      let account = wallet.getAddressString()
      return [account]
    })
  }

  getWallet(): Promise<Wallet> {
    let wallet = this.store.getState().runtime.wallet
    if (wallet) {
      return Promise.resolve(wallet)
    } else {
      return Promise.reject(new Error("Wallet is not available"))
    }
  }

  getPrivateKey(): Promise<Buffer> {
    return this.getWallet().then(wallet => {
      return wallet.getPrivateKey()
    })
  }

  didStoreMnemonic(): Promise<void> {
    this.store.dispatch(actions.setDidStoreMnemonic(true))
    return Promise.resolve()
  }

  didChangeSharedState(fn: (state: SharedState) => void) {
    this.store.subscribe(() => {
      let state = this.store.getState()
      let sharedState = state.shared
      fn(sharedState)
    })
  }
}
