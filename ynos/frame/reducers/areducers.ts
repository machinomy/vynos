import * as redux from "redux";
import { INITIAL_STATE } from "./astate";
import { reducerWithInitialState } from "typescript-fsa-reducers";
import actions from "../actions";

const runtimeReducer = reducerWithInitialState(INITIAL_STATE.runtime)
  .case(actions.runtime.setMnemonic, actions.runtime.setMnemonicHandler);

export default redux.combineReducers({
  runtime: runtimeReducer
});
