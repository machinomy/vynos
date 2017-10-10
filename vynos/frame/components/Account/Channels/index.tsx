import * as React from "react";
import {Container, Grid, List, Image, Header, Button, Divider} from 'semantic-ui-react'
import Scrollbars from "react-custom-scrollbars"
import Web3 = require("web3")
import Machinomy from 'machinomy'

const style = require("../../../styles/ynos.css");

export interface Props {
}

export interface State {
  channels: any
}

export default class Channels extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {channels: []};
  }

  componentDidMount() {
    let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
    web3.eth.getAccounts((err, accounts) => {
      if(!accounts || !accounts[0]) return;
      let machinomy = new Machinomy(accounts[0], web3, { engine: 'nedb', databaseFile: 'vynos' })
      machinomy.channels().then(channels => {
        this.setState({channels: channels})
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
                  <span className={style.channelBalance}>{channel.value - channel.spent}</span>
                </List.Content>
                <Image avatar src={"//localhost:3000/favicon.ico"} size="mini"/>
                <List.Content className={style.listContent}>
                  <List.Header as='a' className={style.listHeader}>{channel.channelId}
                    {/*<span className={style.lifetimeDate}>10 July {c.test[0]}</span>*/}
                  </List.Header>
                  <List.Description className={style.listDesc}>In Stevens Point, <br/> Wisconsin, the
                    questions</List.Description>
                </List.Content>
              </List.Item>
            )}
          </List>
        </div>
      </Scrollbars>
    </div>
  };
}
