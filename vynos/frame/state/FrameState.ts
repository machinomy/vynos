import {INITIAL_SHARED_STATE, SharedState} from '../../worker/WorkerState'
import WorkerProxy from '../WorkerProxy'
import {RouterState} from 'react-router-redux'

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
  router: RouterState
}

export const INITIAL_FRAME_STATE: FrameState = {
  temp: {
    initPage: {
      didAcceptTerms: false,
      mnemonic: null
    }
  },
  router: {
    location: null
  },
  shared: INITIAL_SHARED_STATE
}
