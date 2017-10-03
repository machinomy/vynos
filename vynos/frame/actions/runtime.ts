import actionCreatorFactory, {ActionCreator} from "typescript-fsa";

const actionCreator = actionCreatorFactory();
/*
export const doLock = actionCreator<void>('runtime/doLock');
export function doLockHandler(state: RuntimeState): RuntimeState {
  let resultState = Object.assign({}, state);
  delete resultState.background['wallet'];
  delete resultState.background['web3'];
  delete resultState.background['machinomyClient'];
  return resultState;
}
*/
