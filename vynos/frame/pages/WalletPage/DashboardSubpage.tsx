import * as React from 'react'
import {connect} from 'react-redux'
import Web3 = require('web3')
import {FrameState} from '../../redux/FrameState'

import AddressSubpage from "./AddressSubpage";
import TransactionsSubpage from "./TransactionsSubpage";
import WalletAccount from "../../components/WalletPage/WalletAccount"
import Send from "./Send"

const style = require('../../styles/ynos.css')

export interface DashboardSubpageProps {
  web3?: Web3
}

export interface DashboardSubpageState {
  isDetailsDisplayed: boolean
  address: string
  sendShown: boolean
}

export class DashboardSubpage extends React.Component<DashboardSubpageProps, DashboardSubpageState> {
  _isMounted: boolean

  constructor (props: any) {
    super(props);
    this.state = {
      isDetailsDisplayed: false,
      address: "",
      sendShown: false
    }
    this._isMounted = false
  }

  renderChildren () {
    if (this.state.isDetailsDisplayed && this.state.address) {
      return <AddressSubpage address={this.state.address} showSend={this.showSend.bind(this)}/>
    } else {
      return <TransactionsSubpage />
    }
  }

  onChangeAddress (address: string) {
    if (this._isMounted) {
      this.setState({address: address})
    }
  }

  onChangeDetailsDisplayed (value: boolean){
    if (this._isMounted) {
      this.setState({isDetailsDisplayed: value})
    }
  }

  showSend () {
    if (this._isMounted) {
      this.setState({sendShown: true})
    }
  }

  hideSend () {
    if (this._isMounted) {
      this.setState({sendShown: false})
    }
  }

  componentDidMount() {
    this._isMounted = true
  }

  render () {
    if(this.state.sendShown) return <Send hideSend={this.hideSend.bind(this)}/>

    return <div className={style.walletPage}>
      <WalletAccount onChangeAddress={this.onChangeAddress.bind(this)} onChangeDetailsDisplayed={this.onChangeDetailsDisplayed.bind(this)} />
      <div className={style.wrap} >
        {this.renderChildren()}
      </div>
    </div>
  }

  componentWillUnmount() {
    this._isMounted = false
  }
}

function mapStateToProps (state: FrameState): DashboardSubpageProps {
  return {
    web3: state.temp.workerProxy.web3
  }
}

export default connect(mapStateToProps)(DashboardSubpage)
