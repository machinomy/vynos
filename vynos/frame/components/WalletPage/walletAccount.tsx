import * as React from 'react'
import {connect} from 'react-redux'
import Web3 = require('web3')
import {FrameState} from '../../redux/FrameState'

import {Image} from 'semantic-ui-react'

const style = require('../../styles/ynos.css')

export interface WalletAccountProps {
  web3?: Web3
  setAddress(address: string): void
  setDetailsDisplayed(value: boolean): void
}

export interface WalletAccountState {
  address: string|null
  balance: string
  isDetailsDisplayed: boolean
}

export class WalletAccount extends React.Component<WalletAccountProps, WalletAccountState> {
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
        this.props.setAddress(address);
      })
    }
  }

  componentWillUnmount () {
    clearInterval(this.updateBalanceTimer)
  }

  displayDetails () {
    let next = true
    if (this.state.isDetailsDisplayed) {
      next = false
    }
    this.setState({
      isDetailsDisplayed: next
    })
    this.props.setDetailsDisplayed(next);
  }

  render () {
    return <div className={style.walletHeader} onClick={this.displayDetails.bind(this)}>
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
  }
}

function mapStateToProps (state: FrameState, ownProps: WalletAccountProps): WalletAccountProps {
  return {
    web3: state.temp.workerProxy.web3,
    setAddress: ownProps.setAddress,
    setDetailsDisplayed: ownProps.setDetailsDisplayed
  }
}

export default connect(mapStateToProps)(WalletAccount)
