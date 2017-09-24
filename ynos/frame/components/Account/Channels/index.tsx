import * as React from "react";
import { Container, Grid, List, Image, Header, Button, Divider} from 'semantic-ui-react'
import Scrollbars from "react-custom-scrollbars"

const style = require("../../../styles/ynos.css");

export interface ChannelsProps { }

const Channels: React.SFC<ChannelsProps> = (props) => {
    return <div className={style.wrap}>
    <Scrollbars
            renderTrackHorizontal={props => <div {...props} />}
            renderView={props => <div {...props} className={style.scrollbarView}/>}
            style={{ 'width': '100%', 'height': '375px' }}>
        <div className={style.scrollbarContainer}>
            <List className={style.listWrap} divided verticalAlign='middle'>
                <List.Item className={style.listItem}>
                    <List.Content floated='right'>
                        <span className={style.channelBalance}>0.0030</span>
                    </List.Content>
                    <Image avatar src={"/" + require('../../../styles/images/service.png')} size="mini" />
                    <List.Content className={style.listContent}>
                        <List.Header as='a' className={style.listHeader}>The Outline <span className={style.lifetimeDate}>10 July</span></List.Header>
                        <List.Description className={style.listDesc}>In Stevens Point, <br/> Wisconsin, the questions</List.Description>
                    </List.Content>
                </List.Item>
                <List.Item className={style.listItem}>
                    <List.Content floated='right'>
                        <span className={style.channelBalance}>0.0030</span>
                    </List.Content>
                    <Image avatar src={"/" + require('../../../styles/images/service.png')} size="mini" />
                    <List.Content className={style.listContent}>
                        <List.Header as='a' className={style.listHeader}>The Outline <span className={style.lifetimeDate}>10 July</span></List.Header>
                        <List.Description className={style.listDesc}>In Stevens Point, <br/> Wisconsin, the questions</List.Description>
                    </List.Content>
                </List.Item>
                <List.Item className={style.listItem}>
                    <List.Content floated='right'>
                        <span className={style.channelBalance}>0.0030</span>
                    </List.Content>
                    <Image avatar src={"/" + require('../../../styles/images/service.png')} size="mini" />
                    <List.Content className={style.listContent}>
                        <List.Header as='a' className={style.listHeader}>The Outline <span className={style.lifetimeDate}>10 July</span></List.Header>
                        <List.Description className={style.listDesc}>In Stevens Point, <br/> Wisconsin, the questions</List.Description>
                    </List.Content>
                </List.Item>
                <List.Item className={style.listItem}>
                    <List.Content floated='right'>
                        <span className={style.channelBalance}>0.0030</span>
                    </List.Content>
                    <Image avatar src={"/" + require('../../../styles/images/service.png')} size="mini" />
                    <List.Content className={style.listContent}>
                        <List.Header as='a' className={style.listHeader}>The Outline <span className={style.lifetimeDate}>10 July</span></List.Header>
                        <List.Description className={style.listDesc}>In Stevens Point, <br/> Wisconsin, the questions</List.Description>
                    </List.Content>
                </List.Item>
                <List.Item className={style.listItem}>
                    <List.Content floated='right'>
                        <span className={style.channelBalance}>0.0030</span>
                    </List.Content>
                    <Image avatar src={"/" + require('../../../styles/images/service.png')} size="mini" />
                    <List.Content className={style.listContent}>
                        <List.Header as='a' className={style.listHeader}>The Outline <span className={style.lifetimeDate}>10 July</span></List.Header>
                        <List.Description className={style.listDesc}>In Stevens Point, <br/> Wisconsin, the questions</List.Description>
                    </List.Content>
                </List.Item>
                <List.Item className={style.listItem}>
                    <List.Content floated='right'>
                        <span className={style.channelBalance}>0.0030</span>
                    </List.Content>
                    <Image avatar src={"/" + require('../../../styles/images/service.png')} size="mini" />
                    <List.Content className={style.listContent}>
                        <List.Header as='a' className={style.listHeader}>The Outline <span className={style.lifetimeDate}>10 July</span></List.Header>
                        <List.Description className={style.listDesc}>In Stevens Point, <br/> Wisconsin, the questions</List.Description>
                    </List.Content>
                </List.Item>
                <List.Item className={style.listItem}>
                    <List.Content floated='right'>
                        <span className={style.channelBalance}>0.0030</span>
                    </List.Content>
                    <Image avatar src={"/" + require('../../../styles/images/service.png')} size="mini" />
                    <List.Content className={style.listContent}>
                        <List.Header as='a' className={style.listHeader}>The Outline <span className={style.lifetimeDate}>10 July</span></List.Header>
                        <List.Description className={style.listDesc}>In Stevens Point, <br/> Wisconsin, the questions</List.Description>
                    </List.Content>
                </List.Item>
                <List.Item className={style.listItem}>
                    <List.Content floated='right'>
                        <span className={style.channelBalance}>0.0030</span>
                    </List.Content>
                    <Image avatar src={"/" + require('../../../styles/images/service.png')} size="mini" />
                    <List.Content className={style.listContent}>
                        <List.Header as='a' className={style.listHeader}>The Outline <span className={style.lifetimeDate}>10 July</span></List.Header>
                        <List.Description className={style.listDesc}>In Stevens Point, <br/> Wisconsin, the questions</List.Description>
                    </List.Content>
                </List.Item>
            </List>
        </div>
    </Scrollbars>
</div>
};

export default Channels;