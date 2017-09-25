import actionCreatorFactory, {ActionCreator} from "typescript-fsa";
import {RuntimeState} from "../reducers/state";

const actionCreator = actionCreatorFactory();

export const setMnemonic: ActionCreator<string> = actionCreator<string>('runtime/setMnemonic');

export function setMnemonicHandler(state: RuntimeState, mnemonic: string): RuntimeState {
  return { ...state, mnemonic: mnemonic };
}

export const doLock = actionCreator<void>('runtime/doLock');
export function doLockHandler(state: RuntimeState): RuntimeState {
  let resultState = Object.assign({}, state);
  delete resultState.background['wallet'];
  delete resultState.background['web3'];
  delete resultState.background['machinomyClient'];
  return resultState;
}
