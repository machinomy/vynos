import {FrameState} from '../state/FrameState'

export function isUnlockPageExpected(state: FrameState): boolean {
  return !!(state.shared.didInit && state.temp.workerProxy && state.shared.isLocked)
}
