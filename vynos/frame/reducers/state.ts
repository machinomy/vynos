import * as redux from 'redux'
import {Reducer} from 'redux'
import {INITIAL_SHARED_STATE, SharedState} from '../../worker/WorkerState'
import WorkerProxy from '../WorkerProxy'
import {reducerWithInitialState} from 'typescript-fsa-reducers'
import actions from '../actions'
import {routerReducer, RouterState} from 'react-router-redux'

import {topmenu} from './menu'
import {welcome} from './welcome'
import {History} from 'history'

export interface InitPageState {
  didAcceptTerms: boolean
  mnemonic: string|null
}

export interface TempState {
  workerProxy?: WorkerProxy
  initPage: InitPageState
}

export interface FrameState {
  temp: TempState
  shared: SharedState
  router: RouterState
}

export const INITIAL_FRAME_STATE: FrameState = {
  temp: {
    initPage: {
      didAcceptTerms: false,
      mnemonic: null
    }
  },
  router: {
    location: null
  },
  shared: INITIAL_SHARED_STATE
};

const tempReducer = reducerWithInitialState(INITIAL_FRAME_STATE.temp)
  .case(actions.temp.setWorkerProxy, actions.temp.setWorkerProxyHandler)
  .case(actions.temp.init.didAcceptTerms, actions.temp.init.didAcceptTermsHandler)
  .case(actions.temp.init.didReceiveMnemonic, actions.temp.init.didReceiveMnemonicHandler)

const sharedReducer = reducerWithInitialState(INITIAL_FRAME_STATE.shared)
  .case(actions.shared.setSharedState, actions.shared.setSharedStateHandler)

export function rootReducers(history: History): Reducer<any> {
  return redux.combineReducers({
    router: routerReducer,
    temp: tempReducer,
    shared: sharedReducer,

    menu: topmenu,
    welcomePopup: welcome
  });
}
