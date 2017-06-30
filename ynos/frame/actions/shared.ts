import actionCreatorFactory, {ActionCreator} from "typescript-fsa";
import {SharedState} from "../../worker/State";

const actionCreator = actionCreatorFactory("shared");

export const setSharedState: ActionCreator<SharedState> = actionCreator<SharedState>("setSharedState");
export function setSharedStateHandler(state: SharedState, sharedState: SharedState): SharedState {
  return sharedState
}
