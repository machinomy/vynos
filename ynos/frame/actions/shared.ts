import actionCreatorFactory, {ActionCreator} from "typescript-fsa";
import {SharedState} from "../../worker/State";
import {Store} from "redux";
import {FrameState} from "../state";
import * as temp from "./temp"

const actionCreator = actionCreatorFactory("frame/shared");

export type SetSharedStateArgs = {
  sharedState: SharedState,
  store: Store<FrameState>
}
export const setSharedState: ActionCreator<SetSharedStateArgs> = actionCreator<SetSharedStateArgs>("setSharedState");
export function setSharedStateHandler(state: SharedState, {sharedState, store}: SetSharedStateArgs): SharedState {
  let workerProxy = store.getState().temp.workerProxy
  if (workerProxy) {
    workerProxy.getWeb3().then(web3 => {
      store.dispatch(temp.setWeb3(web3))
    })
  }
  return sharedState
}
