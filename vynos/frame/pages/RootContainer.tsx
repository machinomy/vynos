import * as React from 'react'
import {connect} from 'react-redux'
import {FrameState} from '../redux/FrameState'
import InitPage from './InitPage'
import UnlockPage from "./UnlockPage";
import WalletPage from './WalletPage';
import ApprovePage from "../components/WalletPage/ApprovePage"

export function isUnlockPageExpected(state: FrameState): boolean {
  return !!(state.shared.didInit && state.temp.workerProxy && state.shared.isLocked)
}

export interface RootStateProps {
  isWalletExpected: boolean
  isUnlockExpected: boolean
  isTransactionPending: boolean
}

export type RootContainerProps = RootStateProps

export class RootContainer extends React.Component<RootContainerProps, any> {
  render () {
    if (this.props.isTransactionPending) {
      return <ApprovePage />
    }
    if (this.props.isUnlockExpected) {
      return <UnlockPage />
    } else if (this.props.isWalletExpected) {
      return <WalletPage/>
    } else {
      return <InitPage />
    }
  }
}

function mapStateToProps(state: FrameState): RootStateProps {
  return {
    isUnlockExpected: state.shared.didInit && state.shared.isLocked,
    isWalletExpected: state.shared.didInit && !state.shared.isLocked,
    isTransactionPending: state.shared.didInit && state.shared.isTransactionPending !== 0
  }
}

export default connect<RootStateProps, undefined, any>(mapStateToProps)(RootContainer)
