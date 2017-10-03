import actionCreatorFactory, {ActionCreator} from 'typescript-fsa'
import {WorkerState} from './WorkerState';
import Wallet from 'ethereumjs-wallet'

const actionCreator = actionCreatorFactory("worker");

// Runtime
export const setWallet = actionCreator<Wallet|undefined>("runtime/setWallet")
export function setWalletHandler(state: WorkerState, wallet: Wallet|undefined): WorkerState {
  return { ...state,
    runtime: { ...state.runtime, wallet: wallet }
  }
}

// Persistent
export const setKeyring = actionCreator<string>("persistent/setKeyring")
export function setKeyringHandler(state: WorkerState, keyring: string): WorkerState {
  return { ...state,
    persistent: { ...state.persistent, keyring: keyring }
  }
}

export type RestoreWalletParam = {
  keyring: string,
  wallet: Wallet
}
export const restoreWallet = actionCreator<RestoreWalletParam>("persistent+runtime/restoreWallet")
export function restoreWalletHandler (state: WorkerState, param: RestoreWalletParam): WorkerState {
  return { ...state,
    persistent: { ...state.persistent, didInit: true, keyring: param.keyring },
    runtime: { ...state.runtime, wallet: param.wallet }
  }
}

export const setDidStoreMnemonic = actionCreator<boolean>("persistent/setDidStoreMnemonic")
export function setDidStoreMnemonicHandler(state: WorkerState): WorkerState {
  return {
    ...state,
    persistent: { ...state.persistent, didInit: true }
  }
}

