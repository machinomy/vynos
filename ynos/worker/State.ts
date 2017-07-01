import Wallet from "ethereumjs-wallet";

export interface RuntimeState {
  wallet?: Wallet
}

export interface PageState {
  name: string
}

export interface SharedState {
  didInit: boolean
}

export interface BackgroundState {
  didInit: boolean,
  keyring?: string
}

export interface State {
  background: BackgroundState,
  runtime: RuntimeState,
  shared: SharedState
}

export const INITIAL_STATE: State = {
  background: {
    didInit: false
  },
  runtime: {},
  shared: {
    didInit: false,
  }
}
