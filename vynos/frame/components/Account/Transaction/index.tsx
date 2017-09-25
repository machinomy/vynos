import * as React from "react";
import { Container, Grid, Menu, Header, List, Image } from 'semantic-ui-react'
const style = require("../../../styles/ynos.css");


const Transaction: React.SFC<any> = (props) => {
    return <div>
        <Menu className={style.clearBorder}>
            <Menu.Item link className={style.menuIntoOneItemFluid}><i className={style.vynosArrowBack}></i>Transaction</Menu.Item>
        </Menu>
        <Container>
            <List>
                <List.Item>
                    <Image avatar src={require('../../../styles/images/avatar.svg')} />
                    <List.Content>
                        <List.Header as='a'>9 July 2017, 10:33</List.Header>
                        <List.Description>10 hours ago, 2033 confirmations</List.Description>
                    </List.Content>
                </List.Item>
            </List>
            <p><span className={style.keyHighlight}>0x2345364DFJKL345JVLLKJ249432</span></p>
            <Grid columns='equal'>
                <Grid.Row>
                    <Grid.Column>
                        <Header sub>Amount</Header>
                        <span>1.0000 ETH</span>
                    </Grid.Column>
                    <Grid.Column>
                        <Header sub>Free paid</Header>
                        <span>1.0000 ETH</span>
                    </Grid.Column>
                    <Grid.Column>
                        <Header sub>Gas used</Header>
                        <span>1.0000 ETH</span>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <List>
                <List.Item>
                    <List.Header>From</List.Header>
                    <span className={style.keyHighlight}>0x2345364DFJKL345JVLLKJ249432</span>
                </List.Item>
                <List.Item>
                    <List.Header>To</List.Header>
                    <span className={style.keyHighlight}>0x2345364DFJKL345JVLLKJ249432</span>
                </List.Item>
                <List.Item>
                    <List.Header>Block</List.Header>
                    <span className={style.keyHighlight}>0x2345364DFJKL345JVLLKJ249432</span>
                </List.Item>
                <List.Item>
                    <List.Header>Gas price</List.Header>
                    <span>1.000 ETH</span>
                </List.Item>
                <List.Item>
                    <List.Header>Data</List.Header>
                    <span className={style.keyHighlight}>0x2345364DFJKL345JVLLKJ249432</span>
                </List.Item>
            </List>
        </Container>
    </div>
};


export default Transaction;