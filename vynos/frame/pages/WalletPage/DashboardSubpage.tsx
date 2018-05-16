import * as React from 'react'
import { connect, ComponentClass } from 'react-redux'
import Web3 = require('web3')
import { FrameState } from '../../redux/FrameState'

import AddressSubpage from './AddressSubpage'
import TransactionsSubpage from './TransactionsSubpage'
import WalletAccount from '../../components/WalletPage/WalletAccount'
import Send from './Send'
import SettingStorage from '../../../lib/storage/SettingStorage'

const style = require('../../styles/ynos.css')
const settingStorage = new SettingStorage()

export interface DashboardSubpageProps {
  web3?: Web3
}

export interface DashboardSubpageState {
  isDetailsDisplayed: boolean
  address: string
  sendShown: boolean
  network: string
}

export class DashboardSubpage extends React.Component<DashboardSubpageProps, DashboardSubpageState> {
  constructor (props: any) {
    super(props)
    this.state = {
      isDetailsDisplayed: false,
      address: '',
      sendShown: false,
      network: 'Ropsten'
    }
  }

  renderChildren () {
    if (this.state.isDetailsDisplayed && this.state.address) {
      return <AddressSubpage address={this.state.address} showSend={this.showSend.bind(this)} network={this.state.network}/>
    } else {
      return <TransactionsSubpage />
    }
  }

  onChangeAddress (address: string) {
    this.setState({ address: address })
  }

  onChangeDetailsDisplayed (value: boolean) {
    this.setState({ isDetailsDisplayed: value })
  }

  showSend () {
    this.setState({ sendShown: true })
  }

  hideSend () {
    this.setState({ sendShown: false })
  }

  render () {
    settingStorage.getNetwork().then(networkSettings => this.setState({ network: networkSettings.name }))

    if (this.state.sendShown) {
      return <Send hideSend={this.hideSend.bind(this)}/>
    }

    return (
      <div className={style.walletPage}>
        <WalletAccount onChangeAddress={this.onChangeAddress.bind(this)} onChangeDetailsDisplayed={this.onChangeDetailsDisplayed.bind(this)} />
        <div className={style.wrap} >
          {this.renderChildren()}
        </div>
      </div>
    )
  }
}

function mapStateToProps (state: FrameState): DashboardSubpageProps {
  return {
    web3: state.temp.workerProxy.web3
  }
}

export default connect<DashboardSubpageProps, undefined, DashboardSubpageProps, FrameState>(mapStateToProps)(DashboardSubpage as ComponentClass<DashboardSubpageProps>)
