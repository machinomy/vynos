import {INITIAL_STATE, State} from "./State";
import {reducerWithInitialState, ReducerBuilder} from "typescript-fsa-reducers";
import * as actions from "./actions";

const reducers: ReducerBuilder<State, State> = reducerWithInitialState(INITIAL_STATE)
  .case(actions.setPage, actions.setPageHandler)

export default reducers
