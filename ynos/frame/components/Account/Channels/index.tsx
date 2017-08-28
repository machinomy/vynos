import * as React from "react";
import { List, Image } from 'semantic-ui-react'

export interface ChannelsProps { }

const Channels: React.SFC<ChannelsProps> = (props) => {
    return <List divided>
        <List.Item>
            <List.Content floated='right'>
                <span>0.2123</span><br />
                <span>0.223</span>
            </List.Content>
            <Image avatar src={require('../../../styles/images/service.png')} size="mini" />
            <List.Content>
                <List.Header as='a'>The Outline</List.Header>
                <List.Description>10 July - 12 Sep.</List.Description>
            </List.Content>
        </List.Item>
        <List.Item>
            <List.Content floated='right'>
                <span>0.2123</span><br />
                <span>0.223</span>
            </List.Content>
            <Image avatar src={require('../../../styles/images/service.png')} size="mini" />
            <List.Content>
                <List.Header as='a'>Enterpreneur</List.Header>
                <List.Description>8 July - 10 Sep.</List.Description>
            </List.Content>
        </List.Item>
        <List.Item>
            <List.Content floated='right'>
                <span>0.2123</span><br />
                <span>0.223</span>
            </List.Content>
            <Image avatar src={require('../../../styles/images/service.png')} size="mini" />
            <List.Content>
                <List.Header as='a'>The Economist</List.Header>
                <List.Description>11 May - 12 Oct.</List.Description>
            </List.Content>
        </List.Item>
    </List>
};

export default Channels;