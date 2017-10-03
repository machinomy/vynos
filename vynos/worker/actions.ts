import actionCreatorFactory, {ActionCreator} from "typescript-fsa";
import {PageState, WorkerState} from "./WorkerState";
import Wallet from "ethereumjs-wallet";

const actionCreator = actionCreatorFactory("worker");

// Shared

// Runtime

export const setWallet = actionCreator<Wallet|undefined>("runtime/setWallet")
export function setWalletHandler(state: WorkerState, wallet: Wallet|undefined): WorkerState {
  return { ...state,
    runtime: { ...state.runtime, wallet: wallet }
  }
}

// Background
export const setKeyring = actionCreator<string>("background/setKeyring")
export function setKeyringHandler(state: WorkerState, keyring: string): WorkerState {
  return { ...state,
    persistent: { ...state.persistent, keyring: keyring }
  }
}

export type RestoreWalletParam = {
  keyring: string,
  wallet: Wallet
}
export const restoreWallet = actionCreator<RestoreWalletParam>("background+runtime/restoreWallet")
export function restoreWalletHandler (state: WorkerState, param: RestoreWalletParam): WorkerState {
  return { ...state,
    persistent: { ...state.persistent, didInit: true, keyring: param.keyring },
    runtime: { ...state.runtime, wallet: param.wallet }
  }
}

export const setDidStoreMnemonic = actionCreator<boolean>("background/setDidStoreMnemonic")
export function setDidStoreMnemonicHandler(state: WorkerState): WorkerState {
  return {
    ...state,
    persistent: { ...state.persistent, didInit: true }
  }
}

