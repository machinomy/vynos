import * as React from "react";
import {List, Image, Button} from 'semantic-ui-react'
import Web3 = require("web3")
import Machinomy from 'machinomy'
import BlockieComponent from "../../BlockieComponent";
import ChannelMetaStorage from "../../../../lib/storage/ChannelMetaStorage";
import {connect} from 'react-redux'
import {FrameState} from "../../../redux/FrameState";
import {isUndefined} from "util";

const style = require("../../../styles/ynos.css");

export interface ChannelsSubpageProps {
  lastUpdateDb: number,
  web3: Web3
}

export interface ChannelsSubpageState {
  channels: any,
  activeChannel: string
}

export class ChannelsSubpage extends React.Component<ChannelsSubpageProps, ChannelsSubpageState> {
  channelMetaStorage: ChannelMetaStorage
  machinomy: Machinomy | null
  localLastUpdateDb: number

  constructor(props: ChannelsSubpageProps) {
    super(props)
    this.state = {
      channels: [],
      activeChannel: ''
    }
    this.channelMetaStorage = new ChannelMetaStorage()
    this.machinomy = null;
    this.localLastUpdateDb = props.lastUpdateDb;
  }

  getMachinomy() {
    return new Promise((resolve, reject) => {
      if (this.machinomy !== null) {
        resolve(this.machinomy);
      } else {
        let web3 = this.props.web3
        web3.eth.getAccounts((err, accounts) => {
          this.machinomy = new Machinomy(accounts[0], web3, {engine: 'nedb', databaseFile: 'vynos'});
          resolve(this.machinomy);
        });
      }
    });
  }

  componentDidMount() {
    this.updateListChannels({})
  }

  shouldComponentUpdate (nextProps: ChannelsSubpageProps) {
    if(this.localLastUpdateDb < nextProps.lastUpdateDb){
      this.localLastUpdateDb = nextProps.lastUpdateDb;
      this.updateListChannels({});
      return false;
    }
    return true;
  }

  closeChannelId(channel: any) {
    this.getMachinomy().then((machinomy: Machinomy) => {
      machinomy.close(channel.channelId).then(() => {
        this.channelMetaStorage.setClosingTime(channel.channelId, Date.now()).then(() => {
          let change: any = {};
          change[channel.channelId] = {
            state: channel.state === 0 ? 1 : 2
          };
          this.setActiveChannel(channel.channelId);
          this.updateListChannels(change);
        });
      });
    });
  }

  updateListChannels(change: any) {
    this.getMachinomy().then((machinomy: Machinomy) => {
      machinomy.channels().then(channels => {
        let balanceByChannelId: any = {};
        let stateByChannelId: any = {};
        let channelIds = channels.map((channel: any) => {
          balanceByChannelId[channel.channelId.toString()] = channel.value - channel.spent;
          stateByChannelId[channel.channelId.toString()] = channel.state;
          return channel.channelId.toString()
        });
        this.channelMetaStorage.findByIds(channelIds).then((metaChannels: any) => {
          metaChannels.map((channel: any) => {
            if (!isUndefined(balanceByChannelId[channel.channelId])) channel.balance = balanceByChannelId[channel.channelId];
            if (!isUndefined(stateByChannelId[channel.channelId])) channel.state = stateByChannelId[channel.channelId];
            if (change[channel.channelId]) {
              for (let key in change[channel.channelId]) {
                channel[key] = change[channel.channelId][key];
              }
            }
            channel.canClose = true; // FIXME
            return channel;
          });
          this.setState({
            channels: metaChannels
          })
        })
      });
    });
  }

  getIcon(channel: any) {
    if (channel.icon) {
      return <Image avatar src={channel.icon} size="mini"/>
    } else {
      return <BlockieComponent classDiv={"ui mini avatar image"} classCanvas={"ui mini avatar image"} size={35}
                               scale={2} seed={channel.host}/>
    }
  }

  setActiveChannel(channelId: string) {
    let activeChannel = channelId === this.state.activeChannel ? '' : channelId;
    this.setState({activeChannel: activeChannel});
  }

  render() {
    let className = style.listWrap + ' ' + style.scrollbarContainer;
    return <List className={className} divided verticalAlign='middle' style={{margin: 0}}>
      {this.state.channels.map((channel: any) => {
        let isActiveChannel = (channel.channelId === this.state.activeChannel && channel.state === 0);
        let itemId = isActiveChannel ? style.activeChannel : (channel.state === 1 ? style.closedChannel : '');
        let styleItem = (channel.state === 1 || isActiveChannel) ? {} : {cursor: "pointer"};
        let clickItem = !isActiveChannel ? this.setActiveChannel.bind(this, channel.channelId) : null;
        let styleHeader = channel.state === 0 ? {cursor: 'pointer'} : {};
        let clickHeader = isActiveChannel ? this.setActiveChannel.bind(this, channel.channelId) : null;

        return (channel.state <= 1) &&
          <List.Item style={styleItem}
                     className={style.listItem}
                     id={itemId}
                     key={channel.channelId}
                     onClick={clickItem}>
            <List.Content floated='right'>
              <span className={style.channelBalance}>{channel.balance}</span>
            </List.Content>
            {this.getIcon(channel)}
            <List.Content className={style.listContent}>
              <List.Header className={style.listHeader} style={styleHeader}
                           onClick={clickHeader}>
                {channel.title}
              </List.Header>
              <List.Description className={style.listDesc}>{channel.desc}</List.Description>
              <List.Description id={((isActiveChannel || (channel.state === 1 && channel.canClose)) ? style.buttonsActiveChannel : '')}
                                style={{display: 'none'}}>
                <a onClick={this.closeChannelId.bind(this, channel)}>CLOSE</a>
              </List.Description>
            </List.Content>
          </List.Item>
      })}
    </List>
  };
}

function mapStateToProps(state: FrameState): ChannelsSubpageProps {
  return {
    lastUpdateDb: state.shared.lastUpdateDb,
    web3: state.temp.workerProxy.web3
  }
}

export default connect(mapStateToProps)(ChannelsSubpage)
