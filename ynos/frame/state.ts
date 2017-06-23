import Wallet from "ethereumjs-wallet";
import Web3 from "web3";
import { Sender } from "machinomy";
import BoughtItem from "./lib/BoughtItem";

export interface InitState {
  keyring: string|null;
  didAcceptTerms: string|null;
  didStoreSeed: string|null;
  bought?: Array<BoughtItem>
}

export interface RuntimeState {
  wallet?: Wallet;
  mnemonic?: string;
  web3?: Web3;
  machinomyClient?: Sender
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
