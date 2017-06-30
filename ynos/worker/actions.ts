import actionCreatorFactory, {ActionCreator} from "typescript-fsa";
import {PageState, State} from "./State";

const actionCreator = actionCreatorFactory();

export const setPage = actionCreator<PageState>("shared/setPage")
export function setPageHandler(state: State, pageState: PageState): State {
  return { ...state, shared: { ...state.shared, page: pageState }}
}
