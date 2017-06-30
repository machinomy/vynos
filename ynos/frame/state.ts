import {INITIAL_STATE, SharedState} from "../worker/State";
import WorkerProxy from "./WorkerProxy";

export interface TempState {
  workerProxy?: WorkerProxy
}

export interface FrameState {
  temp: TempState
  shared: SharedState
}

export const INITIAL_FRAME_STATE: FrameState = {
  temp: {},
  shared: INITIAL_STATE.shared
}
