import Wallet from "ethereumjs-wallet";
import Web3 = require("web3")
import Sender from "machinomy/lib/sender";
import BoughtItem from "../lib/BoughtItem";

export interface InitState {
  keyring: string|null;
  didAcceptTerms: string|null;
  didStoreSeed: string|null;
  bought?: Array<BoughtItem>
}

export interface BackgroundState {
  wallet?: Wallet;
  web3?: Web3;
  machinomyClient?: Sender;
}

export interface RuntimeState {
  walletPresent: boolean;
  mnemonic?: string;
  background: BackgroundState
}

export interface RoutingState {
  maxLocationDepth: number;
  locations: Array<string>;
}

export interface State {
  init: InitState;
  runtime: RuntimeState;
}

export const INITIAL_STATE: State = {
  init: {
    keyring: null,
    didAcceptTerms: null,
    didStoreSeed: null,
  },
  runtime: {
    walletPresent: false,
    background: {}
  },
};
