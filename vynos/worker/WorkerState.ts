import Wallet from "ethereumjs-wallet";

export interface RuntimeState {
  wallet?: Wallet
}

export interface PageState {
  name: string
}

export interface SharedState {
  didInit: boolean
  isLocked: boolean
}

export interface PersistentState {
  didInit: boolean,
  keyring?: string
}

export interface WorkerState {
  persistent: PersistentState,
  runtime: RuntimeState,
}

export const INITIAL_SHARED_STATE: SharedState = {
  didInit: false,
  isLocked: true
}

export const INITIAL_STATE: WorkerState = {
  persistent: {
    didInit: false
  },
  runtime: {},
}

export function buildSharedState(state: WorkerState): SharedState {
  return {
    didInit: state.persistent.didInit,
    isLocked: !state.runtime.wallet
  }
}
