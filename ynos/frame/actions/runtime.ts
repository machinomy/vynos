import Wallet from "ethereumjs-wallet";
import actionCreatorFactory, {ActionCreator} from "typescript-fsa";
import {RuntimeState} from "../state";

const actionCreator = actionCreatorFactory();

export const setMnemonic: ActionCreator<string> = actionCreator<string>('runtime/setMnemonic');
export function setMnemonicHandler(state: RuntimeState, mnemonic: string): RuntimeState {
  return { ...state, mnemonic: mnemonic };
}

export const setWallet: ActionCreator<Wallet> = actionCreator<Wallet>('runtime/setWallet');
export function setWalletHandler(state: RuntimeState, wallet: Wallet): RuntimeState {
  return { ...state, wallet: wallet };
}
