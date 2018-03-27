import * as React from 'react'
import { connect } from 'react-redux'
import { FrameState } from '../redux/FrameState'
import InitPage from './InitPage'
import UnlockPage from './UnlockPage'
import WalletPage from './WalletPage'
import ApprovePage from '../components/WalletPage/ApprovePage'
import VerifiablePage from '../components/Account/Verifiable/index'

export function isUnlockPageExpected (state: FrameState): boolean {
  return !!(state.shared.didInit && state.temp.workerProxy && state.shared.isLocked)
}

export interface RootStateProps {
  isWalletExpected: boolean
  isUnlockExpected: boolean
  isTransactionPending: boolean
  isVerifiable: boolean
}

export interface RootStateState {
  showingVerifiable: boolean
}

export type RootContainerProps = RootStateProps

export class RootContainer extends React.Component<RootContainerProps, any> {

  constructor () {
    super()
    this.state = { showingVerifiable: false }
    this.showVerifiable = this.showVerifiable.bind(this)
    this.hideVerifiable = this.hideVerifiable.bind(this)
  }

  showVerifiable (): void {
    this.setState({ showingVerifiable: true })
  }

  hideVerifiable (): void {
    this.setState({ showingVerifiable: false })
  }

  renderVerifable () {
    if (this.state.showingVerifiable) {
      return <VerifiablePage showVerifiable={this.showVerifiable} hideVerifiable={this.hideVerifiable}/>
    }
  }

  renderOther () {
    if (this.props.isTransactionPending) {
      return <ApprovePage/>
    }
    if (this.props.isUnlockExpected) {
      return <UnlockPage showVerifiable={this.showVerifiable}/>
    } else if (this.props.isWalletExpected) {
      return <WalletPage showVerifiable={this.showVerifiable}/>
    } else {
      return <InitPage showVerifiable={this.showVerifiable}/>
    }
  }

  render () {
    return (
      <div>
        {this.renderVerifable()}
        {this.renderOther()}
      </div>
    )
  }
}

function mapStateToProps (state: FrameState): RootStateProps {
  return {
    isUnlockExpected: state.shared.didInit && state.shared.isLocked,
    isWalletExpected: state.shared.didInit && !state.shared.isLocked,
    isTransactionPending: state.shared.didInit && state.shared.isTransactionPending !== 0,
    isVerifiable: true
  }
}

export default connect<RootStateProps, undefined, any>(mapStateToProps)(RootContainer)
