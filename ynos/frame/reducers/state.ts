import {INITIAL_SHARED_STATE, INITIAL_STATE, SharedState} from "../../worker/State";
import WorkerProxy from "../WorkerProxy";

export interface InitPageState {
  didAcceptTerms: boolean
  mnemonic: string|null
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
    }
  },
  shared: INITIAL_SHARED_STATE
}
