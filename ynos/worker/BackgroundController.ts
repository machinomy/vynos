import * as redux from "redux";
import reducers from "./reducers";
import {INITIAL_STATE, SharedState, State} from "./State";
import {Store} from "redux";
import * as actions from "./actions";

export default class BackgroundController {
  store: Store<State>

  constructor() {
    this.store = redux.createStore(reducers, INITIAL_STATE)
  }

  setPage(name: string): Promise<SharedState> {
    this.store.dispatch(actions.setPage({name: "foo"}))
    let state = this.store.getState()
    console.log(state)
    return Promise.resolve(state.shared)
  }
}
