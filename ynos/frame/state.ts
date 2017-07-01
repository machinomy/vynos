import {INITIAL_STATE, SharedState} from "../worker/State";
import WorkerProxy from "./WorkerProxy";

export interface InitPageState {
  didAcceptTerms: boolean
  mnemonic: string|null
  didStoreMnemonic: boolean
}

export interface TempState {
  workerProxy?: WorkerProxy
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
      didStoreMnemonic: false
    }
  },
  shared: INITIAL_STATE.shared
}
