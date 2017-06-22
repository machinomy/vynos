import * as redux from "redux";
import { INITIAL_STATE } from "./state";
import { reducerWithInitialState } from "typescript-fsa-reducers";
import actions from "./actions";

const initReducer = reducerWithInitialState(INITIAL_STATE.init)
  .case(actions.init.acceptTerms, actions.init.acceptTermsHandler)
  .case(actions.init.setKeyring, actions.init.setKeyringHandler)
  .case(actions.init.didStoreSeed, actions.init.didStoreSeedHandler);

const runtimeReducer = reducerWithInitialState(INITIAL_STATE.runtime)
  .case(actions.runtime.setMnemonic, actions.runtime.setMnemonicHandler)
  .case(actions.runtime.setWallet, actions.runtime.setWalletHandler);

export default redux.combineReducers({
  init: initReducer,
  runtime: runtimeReducer,
  routing: function(state) {
    return state || INITIAL_STATE.routing;
  }
});
