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

export interface BackgroundState {
  didInit: boolean,
  keyring?: string
}

export interface State {
  background: BackgroundState,
  runtime: RuntimeState,
}

export const INITIAL_SHARED_STATE: SharedState = {
  didInit: false,
  isLocked: true
}

export const INITIAL_STATE: State = {
  background: {
    didInit: false
  },
  runtime: {},
}

export function buildSharedState(state: State): SharedState {
  return {
    didInit: state.background.didInit,
    isLocked: !state.runtime.wallet
  }
}
