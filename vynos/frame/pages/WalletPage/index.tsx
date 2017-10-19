import * as React from 'react'
import WalletMenu, {nameByPath} from './WalletMenu'
import {FrameState} from '../../redux/FrameState'
import {connect} from 'react-redux'
import DashboardSubpage from "./DashboardSubpage";
import Channels from "../../components/Account/Channels/index"
import TransactionStorage from "../../../lib/storage/TransactionMetaStorage"
import {Menu} from 'semantic-ui-react'
import WalletAccount from "../../components/WalletPage/WalletAccount"

const style = require('../../styles/ynos.css')

export interface WalletPageStateProps {
  path: string
  name: string
}

export interface WalletPageState {
  sendShown: boolean
}


export class WalletPage extends React.Component<WalletPageStateProps, WalletPageState> {

  constructor (props: any) {
    super(props);
    this.state = {sendShown: false};
  }

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
        return <DashboardSubpage showSend={this.showSend.bind(this)} />
    }
  }

  showSend () {
    this.setState({sendShown: true});
  }

  hideSend () {
    this.setState({sendShown: false});
  }

  consoleLogPendingTxs () {
    let storage = new TransactionStorage()
    storage.pending().then(allpending => {
      console.log(allpending)
    })
  }

  setAddress (address: string){

  }

  setDetailsDisplayed (value: boolean){

  }

  render () {
    if(this.state.sendShown) return <div>
      <Menu className={style.clearBorder} style={{margin: 0}}>
        <Menu.Item link className={style.menuIntoOneItemFluid} onClick={this.hideSend.bind(this)}>
          <i className={style.vynosArrowBack}/> Send
        </Menu.Item>
      </Menu>
      <div>
        <WalletAccount setAddress={this.setAddress.bind(this)} setDetailsDisplayed={this.setDetailsDisplayed.bind(this)} />
      </div>
    </div>

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
