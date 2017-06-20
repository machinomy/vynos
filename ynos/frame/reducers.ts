import * as redux from "redux";
import { INITIAL_STATE } from "./state";
import { reducerWithInitialState } from "typescript-fsa-reducers";
import * as initActions from "./actions/init";

const initReducer = reducerWithInitialState(INITIAL_STATE.init)
  .case(initActions.acceptTerms, initActions.acceptTermsHandler)
  .case(initActions.setKeyring, initActions.setKeyringHandler);

export default redux.combineReducers({
  init: initReducer,
  runtime: function(state) {
    return state || INITIAL_STATE.runtime;
  },
  routing: function(state) {
    return state || INITIAL_STATE.routing;
  }
});
