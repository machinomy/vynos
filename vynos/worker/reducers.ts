import {INITIAL_STATE, State} from "./State";
import {reducerWithInitialState, ReducerBuilder} from "typescript-fsa-reducers";
import * as actions from "./actions";

const reducers: ReducerBuilder<State, State> = reducerWithInitialState(INITIAL_STATE)
  .case(actions.setWallet, actions.setWalletHandler)
  .case(actions.setKeyring, actions.setKeyringHandler)
  .case(actions.setDidStoreMnemonic, actions.setDidStoreMnemonicHandler)
  .case(actions.restoreWallet, actions.restoreWalletHandler)

export default reducers
