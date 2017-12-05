import Wallet from "ethereumjs-wallet";

export interface RuntimeState {
  wallet?: Wallet
  isTransactionPending: number
  lastUpdateDb: number
}

export interface SharedState {
  didInit: boolean
  isLocked: boolean
  isTransactionPending: number
  rememberPath: string
  lastUpdateDb: number
}

export interface PersistentState {
  didInit: boolean,
  keyring?: string,
  rememberPath: string
}

export interface WorkerState {
  persistent: PersistentState,
  runtime: RuntimeState
}

export const INITIAL_SHARED_STATE: SharedState = {
  didInit: false,
  isLocked: true,
  isTransactionPending: 0,
  rememberPath: '/',
  lastUpdateDb: 0
}

export const INITIAL_STATE: WorkerState = {
  persistent: {
    didInit: false,
    rememberPath: '/'
  },
  runtime: {
    isTransactionPending: 0,
    lastUpdateDb: 0
  }
}

export function buildSharedState(state: WorkerState): SharedState {
  return {
    didInit: state.persistent.didInit,
    isLocked: !state.runtime.wallet,
    isTransactionPending: state.runtime.isTransactionPending,
    rememberPath: state.persistent.rememberPath,
    lastUpdateDb: state.runtime.lastUpdateDb
  }
}
