import Wallet from "ethereumjs-wallet";

export interface Preferences {
  micropaymentThreshold: number
  micropaymentThrottlingHumanReadable: string
  currency: string
}

export interface RuntimeState {
  wallet?: Wallet
  isTransactionPending: number
  lastUpdateDb: number
  lastMicropaymentTime: number
}

export interface SharedState {
  didInit: boolean
  isLocked: boolean
  isTransactionPending: number
  rememberPath: string
  lastUpdateDb: number
  preferences: Preferences
  lastMicropaymentTime: number
}

export interface PersistentState {
  didInit: boolean,
  keyring?: string,
  rememberPath: string
  preferences: Preferences
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
  lastUpdateDb: 0,
  preferences: {
    micropaymentThreshold: 1000000,
    micropaymentThrottlingHumanReadable: '-1ms',
    currency: 'ETH'
  },
  lastMicropaymentTime: 0
}

export const INITIAL_STATE: WorkerState = {
  persistent: {
    didInit: false,
    rememberPath: '/',
    preferences: {
      micropaymentThreshold: 1000000,
      micropaymentThrottlingHumanReadable: '-1ms',
      currency: 'ETH'
    }
  },
  runtime: {
    isTransactionPending: 0,
    lastUpdateDb: 0,
    lastMicropaymentTime: 0
  }
}

export function buildSharedState(state: WorkerState): SharedState {
  return {
    didInit: state.persistent.didInit,
    isLocked: !state.runtime.wallet,
    isTransactionPending: state.runtime.isTransactionPending,
    rememberPath: state.persistent.rememberPath,
    lastUpdateDb: state.runtime.lastUpdateDb,
    preferences: state.persistent.preferences,
    lastMicropaymentTime: state.runtime.lastMicropaymentTime
  }
}
