import * as React from 'react'
import {connect} from 'react-redux'
import Web3 = require('web3')
import {FrameState} from '../../redux/FrameState'

import AddressSubpage from "./AddressSubpage";
import TransactionsSubpage from "./TransactionsSubpage";
import WalletAccount from "../../components/WalletPage/WalletAccount"

const style = require('../../styles/ynos.css')

export interface DashboardSubpageProps {
  web3?: Web3
  showSend(): void
}

export interface DashboardSubpageState {
  isDetailsDisplayed: boolean
  address: string
}

export class DashboardSubpage extends React.Component<DashboardSubpageProps, DashboardSubpageState> {

  constructor (props: any) {
    super(props);
    this.state = {
      isDetailsDisplayed: false,
      address: ""
    }
  }

  renderChildren () {
    if (this.state.isDetailsDisplayed && this.state.address) {
      return <AddressSubpage address={this.state.address} showSend={this.props.showSend.bind(this)}/>
    } else {
      return <TransactionsSubpage />
    }
  }

  setAddress (address: string) {
    this.setState({address: address});
  }

  setDetailsDisplayed (value: boolean){
    this.setState({isDetailsDisplayed: value});
  }

  render () {
    return <div className={style.walletPage}>
      <WalletAccount setAddress={this.setAddress.bind(this)} setDetailsDisplayed={this.setDetailsDisplayed.bind(this)} />
      <div className={style.wrap} >
        {this.renderChildren()}
      </div>
    </div>
  }
}

function mapStateToProps (state: FrameState, ownProps: DashboardSubpageProps): DashboardSubpageProps {
  return {
    web3: state.temp.workerProxy.web3,
    showSend: ownProps.showSend
  }
}

export default connect(mapStateToProps)(DashboardSubpage)
