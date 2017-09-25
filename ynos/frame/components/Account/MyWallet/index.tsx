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
import {AppFrameState} from "../../../reducers/state";
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
}

export interface WalletPageState {
    address: string|null;
    balance: string;
    channels: Array<PaymentChannel>;
}

export class MyWallet extends React.Component<any, any> {
    updateBalanceTimer: any;

    constructor (props: any) {
        super(props);
        
        console.log(this.props);
        console.log('-----------------------------------------');
    }

    render () {
        const {dispatch, welcomePopup} = this.props;
        return <div>
            <List className={style.accountInfo}>
                <List.Item>
                    <Image src={require('../../../styles/images/avatar.svg')} className={style.accountAvatar} />
                    <List.Content>
                        <List.Header as='a' className={style.walletAddress}>0x453535375735353</List.Header>
                        <List.Description>
                            <span className={style.ethBalance}>1.345</span>
                            <span className={style.ethBalance}>1.345</span>
                            <span className={style.balance}>$125.34</span></List.Description>
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
                    <Button primary content="Explore" className={style.buttonNav}
                        onClick={() => dispatch({type:"SET_WELCOME_POPUP_STATE", className: ""})}
                     />
                </Container>
            </div>
        </div>
    }
}

function mapStateToProps (state: any): any {
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