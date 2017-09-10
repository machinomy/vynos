import * as React from "react";
import {connect} from "react-redux";
import Wallet = require("ethereumjs-wallet")
import Web3 = require("web3")
import _ = require("lodash")
import {CSSProperties} from "react";
import BlockieComponent from '../../../components/BlockieComponent'
import browser from '../../../lib/browser'
import BoughtItem from "../../../lib/BoughtItem";
import {AppFrameState} from "../../../reducers/state";
import WorkerProxy from "../../../WorkerProxy";
import {PaymentChannel} from "machinomy/lib/channel";
import { Container, Grid, List, Image, Header, Button, Divider} from 'semantic-ui-react'


const style = require("../../../styles/ynos.css");

const TERMS_OF_USE_ADDRESS = 'https://literatepayments.com'


export interface WalletPageProps {
    workerProxy: WorkerProxy
    wallet?: Wallet;
    web3?: Web3;
    bought?: any;
}

export interface WalletPageState {
    address: string|null;
    balance: string;
    channels: Array<PaymentChannel>;
}

export class MyWallet extends React.Component<WalletPageProps, WalletPageState> {
    updateBalanceTimer: any;

    constructor (props: WalletPageProps) {
        super(props);
        // if (!this.props.wallet) throw Error("Improbable error: props.wallet is not defined");
        this.state = {
            address: null,
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
                return <li key={item.date}>{item.media}-{title}</li>
            }
        })
        return <ul style={{padding: 0}}>{items}</ul>
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
                window.open('https://literatepayments.com', '_blank')
            } // FIXME
            return <div>
                <h1 style={headingStyle}>You are ready</h1>
                <div style={balloonContainerStyle}>
                </div>
                <div style={motivationStyle}>
                    We got something special<br />
                    for you to start
                </div>
                <div style={BUTTON_CONTAINER_STYLE}>
                    <Button raised onClick={openExplorer} content="Explore" />
                </div>
            </div>
        } else {
            return this.renderBoughtItems()
        }
    }

    handleLock () {
        this.props.workerProxy.doLock().then()
    }

    updateBalance () {
        if (this.props.web3 && this.state.address) {
            let web3 = this.props.web3;
            web3.eth.getBalance(this.state.address, (error, balance) => {
                this.setState({
                    balance: web3.fromWei(balance, "ether").toString()
                })
            })
        }
    }

    updateAddress () {
        if (this.props.web3) {
            let web3 = this.props.web3
            web3.eth.getAccounts((error, accounts) => {
                let address = accounts[0]
                this.setState({
                    address: address
                })
            })
        }
    }

    componentDidMount () {
        this.updateBalance();
        this.updateAddress();
        this.updateBalanceTimer = setInterval(() => {
            this.updateBalance()
        }, 500);
    }

    componentWillUnmount () {
        clearInterval(this.updateBalanceTimer);
    }

    renderPage (address: any) {
        return <Container textAlign="center" className={`${style.flexContainer} ${style.clearBorder}`} >
            {/*<List className={style.welcomeAccountInfo}>
                <List.Item>
                    <Image avatar src={require('../../../styles/images/avatar.svg')} />
                    <List.Content>
                        <List.Header as='a'>0x453535375735353</List.Header>
                        <List.Description>1.345 $125.34</List.Description>
                    </List.Content>
                </List.Item>
            </List>*/}
            <Header as='h1' className={style.welcomeHeader}>You are ready</Header>
            <Image src={require('../../../styles/images/welcome.svg')} size="tiny" centered />
            <p>
                We got something <br />
                special for you to start
            </p>
            <Button primary content="Explore" className={style.buttonNav} />
        </Container>
    }

    render () {
        if (this.state.address) {
            return this.renderPage(this.state.address)
        } else {
            return this.renderPage(this.state.address)
        }
    }
}

function mapStateToProps (state: AppFrameState): WalletPageProps {
    let workerProxy = state.temp.workerProxy!
    return {
        workerProxy: workerProxy,
        wallet: undefined, // FIXME state.runtime.wallet,
        web3: workerProxy.getWeb3(), // FIXME state.runtime.web3,
        bought: undefined // state.init.bought
    }
}

export default connect<WalletPageProps, undefined, any>(mapStateToProps)(MyWallet)
