import * as React from 'react'
import {connect} from 'react-redux'
import Web3 = require('web3')
import {FrameState} from '../../redux/FrameState'
import WorkerProxy from '../../WorkerProxy'

import { Container, List, Image, Header, Button } from 'semantic-ui-react'
import AddressSubpage from "./AddressSubpage";

const style = require('../../styles/ynos.css')

export interface WalletPageProps {
  workerProxy: WorkerProxy
  web3: Web3;
}

export interface WalletPageState {
  address: string|null
  balance: string
  isDetailsDisplayed: boolean
}

export class WalletPage extends React.Component<WalletPageProps, WalletPageState> {
  updateBalanceTimer: any;

  constructor (props: any) {
    super(props);
    this.state = {
      address: null,
      balance: '0',
      isDetailsDisplayed: false
    }
  }

  renderBlockie () {
    return <div className={style.accountAvatar}>
      <Image src={require('../../styles/images/avatar.svg')} />
    </div>
  }

  componentDidMount () {
    if (this.props.web3) {
      let web3 = this.props.web3
      web3.eth.getAccounts((err, accounts) => {
        let address = accounts[0]
        this.updateBalanceTimer = setInterval(() => {
          web3.eth.getBalance(address, (err, balance) => {
            this.setState({
              balance: web3.fromWei(balance, 'ether').toString()
            })
          })
        }, 500)
        this.setState({address: address})
      })
    }
  }

  componentWillUnmount () {
    clearInterval(this.updateBalanceTimer)
  }

  renderChildren () {
    if (this.state.isDetailsDisplayed && this.state.address) {
      return <AddressSubpage address={this.state.address}/>
    } else {
      return <p>Transactions</p>
    }
  }

  displayDetails () {
    let next = true
    if (this.state.isDetailsDisplayed) {
      next = false
    }
    this.setState({
      isDetailsDisplayed: next
    })
  }

  render () {
    return <div className={style.walletPage}>
      <div className={style.walletHeader} onClick={this.displayDetails.bind(this)}>
        {this.renderBlockie()}
        <div className={style.walletAccount}>
          <div className={style.walletAddress}>
            {this.state.address}
          </div>
          <div className={style.walletBalance}>
            <span className={style.ethBalance}>{this.state.balance}</span>
          </div>
        </div>
      </div>
      <div className={style.wrap} >
        {this.renderChildren()}
      </div>
    </div>
  }
}

function mapStateToProps (state: FrameState): WalletPageProps {
  let workerProxy = state.temp.workerProxy!
  return {
    workerProxy: workerProxy,
    web3: workerProxy.getWeb3()
  }
}

export default connect(mapStateToProps)(WalletPage)
