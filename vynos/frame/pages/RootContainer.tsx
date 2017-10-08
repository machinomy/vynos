import * as React from 'react'
import {connect} from 'react-redux'
import {FrameState} from '../state/FrameState'
import InitPage from './InitPage'

export function isUnlockPageExpected(state: FrameState): boolean {
  return !!(state.shared.didInit && state.temp.workerProxy && state.shared.isLocked)
}

export interface RootStateProps {
  isInitPageExpected: boolean
  isWalletPageExpected: boolean
  isUnlockPageExpected: boolean
}

export type RootContainerProps = RootStateProps

export class RootContainer extends React.Component<RootContainerProps, any> {
  render () {
    if (this.props.isInitPageExpected) {
      return <InitPage />
    } else if (this.props.isUnlockPageExpected) {
      return <p>SignIn</p>
    } else if (this.props.isWalletPageExpected) {
      return <p>Redirect to="/wallet" </p>
    } else {
      return <p>Redirect to="/"</p>
    }
  }
}

function mapStateToProps(state: FrameState): RootStateProps {
  return {
    isInitPageExpected: !(state.shared.didInit),
    isWalletPageExpected: state.shared.didInit && !state.shared.isLocked,
    isUnlockPageExpected: isUnlockPageExpected(state)
  }
}

export default connect<RootStateProps, undefined, any>(mapStateToProps)(RootContainer)
