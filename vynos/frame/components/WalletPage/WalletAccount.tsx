import * as React from 'react'
import { connect } from 'react-redux'
import * as Web3 from 'web3'
import { FrameState } from '../../redux/FrameState'
import * as BigNumber from 'bignumber.js'
import { Image } from 'semantic-ui-react'
import BlockieComponent from '../../components/BlockieComponent'
import Currency from '../../lib/Currency'

const style = require('../../styles/ynos.css')

export interface WalletAccountProps {
  web3?: Web3
  onChangeAddress?: (address: string) => void
  onChangeDetailsDisplayed?: (value: boolean) => void
  onChangeBalance?: (balance: number) => void
  displayCurrencyCode?: string
}

export interface WalletAccountState {
  address: string | null
  balance: string
  displayedBalance: string
  isDetailsDisplayed: boolean
}

export class WalletAccount extends React.Component<WalletAccountProps, WalletAccountState> {
  updateBalanceTimer: any

  constructor (props: any) {
    super(props)
    this.state = {
      address: null,
      balance: '0',
      displayedBalance: '0',
      isDetailsDisplayed: false
    }
  }

  renderAvatar () {
    if (localStorage.getItem('mc_wallet_avatar') && (localStorage.getItem('mc_wallet_avatar') as string).length > 0) {
      return (
        <div className={style.accountAvatar}>
          <Image src={localStorage.getItem('mc_wallet_avatar') as string} />
        </div>
      )
    } else {
      return (
        <BlockieComponent
                classDiv={'ui mini avatar image'}
                classCanvas={'ui mini avatar image'}
                size={35}
                scale={2}
                seed={this.state.address ? this.state.address : ''}
                onBlockieGenerated={(base64: string) => {
                  localStorage.setItem('mc_wallet_avatar', base64)
                }}
        />
      )
    }
  }

  componentDidMount () {
    if (this.props.web3) {
      let web3 = this.props.web3
      web3.eth.getAccounts((err, accounts) => {
        // tslint:disable-next-line:strict-type-predicates
        if (accounts !== undefined) {
          let address = accounts[0]
          this.updateBalanceTimer = setInterval(() => {
            web3.eth.getBalance(address, async (err, balance) => {
              let balanceInETH = parseFloat(web3.fromWei(balance, 'ether').toFixed(10))

              if (this.props.displayCurrencyCode! === 'ETH') {
                if (balanceInETH.toString() !== this.state.displayedBalance) {
                  this.setState({
                    balance: web3.fromWei(balance, 'ether').toString(),
                    displayedBalance: balanceInETH.toString()
                  })
                  if (this.props.onChangeBalance) {
                    this.props.onChangeBalance(parseFloat(this.state.balance))
                  }
                }
              } else if (balanceInETH.toFixed(2) !== this.state.displayedBalance) {
                this.setState({
                  balance: web3.fromWei(balance, 'ether').toString(),
                  displayedBalance: (await Currency.instance().convertCryptoOrCurrencyToCurrency(balanceInETH, 'ETH', this.props.displayCurrencyCode!)).toString()
                })
                if (this.props.onChangeBalance) {
                  this.props.onChangeBalance(parseFloat(this.state.balance))
                }
              }
            })
          }, 1000)
          this.setState({ address: address })
          if (this.props.onChangeAddress) {
            this.props.onChangeAddress(address)
          }
        }
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
    if (this.props.onChangeDetailsDisplayed) {
      this.props.onChangeDetailsDisplayed(next)
    }
  }

  render () {
    return (
      <div className={style.walletHeader} onClick={this.displayDetails.bind(this)}>
        {this.renderAvatar()}
        <div className={style.walletAccount}>
          <div className={style.walletAddress}>
            {this.state.address}
          </div>
          <div className={style.walletBalance}>
            <span className={style.ethBalance}>
              {
                this.props.displayCurrencyCode === 'ETH'
                  ? this.state.displayedBalance + ' ' + this.props.displayCurrencyCode
                  : new BigNumber.BigNumber(this.state.displayedBalance).toFixed(2) + ' ' + this.props.displayCurrencyCode
              }
            </span>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state: FrameState, ownProps: WalletAccountProps): WalletAccountProps {
  return {
    web3: state.temp.workerProxy.web3,
    onChangeAddress: ownProps.onChangeAddress,
    onChangeDetailsDisplayed: ownProps.onChangeDetailsDisplayed,
    onChangeBalance: ownProps.onChangeBalance,
    displayCurrencyCode: state.shared.preferences ? state.shared.preferences.currency : 'ETH'
  }
}

export default connect(mapStateToProps)(WalletAccount)
