import {INITIAL_STATE, SharedState} from "../worker/State";
import WorkerProxy from "./WorkerProxy";
import Web3 from "web3";

export interface InitPageState {
  didAcceptTerms: boolean
  mnemonic: string|null
}

export interface TempState {
  workerProxy?: WorkerProxy
  web3?: Web3
  initPage: InitPageState
}

export interface FrameState {
  temp: TempState
  shared: SharedState
}

export const INITIAL_FRAME_STATE: FrameState = {
  temp: {
    initPage: {
      didAcceptTerms: false,
      mnemonic: null,
    }
  },
  shared: INITIAL_STATE.shared
}
