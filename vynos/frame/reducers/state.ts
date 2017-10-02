import * as redux from "redux";
import {Reducer} from "redux";
import {INITIAL_SHARED_STATE, INITIAL_STATE, SharedState} from "../../worker/State";
import WorkerProxy from "../WorkerProxy";
import { reducerWithInitialState } from "typescript-fsa-reducers";
import actions from "../actions";
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'


///////////////////////////////////////////////////////////////// astate
import Wallet from "ethereumjs-wallet";
import Web3 = require("web3")
import Sender from "machinomy/lib/sender";
import BoughtItem from "../lib/BoughtItem";

import {topmenu} from './menu';
import {welcome} from './welcome';
import {History} from "history";

export interface InitPageState {
  didAcceptTerms: boolean
  mnemonic: string|null
}

export interface TempState {
  workerProxy?: WorkerProxy
  initPage: InitPageState
}

export interface AppFrameState {
  temp: TempState
  shared: SharedState
}

export interface InitState {
  keyring: string|null;
  didAcceptTerms: string|null;
  didStoreSeed: string|null;
  bought?: Array<BoughtItem>
}

export interface BackgroundState {
  wallet?: Wallet;
  web3?: Web3;
  machinomyClient?: Sender;
}

export interface RuntimeState {
  walletPresent: boolean;
  mnemonic?: string;
  background: BackgroundState
}

export interface State {
  init: InitState;
  runtime: RuntimeState;
}


export const INITIAL_FRAME_STATE: AppFrameState = {
  temp: {
    initPage: {
      didAcceptTerms: false,
      mnemonic: null,
    }
  },
  shared: INITIAL_SHARED_STATE
};


const INITIAL_AR_STATE: State = {
  init: {
    keyring: null,
    didAcceptTerms: null,
    didStoreSeed: null,
  },
  runtime: {
    walletPresent: false,
    background: {}
  },
};


const tempReducer = reducerWithInitialState(INITIAL_FRAME_STATE.temp)
  .case(actions.temp.setWorkerProxy, actions.temp.setWorkerProxyHandler)
  .case(actions.temp.init.didAcceptTerms, actions.temp.init.didAcceptTermsHandler)
  .case(actions.temp.init.didReceiveMnemonic, actions.temp.init.didReceiveMnemonicHandler)

const sharedReducer = reducerWithInitialState(INITIAL_FRAME_STATE.shared)
  .case(actions.shared.setSharedState, actions.shared.setSharedStateHandler)

const runtimeReducer = reducerWithInitialState(INITIAL_AR_STATE.runtime)
  .case(actions.runtime.setMnemonic, actions.runtime.setMnemonicHandler);


export function rootReducers(history: History): Reducer<any> {
  return redux.combineReducers({
    router: routerReducer,
    temp: tempReducer,
    shared: sharedReducer,
    runtime: runtimeReducer,

    menu: topmenu,
    welcomePopup: welcome
  });
}
