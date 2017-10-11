import * as React from "react";
import {Container, Grid, List, Image, Header, Button, Divider} from 'semantic-ui-react'
import Scrollbars from "react-custom-scrollbars"
import Web3 = require("web3")
import Machinomy from 'machinomy'
import * as storage from 'machinomy/lib/storage'
import BlockieComponent from "../../BlockieComponent";

const style = require("../../../styles/ynos.css");

export interface Props {
}

export interface State {
  channels: any
}

export default class Channels extends React.Component<Props, State> {
  public assocBalanceByChannelId: any

  constructor() {
    super();
    this.state = {channels: []};
    this.assocBalanceByChannelId = {};
  }

  componentDidMount() {
    let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
    web3.eth.getAccounts((err, accounts) => {
      if (!accounts || !accounts[0]) return;
      let machinomy = new Machinomy(accounts[0], web3, {engine: 'nedb', databaseFile: 'vynos'})
      machinomy.channels().then(channels => {
        var arrChannelsIds = channels.map((channel: any) => {
          this.assocBalanceByChannelId[channel.channelId.toString()] = channel.value - channel.spent;
          return channel.channelId.toString()
        });
        let s = storage.build(web3, 'vynos', 'sender', false, 'nedb');
        s.channelMeta.findByIds(arrChannelsIds).then((metaChannels: any) => {
          console.log(metaChannels);
          this.setState({channels: metaChannels})
        })
      });
    });
  }

  render() {
    return <div className={style.wrap}>
      <Scrollbars
        renderTrackHorizontal={props => <div {...props} />}
        renderView={props => <div {...props} className={style.scrollbarView}/>}
        style={{'width': '100%', 'height': '375px'}}>
        <div className={style.scrollbarContainer}>
          <List className={style.listWrap} divided verticalAlign='middle'>
            {this.state.channels.map((channel: any) =>
              <List.Item className={style.listItem} key={channel.channelId}>
                <List.Content floated='right'>
                  <span className={style.channelBalance}>{this.assocBalanceByChannelId[channel.channelId]}</span>
                </List.Content>
                {channel.icon && <Image avatar src={channel.icon} size="mini"/> ||
                <BlockieComponent classDiv={"ui mini avatar image"} classCanvas={"ui mini avatar image"} size={35} scale={2} seed={channel.host}/>}
                <List.Content className={style.listContent}>
                  <List.Header as='a' className={style.listHeader}>{channel.title}
                  </List.Header>
                  <List.Description className={style.listDesc}>{channel.desc}</List.Description>
                </List.Content>
              </List.Item>
            )}
          </List>
        </div>
      </Scrollbars>
    </div>
  };
}
