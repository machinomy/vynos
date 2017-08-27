import * as redux from "redux";
import {FrameState, INITIAL_FRAME_STATE} from "./state";
import { reducerWithInitialState } from "typescript-fsa-reducers";
import actions from "../actions";
import {Reducer} from "redux";

const tempReducer = reducerWithInitialState(INITIAL_FRAME_STATE.temp)
  .case(actions.temp.setWorkerProxy, actions.temp.setWorkerProxyHandler)
  .case(actions.temp.init.didAcceptTerms, actions.temp.init.didAcceptTermsHandler)
  .case(actions.temp.init.didReceiveMnemonic, actions.temp.init.didReceiveMnemonicHandler)

const sharedReducer = reducerWithInitialState(INITIAL_FRAME_STATE.shared)
  .case(actions.shared.setSharedState, actions.shared.setSharedStateHandler)

const reducers: Reducer<FrameState> = redux.combineReducers({
  temp: tempReducer,
  shared: sharedReducer
});

export default reducers
