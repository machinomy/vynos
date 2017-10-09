import * as redux from 'redux'
import {Reducer} from 'redux'
import {reducerWithInitialState} from "typescript-fsa-reducers";
import {FrameState, initialState} from "./FrameState";
import * as actions from '../actions'
import {routerReducer} from 'react-router-redux'
import {topmenu} from './menu'
import WorkerProxy from "../WorkerProxy";

export default function reducers(workerProxy: WorkerProxy): Reducer<FrameState> {
  const state = initialState(workerProxy)

  const tempReducer = reducerWithInitialState(state.temp)
    .case(actions.didAcceptTerms, actions.didAcceptTermsHandler)
    .case(actions.didReceiveMnemonic, actions.didReceiveMnemonicHandler)

  const sharedReducer = reducerWithInitialState(state.shared)
    .case(actions.setSharedState, actions.setSharedStateHandler)

  return redux.combineReducers({
    router: routerReducer,
    temp: tempReducer,
    shared: sharedReducer,

    menu: topmenu,
  });
}
