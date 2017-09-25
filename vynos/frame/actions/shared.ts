import actionCreatorFactory, {ActionCreator} from "typescript-fsa";
import {SharedState} from "../../worker/State";
import {Store} from "redux";
import {AppFrameState} from "../reducers/state";
import * as temp from "./temp"

const actionCreator = actionCreatorFactory("frame/shared");

export type SetSharedStateArgs = {
  sharedState: SharedState,
  store: Store<AppFrameState>
}
export const setSharedState: ActionCreator<SetSharedStateArgs> = actionCreator<SetSharedStateArgs>("setSharedState");
export function setSharedStateHandler(state: SharedState, {sharedState, store}: SetSharedStateArgs): SharedState {
  return sharedState
}
