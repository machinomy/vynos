import * as React from "react";
import {connect} from "react-redux";
import Wallet from "ethereumjs-wallet";
import Web3 from "web3";
import _ from "lodash";
import {State} from "../../state";
import {PaymentChannel} from "machinomy";
import {CSSProperties} from "react";
import IconButton from "material-ui/IconButton";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton"
import BlockieComponent from '../../components/BlockieComponent'
import browser from '../../lib/browser'
import {Dispatch} from "redux";
import actions from "../../actions";
import BoughtItem from "../../lib/BoughtItem";
import {List, ListItem} from "material-ui/List";

const TERMS_OF_USE_ADDRESS = 'https://literatepayments.com'

const APP_BAR_STYLE: CSSProperties = {
  minHeight: 56,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between'
};

const APP_BAR_CONTAINER_STYLE: CSSProperties = {
  backgroundColor: '#ffffff',
  minHeight: 56,
  boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
};

const APP_BAR_WRAP_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'row'
};

const APP_BAR_LEFT_STYLE: CSSProperties = {
  width: 72,
  height: 56,
  textAlign: 'center'
};

const APP_BAR_RIGHT_STYLE: CSSProperties = {
  width: 72,
  height: 56,
  textAlign: 'center'
};

const APP_BAR_TITLE_STYLE: CSSProperties = {
  fontFamily: ['Alegreya Sans', 'sans-serif'],
  fontWeight: 'normal',
  fontSize: 22,
  color: '#333333',
  height: 56,
  lineHeight: '58px',
  width: 176,
  textAlign: 'left'
}

const ICON_STYLE_RIGHT: CSSProperties = {
  lineHeight: '56px'
}

const SECOND_LINE_STYLE: CSSProperties = {
  marginTop: -5,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between'
}

const BLOCKIE_STYLE: CSSProperties = {
  margin: '0 10px 10px 10px',
  height: 50
}

const ACCOUNT_NAME_STYLE: CSSProperties = {
  fontFamily: ['Alegreya Sans', 'sans-serif'],
  fontWeight: 'normal',
  fontSize: 26,
  color: '#333333',
  width: 250,
  textAlign: 'left'
}

const ACCOUNT_DETAILS_ROW_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  fontFamily: ['Source Sans Pro', 'sans-serif'],
  fontSize: 14,
  marginTop: 5,
  alignItems: 'flex-start'
}

const FLAT_BUTTON_BLOCK_STYLE: CSSProperties = {
  paddingRight: 5
}

const FLAT_BUTTON_STYLE: CSSProperties = {
  minWidth: 'inherit',
  width: 'inherit',
  height: 'inherit',
  minHeight: 'inherit',
  lineHeight: 'inherit',
  padding: 5,
  margin: '-5px 0px -5px 0px'
}

const FLAT_BUTTON_LABEL_STYLE: CSSProperties = {
  paddingRight: 0,
  paddingLeft: 0,
  verticalAlign: 'inherit'
}

const BALANCE_STYLE: CSSProperties = {
  marginRight: 10
}

export interface WalletPageStateProps {
  wallet?: Wallet;
  web3?: Web3;
  bought?: any;
}

export interface WalletPageDispatchProps {
  onLock: Function
}

export type WalletPageProps = WalletPageStateProps & WalletPageDispatchProps;

export interface WalletPageState {
  address: string;
  balance: string;
  channels: Array<PaymentChannel>;
}

export class WalletPage extends React.Component<WalletPageProps, WalletPageState> {
  updateBalanceTimer: number;

  constructor (props: WalletPageProps) {
    super(props);
    if (!this.props.wallet) throw Error("Improbable error: props.wallet is not defined");
    this.state = {
      address: this.props.wallet.getAddressString(),
      balance: '-',
      channels: []
    };
    this.handleLock = this.handleLock.bind(this);
    this.handleRefill = this.handleRefill.bind(this);
  }

  renderBalance () {
    return <span>Balance: {this.state.balance.toString()}</span>
  }

  handleRefill () {
    browser.tabs.create({ active: true, url: TERMS_OF_USE_ADDRESS })
  }

  renderChannels () {
    return _.map(this.state.channels, paymentChannel => {
      return <p key={paymentChannel.channelId}><small>{paymentChannel.receiver}: {paymentChannel.value - paymentChannel.spent}</small></p>
    })
  }

  renderBoughtItems () {
    let items = _.map(this.props.bought, (item: BoughtItem)=> {
      if (item && item.media && item.title && item.date) {
        let title = <span>{item.title}<br/>{item.price}</span>
        return <ListItem primaryText={item.media} secondaryText={title} secondaryTextLines={2} key={item.date} />
      }
    })
    return <List style={{padding: 0}}>{items}</List>
  }

  renderOperations () {
    if (_.isEmpty(this.props.bought)) {
      let headingStyle: CSSProperties = {
        fontFamily: ['Alegreya Sans', 'sans-serif'],
        fontWeight: 400,
        fontSize: 26,
        color: '#333333',
        textAlign: 'center',
        margin: '25px 0 0 0'
      };
      let balloonContainerStyle = {
        width: '100%',
        textAlign: 'center',
      }
      let balloonStyle = {
        height: 100,
        align: 'center',
        marginTop: 5,
        marginBottom: 5
      }
      let motivationStyle = {
        textAlign: 'center',
        fontSize: '16px',
        fontFamily: ['Source Sans Pro', 'sans-serif'],
        width: 240,
        padding: '0 40px'
      }
      let BUTTON_CONTAINER_STYLE: CSSProperties= {
        textAlign: 'center',
        top: 325,
        width: 240,
        position: 'absolute',
        padding: '0 40px'
      }
      let buttonStyle = {
        boxShadow: null
      }
      const openExplorer = () => {
        browser.tabs.create({ active: true, url: 'https://literatepayments.com' })
      } // FIXME
      return <div>
        <h1 style={headingStyle}>You are ready</h1>
        <div style={balloonContainerStyle}>
          <p>Balloon style=balloonStyle</p>
        </div>
        <div style={motivationStyle}>
          We got something special<br />
          for you to start
        </div>
        <div style={BUTTON_CONTAINER_STYLE}>
          <RaisedButton label="EXPLORE" primary={true} style={buttonStyle} onTouchTap={openExplorer} />
        </div>
      </div>
    } else {
      return this.renderBoughtItems()
    }
  }

  handleLock () {
    this.props.onLock()
  }

  updateBalance () {
    if (this.props.web3) {
      let web3 = this.props.web3;
      web3.eth.getBalance(this.state.address, (error, balance) => {
        this.setState({
          balance: web3.fromWei(balance, "ether").toString()
        })
      })
    }
  }

  componentDidMount () {
    this.updateBalance();
    this.updateBalanceTimer = setInterval(() => {
      this.updateBalance()
    }, 500);
  }

  componentWillUnmount () {
    clearInterval(this.updateBalanceTimer);
  }

  render () {
    return <div style={{backgroundColor: '#fafafa', height: 420}}>
      <div style={APP_BAR_CONTAINER_STYLE}>
        <div style={APP_BAR_STYLE}>
          <div style={APP_BAR_WRAP_STYLE}>
            <div style={APP_BAR_LEFT_STYLE}>&nbsp;</div>
            <div style={APP_BAR_TITLE_STYLE}>Wallet</div>
          </div>
          <div style={APP_BAR_RIGHT_STYLE}>
            <IconButton iconClassName="material-icons" style={ICON_STYLE_RIGHT} iconStyle={{iconHoverColor: '#29ABE2'}} onTouchTap={this.handleLock}>
              lock
            </IconButton>
          </div>
        </div>
        <div style={SECOND_LINE_STYLE}>
          <BlockieComponent seed={this.state.address} scale={6.25} style={BLOCKIE_STYLE} />
          <div>
            <div className="account-name" style={ACCOUNT_NAME_STYLE}>
              Account 1
            </div>
            <div className="account-details-row" style={ACCOUNT_DETAILS_ROW_STYLE}>
              {this.renderBalance()}
              <div style={FLAT_BUTTON_BLOCK_STYLE}>
                <FlatButton label="Refill" primary={true} style={FLAT_BUTTON_STYLE} onTouchTap={this.handleRefill} labelStyle={FLAT_BUTTON_LABEL_STYLE} />
                {/*
                 <FlatButton label="Send" primary={true} style={FLAT_BUTTON_STYLE} onTouchTap={this.handleRefill} labelStyle={FLAT_BUTTON_LABEL_STYLE} />
                 */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{height: 309, overflow: 'scroll'}}>
        {this.renderOperations()}
      </div>
    </div>
  }
}

function mapStateToProps (state: State): WalletPageStateProps {
  return {
    wallet: state.runtime.wallet,
    web3: state.runtime.web3,
    bought: state.init.bought
  }
}

function mapDispatchToProps (dispatch: Dispatch<any>): WalletPageDispatchProps {
  return {
    onLock: () => {
      dispatch(actions.runtime.doLock(undefined))
    }
  }
}

export default connect<WalletPageStateProps, WalletPageDispatchProps, any>(mapStateToProps, mapDispatchToProps)(WalletPage)
