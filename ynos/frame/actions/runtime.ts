import actionCreatorFactory, {ActionCreator} from "typescript-fsa";
import {RuntimeState} from "../state";

const actionCreator = actionCreatorFactory();

export const setMnemonic: ActionCreator<string> = actionCreator<string>('runtime/setMnemonic');
export function setMnemonicHandler(state: RuntimeState, mnemonic: string): RuntimeState {
  return { ...state, mnemonic: mnemonic };
}
