import * as React from 'react'
import WalletMenu, {nameByPath} from './WalletMenu'
import {FrameState} from '../../redux/FrameState'
import {connect} from 'react-redux'
import DashboardSubpage from "./DashboardSubpage";

export interface WalletPageStateProps {
  path: string
  name: string
}

export class WalletPage extends React.Component<any, any> {
  renderSubpage () {
    switch (this.props.name) {
      case 'Channels':
        return <p>Channels</p>
      case 'Preferences':
        return <p>Preferences</p>
      case 'Network':
        return <p>Network</p>
      default:
        return <DashboardSubpage />
    }
  }

  render () {
    return <WalletMenu>
      {this.renderSubpage()}
    </WalletMenu>
  }
}

function mapStateToProps(state: FrameState): WalletPageStateProps {
  return {
    path: state.shared.rememberPath,
    name: nameByPath(state.shared.rememberPath)
  }
}

export default connect(mapStateToProps)(WalletPage)
