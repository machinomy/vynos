import actionCreatorFactory, {ActionCreator} from "typescript-fsa";
import {SharedState} from "../../worker/WorkerState";
import {Store} from "redux";
import {FrameState} from "../state/FrameState";

const actionCreator = actionCreatorFactory("frame/shared");

export type SetSharedStateArgs = {
  sharedState: SharedState,
  store: Store<FrameState>
}
export const setSharedState: ActionCreator<SetSharedStateArgs> = actionCreator<SetSharedStateArgs>("setSharedState");
export function setSharedStateHandler(state: SharedState, {sharedState, store}: SetSharedStateArgs): SharedState {
  return sharedState
}
