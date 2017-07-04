import actionCreatorFactory, {ActionCreator} from "typescript-fsa";
import {PageState, State} from "./State";
import Wallet from "ethereumjs-wallet";

const actionCreator = actionCreatorFactory();

// Shared

// Runtime

export const setWallet = actionCreator<Wallet|undefined>("runtime/setWallet")
export function setWalletHandler(state: State, wallet: Wallet|undefined): State {
  return { ...state,
    runtime: { ...state.runtime, wallet: wallet }
  }
}

// Background
export const setKeyring = actionCreator<string>("background/setKeyring")
export function setKeyringHandler(state: State, keyring: string): State {
  return { ...state, background: { ...state.background, keyring: keyring } }
}

export const setDidStoreMnemonic = actionCreator<boolean>("background/setDidStoreMnemonic")
export function setDidStoreMnemonicHandler(state: State): State {
  return {
    ...state,
    background: { ...state.background, didInit: true }
  }
}

