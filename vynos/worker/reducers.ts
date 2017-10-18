import {INITIAL_STATE, WorkerState} from "./WorkerState";
import {reducerWithInitialState, ReducerBuilder} from "typescript-fsa-reducers";
import * as actions from "./actions";

const reducers: ReducerBuilder<WorkerState, WorkerState> = reducerWithInitialState(INITIAL_STATE)
  .case(actions.setWallet, actions.setWalletHandler)
  .case(actions.setKeyring, actions.setKeyringHandler)
  .case(actions.setDidStoreMnemonic, actions.setDidStoreMnemonicHandler)
  .case(actions.restoreWallet, actions.restoreWalletHandler)
  .case(actions.setTransactionPending, actions.setTransactionPendingHandler)
  .case(actions.rememberPage, actions.rememberPageHandler)
  .case(actions.setLastUpdateDb, actions.setLastUpdateDbHandler)

export default reducers
