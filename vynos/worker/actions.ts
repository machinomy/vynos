import actionCreatorFactory, {ActionCreator} from 'typescript-fsa'
import {WorkerState} from './WorkerState';
import Wallet from 'ethereumjs-wallet'
import Transaction from "../lib/TransactionMeta";

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

export const setTransactionPending = actionCreator<boolean>('runtime/setTransactionPending')
export function setTransactionPendingHandler(state: WorkerState, pending: boolean): WorkerState {
  let pendingDate = 0
  if (pending) {
    pendingDate = Date.now()
  }
  return {
    ...state,
    runtime: { ...state.runtime, isTransactionPending: pendingDate }
  }
}

export const rememberPage = actionCreator<string>('persistent/rememberPage')
export function rememberPageHandler(state: WorkerState, path: string): WorkerState {
  return {
    ...state,
    persistent: { ...state.persistent, rememberPath: path }
  }
}

export const setLastUpdateDb = actionCreator<number>('runtime/setLastUpdateDb')
export function setLastUpdateDbHandler(state: WorkerState, timestamp: number): WorkerState {
  return {
    ...state,
    runtime: {...state.runtime, lastUpdateDb: timestamp}
  }
}
