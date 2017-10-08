import * as redux from 'redux'
import {Reducer} from 'redux'
import {reducerWithInitialState} from "typescript-fsa-reducers";
import {FrameState, INITIAL_FRAME_STATE} from "./FrameState";
import actions from '../actions'
import {routerReducer} from 'react-router-redux'
import {topmenu} from './menu'

const tempReducer = reducerWithInitialState(INITIAL_FRAME_STATE.temp)
  .case(actions.temp.setWorkerProxy, actions.temp.setWorkerProxyHandler)
  .case(actions.temp.init.didAcceptTerms, actions.temp.init.didAcceptTermsHandler)
  .case(actions.temp.init.didReceiveMnemonic, actions.temp.init.didReceiveMnemonicHandler)

const sharedReducer = reducerWithInitialState(INITIAL_FRAME_STATE.shared)
  .case(actions.shared.setSharedState, actions.shared.setSharedStateHandler)

const reducers: Reducer<FrameState> = redux.combineReducers({
  router: routerReducer,
  temp: tempReducer,
  shared: sharedReducer,

  menu: topmenu,
});

export default reducers
