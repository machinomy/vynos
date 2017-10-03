import * as React from "react";
import {connect} from "react-redux";
import Wallet from "ethereumjs-wallet";
import Web3 = require("web3")
import _ = require("lodash")
import {CSSProperties} from "react";
import BlockieComponent from '../../../components/BlockieComponent'
import browser from '../../../lib/browser'
import {Dispatch} from "redux";
import actions from "../../../actions";
import BoughtItem from "../../../lib/BoughtItem";
import {FrameState} from "../../../state/FrameState";
import WorkerProxy from "../../../WorkerProxy";
import {PaymentChannel} from "machinomy/lib/channel";

import { Container, Grid, List, Image, Header, Button, Divider} from 'semantic-ui-react'
import Scrollbars from "react-custom-scrollbars"

const style = require("../../../styles/ynos.css");


export interface WalletPageProps {
    workerProxy: WorkerProxy
    wallet?: Wallet;
    web3?: Web3;
    bought?: any;
    welcomePopup: string
}

export interface WalletPageState {
    address: string|null;
    balance: string;
}

export class MyWallet extends React.Component<WalletPageProps, WalletPageState> {
    updateBalanceTimer: any;

    constructor (props: any) {
        super(props);
        this.state = {
          address: null,
          balance: '0'
        }
        console.log(this.props);
        console.log('-----------------------------------------');
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
        const {welcomePopup} = this.props;
        return <div>
            <List className={style.accountInfo}>
                <List.Item>
                    <Image src={require('../../../styles/images/avatar.svg')} className={style.accountAvatar} />
                    <List.Content>
                        <List.Header as='a' className={style.walletAddress}>{this.state.address}</List.Header>
                        <List.Description>
                            <span className={style.ethBalance}>{this.state.balance}</span>
                        </List.Description>
                    </List.Content>
                </List.Item>
            </List>
            <div className={style.wrap}>
                <Scrollbars
                        renderTrackHorizontal={props => <div {...props} />}
                        renderView={props => <div {...props} className={style.scrollbarView}/>}
                        style={{ 'width': '100%', 'height': '305px' }}>
                    <div className={style.scrollbarContainer}>
                        <List className={style.listWrap} divided verticalAlign='middle'>
                            <List.Item className={style.listItem}>
                                <List.Content floated='right'>
                                    <span className={style.channelBalance}>0.0030</span>
                                </List.Content>
                                <Image avatar src={require('../../../styles/images/service.png')} size="mini" />
                                <List.Content className={style.listContent}>
                                    <List.Header as='a' className={style.listHeader}>The Outline <span className={style.lifetimeDate}>10 July</span></List.Header>
                                    <List.Description className={style.listDesc}>In Stevens Point, <br/> Wisconsin, the questions</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item className={style.listItem}>
                                <List.Content floated='right'>
                                    <span className={style.channelBalance}>0.0030</span>
                                </List.Content>
                                <Image avatar src={require('../../../styles/images/service.png')} size="mini" />
                                <List.Content className={style.listContent}>
                                    <List.Header as='a' className={style.listHeader}>The Outline <span className={style.lifetimeDate}>10 July</span></List.Header>
                                    <List.Description className={style.listDesc}>In Stevens Point, <br/> Wisconsin, the questions</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item className={style.listItem}>
                                <List.Content floated='right'>
                                    <span className={style.channelBalance}>0.0030</span>
                                </List.Content>
                                <Image avatar src={require('../../../styles/images/service.png')} size="mini" />
                                <List.Content className={style.listContent}>
                                    <List.Header as='a' className={style.listHeader}>The Outline <span className={style.lifetimeDate}>10 July</span></List.Header>
                                    <List.Description className={style.listDesc}>In Stevens Point, <br/> Wisconsin, the questions</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item className={style.listItem}>
                                <List.Content floated='right'>
                                    <span className={style.channelBalance}>0.0030</span>
                                </List.Content>
                                <Image avatar src={require('../../../styles/images/service.png')} size="mini" />
                                <List.Content className={style.listContent}>
                                    <List.Header as='a' className={style.listHeader}>The Outline <span className={style.lifetimeDate}>10 July</span></List.Header>
                                    <List.Description className={style.listDesc}>In Stevens Point, <br/> Wisconsin, the questions</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item className={style.listItem}>
                                <List.Content floated='right'>
                                    <span className={style.channelBalance}>0.0030</span>
                                </List.Content>
                                <Image avatar src={require('../../../styles/images/service.png')} size="mini" />
                                <List.Content className={style.listContent}>
                                    <List.Header as='a' className={style.listHeader}>The Outline <span className={style.lifetimeDate}>10 July</span></List.Header>
                                    <List.Description className={style.listDesc}>In Stevens Point, <br/> Wisconsin, the questions</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item className={style.listItem}>
                                <List.Content floated='right'>
                                    <span className={style.channelBalance}>0.0030</span>
                                </List.Content>
                                <Image avatar src={require('../../../styles/images/service.png')} size="mini" />
                                <List.Content className={style.listContent}>
                                    <List.Header as='a' className={style.listHeader}>The Outline <span className={style.lifetimeDate}>10 July</span></List.Header>
                                    <List.Description className={style.listDesc}>In Stevens Point, <br/> Wisconsin, the questions</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item className={style.listItem}>
                                <List.Content floated='right'>
                                    <span className={style.channelBalance}>0.0030</span>
                                </List.Content>
                                <Image avatar src={require('../../../styles/images/service.png')} size="mini" />
                                <List.Content className={style.listContent}>
                                    <List.Header as='a' className={style.listHeader}>The Outline <span className={style.lifetimeDate}>10 July</span></List.Header>
                                    <List.Description className={style.listDesc}>In Stevens Point, <br/> Wisconsin, the questions</List.Description>
                                </List.Content>
                            </List.Item>
                            <List.Item className={style.listItem}>
                                <List.Content floated='right'>
                                    <span className={style.channelBalance}>0.0030</span>
                                </List.Content>
                                <Image avatar src={require('../../../styles/images/service.png')} size="mini" />
                                <List.Content className={style.listContent}>
                                    <List.Header as='a' className={style.listHeader}>The Outline <span className={style.lifetimeDate}>10 July</span></List.Header>
                                    <List.Description className={style.listDesc}>In Stevens Point, <br/> Wisconsin, the questions</List.Description>
                                </List.Content>
                            </List.Item>
                        </List>
                    </div>
                </Scrollbars>
                <Container textAlign="center" id={style.welcome} className={`${style.clearBorder} ${welcomePopup ? style[welcomePopup] : ''}`} >
                    <Header as='h1' className={style.welcomeHeader}>You are ready</Header>
                    <br/>
                    <Image src={require('../../../styles/images/welcome.svg')} size="tiny" centered />
                    <p>
                        We got something <br />
                        special for you to start
                    </p>
                    <Button primary content="Explore" className={style.buttonNav}/>
                </Container>
            </div>
        </div>
    }
}

function mapStateToProps (state: any): WalletPageProps {
    let workerProxy = state.temp.workerProxy!
    return {
        workerProxy: workerProxy,
        wallet: undefined, // FIXME state.runtime.wallet,
        web3: workerProxy.getWeb3(), // FIXME state.runtime.web3,
        bought: undefined, // state.init.bought
        welcomePopup: state.welcomePopup.welcomePopupState
    }
}

export default connect<any, undefined, any>(mapStateToProps)(MyWallet)
