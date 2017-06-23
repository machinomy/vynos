import * as React from "react";
import {connect} from "react-redux";
import Wallet from "ethereumjs-wallet";
import Web3 from "web3";
import _ from "lodash";
import {RuntimeState, State} from "../../state";
import {PaymentChannel, Sender} from "machinomy";

export interface WalletPageStateProps {
  wallet?: Wallet;
  web3?: Web3;
  machinomy?: Sender;
}

export interface WalletPageDispatchProps {

}

export type WalletPageProps = WalletPageStateProps & WalletPageDispatchProps;

export interface WalletPageState {
  address: string;
  balance: string;
  channels: Array<PaymentChannel>;
}

export class WalletPage extends React.Component<WalletPageProps, WalletPageState> {
  constructor (props: WalletPageProps) {
    super(props);
    if (!this.props.wallet) throw Error("Improbable error: props.wallet is not defined");
    this.state = {
      address: this.props.wallet.getAddressString(),
      balance: '-',
      channels: []
    }
  }

  renderBalance () {
    return <span>Balance: {this.state.balance.toString()}</span>
  }

  componentDidMount () {
    const web3 = this.props.web3;
    const machinomyClient = this.props.machinomy;
    if (web3 && machinomyClient) {
      web3.eth.getBalance(this.state.address, (error, balance) => {
        let machinomyStorage = machinomyClient.storage;
        machinomyStorage.channels.all().then((channels: Array<PaymentChannel>)=> {
          let availableChannels: Array<PaymentChannel> = _.uniqBy(_.filter(channels, channel => {
            return channel.state === 0 && channel.spent < channel.value
          }), 'channelId');
          this.setState({
            channels: availableChannels,
            balance: web3.fromWei(balance, "ether").toString()
          })
        })
      })
    }
  }

  renderChannels () {
    return _.map(this.state.channels, paymentChannel => {
      return <p key={paymentChannel.channelId}><small>{paymentChannel.receiver}: {paymentChannel.value - paymentChannel.spent}</small></p>
    })
  }

  render () {
    return <div>
      <h1>Wallet</h1>
      <p><small>{this.state.address}</small></p>
      <p>{this.renderBalance()}</p>
      <div>
        {this.renderChannels()}
      </div>
    </div>
  }
}

function mapStateToProps (state: State): WalletPageStateProps {
  return {
    wallet: state.runtime.wallet,
    web3: state.runtime.web3,
    machinomy: state.runtime.machinomyClient
  }
}

export default connect<WalletPageProps, undefined, any>(mapStateToProps)(WalletPage)
