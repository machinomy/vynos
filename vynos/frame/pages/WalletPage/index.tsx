import * as React from 'react'
import WalletMenu, { nameByPath } from './WalletMenu'
import { FrameState } from '../../redux/FrameState'
import { connect } from 'react-redux'
import DashboardSubpage from './DashboardSubpage'
import Channels from '../../components/Account/Channels/index'
import Network from '../../components/Account/Network/index'
import Preferences from '../../components/Account/Preferences/index'

export interface WalletPageStateProps {
  path?: string
  name?: string
  showVerifiable: () => void
}

export interface WalletPageState {
  sendShown: boolean
}

export class WalletPage extends React.Component<WalletPageStateProps, WalletPageState> {

  constructor (props: any) {
    super(props)
    this.state = { sendShown: false }
  }

  renderSubpage () {
    switch (this.props.name) {
      case 'Channels':
        return <Channels />
      case 'Preferences':
        return <Preferences showVerifiable={this.props.showVerifiable} />
      case 'Network':
        return <Network />
      default:
        return <DashboardSubpage />
    }
  }

  render () {
    return (
      <WalletMenu>
        {this.renderSubpage()}
      </WalletMenu>
    )
  }
}

function mapStateToProps (state: FrameState, props: WalletPageStateProps): WalletPageStateProps {
  return {
    path: state.shared.rememberPath,
    name: nameByPath(state.shared.rememberPath),
    showVerifiable: props.showVerifiable
  }
}

export default connect(mapStateToProps)(WalletPage)
