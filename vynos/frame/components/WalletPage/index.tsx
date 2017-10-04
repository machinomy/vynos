import * as React from 'react'
import {connect} from 'react-redux'
import Web3 = require('web3')
import {FrameState} from '../../state/FrameState'
import WorkerProxy from '../../WorkerProxy'

import { Container, List, Image, Header, Button } from 'semantic-ui-react'

const style = require('../../styles/ynos.css')

export interface WalletPageProps {
  workerProxy: WorkerProxy
  web3: Web3;
}

export interface WalletPageState {
  address: string|null;
  balance: string;
}

export class WalletPage extends React.Component<WalletPageProps, WalletPageState> {
  // updateBalanceTimer: any;

  constructor (props: any) {
    super(props);
    this.state = {
      address: null,
      balance: '0'
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
        setInterval(() => {
          web3.eth.getBalance(address, (err, balance) => {
            this.setState({
              balance: web3.fromWei(balance, 'ether').toString()
            })
          })
        }, 500)
        console.log(address)
        this.setState({address: address})
      })
    }
  }

  render () {
    return <div>
      <div className={style.walletHeader}>
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
      <div className={style.wrap}>
        List of Transactions
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
