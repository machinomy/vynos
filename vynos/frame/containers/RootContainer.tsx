import * as React from 'react'
import {connect} from 'react-redux'
import {FrameState} from '../state/FrameState'

export function isUnlockPageExpected(state: FrameState): boolean {
  return !!(state.shared.didInit && state.temp.workerProxy && state.shared.isLocked)
}

export interface RootRouteProps {
  isInitPageExpected: boolean
  isWalletPageExpected: boolean
  isUnlockPageExpected: boolean
}

const RootContainer = (props: RootRouteProps) => {
  if (props.isInitPageExpected) {
    return <p>Redirect to="/init"</p>
  } else if (props.isUnlockPageExpected) {
    return <p>SignIn</p>
  } else if (props.isWalletPageExpected) {
    return <p>Redirect to="/wallet" </p>
  } else {
    return <p>Redirect to="/"</p>
  }
}

function mapStateToProps(state: FrameState): RootRouteProps {
  return {
    isInitPageExpected: !(state.shared.didInit),
    isWalletPageExpected: !!(state.shared.didInit && state.temp.workerProxy && !state.shared.isLocked),
    isUnlockPageExpected: isUnlockPageExpected(state)
  }
}

export default connect<RootRouteProps, undefined, any>(mapStateToProps)(RootContainer)
