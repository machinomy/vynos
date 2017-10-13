import * as React from 'react'
import WalletMenu, {nameByPath} from './WalletMenu'
import {FrameState} from '../../redux/FrameState'
import {connect} from 'react-redux'
import DashboardSubpage from "./DashboardSubpage";
import Channels from "../../components/Account/Channels/index"
import TransactionStorage from "../../../lib/storage/TransactionMetaStorage"

export interface WalletPageStateProps {
  path: string
  name: string
}

export class WalletPage extends React.Component<WalletPageStateProps, any> {
  renderSubpage () {
    console.log('WalletPage.renderSubpage', this.props.name)
    switch (this.props.name) {
      case 'Channels':
        return <Channels />
      case 'Preferences':
        return <p>Preferences</p>
      case 'Network':
        return <p>Network</p>
      default:
        return <DashboardSubpage />
    }
  }

  consoleLogPendingTxs () {
    let storage = new TransactionStorage()
    storage.pending().then(allpending => {
      console.log(allpending)
    })
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
