import * as redux from "redux";
import {INITIAL_SHARED_STATE, INITIAL_STATE, SharedState} from "../../worker/State";
import WorkerProxy from "../WorkerProxy";
import { reducerWithInitialState } from "typescript-fsa-reducers";
import actions from "../actions";
import {Reducer} from "redux";


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

export const INITIAL_FRAME_STATE: AppFrameState = {
  temp: {
    initPage: {
      didAcceptTerms: false,
      mnemonic: null,
    }
  },
  shared: INITIAL_SHARED_STATE
}


const tempReducer = reducerWithInitialState(INITIAL_FRAME_STATE.temp)
    .case(actions.temp.setWorkerProxy, actions.temp.setWorkerProxyHandler)
    .case(actions.temp.init.didAcceptTerms, actions.temp.init.didAcceptTermsHandler)
    .case(actions.temp.init.didReceiveMnemonic, actions.temp.init.didReceiveMnemonicHandler)

const sharedReducer = reducerWithInitialState(INITIAL_FRAME_STATE.shared)
    .case(actions.shared.setSharedState, actions.shared.setSharedStateHandler)

export const reducers: Reducer<any> = redux.combineReducers({
    temp: tempReducer,
    shared: sharedReducer
});


