import * as React from 'react'
import WalletMenu, {nameByPath} from './WalletMenu'
import {FrameState} from '../../redux/FrameState'
import {connect} from 'react-redux'
import DashboardSubpage from "./DashboardSubpage";
import Channels from "../../components/Account/Channels/index"
import TransactionStorage from "../../../lib/TransactionStorage";

export interface WalletPageStateProps {
  path: string
  name: string
  isTransactionPending: boolean
}

export class WalletPage extends React.Component<WalletPageStateProps, any> {
  renderSubpage () {
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
    storage.allPending().then(allpending => {
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
    name: nameByPath(state.shared.rememberPath),
    isTransactionPending: state.shared.isTransactionPending
  }
}

export default connect(mapStateToProps)(WalletPage)
