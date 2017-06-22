import Wallet from "ethereumjs-wallet";

export interface InitState {
  keyring: string|null;
  didAcceptTerms: string|null;
  didStoreSeed: string|null;
}

export interface RuntimeState {
  wallet?: Wallet;
  mnemonic?: string;
}

export interface RoutingState {
  maxLocationDepth: number;
  locations: Array<string>;
}

export interface State {
  init: InitState;
  runtime: RuntimeState;
  routing: RoutingState;
}

export const INITIAL_STATE: State = {
  init: {
    keyring: null,
    didAcceptTerms: null,
    didStoreSeed: null,
  },
  runtime: {},
  routing: {
    maxLocationDepth: 10,
    locations: []
  }
};
