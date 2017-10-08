import * as redux from 'redux'
import {Reducer} from 'redux'
import {reducerWithInitialState} from "typescript-fsa-reducers";
import {FrameState, initialState} from "./FrameState";
import actions from '../actions'
import {routerReducer} from 'react-router-redux'
import {topmenu} from './menu'
import WorkerProxy from "../WorkerProxy";

export default function reducers(workerProxy: WorkerProxy): Reducer<FrameState> {
  const state = initialState(workerProxy)

  const tempReducer = reducerWithInitialState(state.temp)
    .case(actions.temp.init.didAcceptTerms, actions.temp.init.didAcceptTermsHandler)
    .case(actions.temp.init.didReceiveMnemonic, actions.temp.init.didReceiveMnemonicHandler)

  const sharedReducer = reducerWithInitialState(state.shared)
    .case(actions.shared.setSharedState, actions.shared.setSharedStateHandler)

  return redux.combineReducers({
    router: routerReducer,
    temp: tempReducer,
    shared: sharedReducer,

    menu: topmenu,
  });
}
