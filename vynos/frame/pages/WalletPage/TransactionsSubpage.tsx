import * as React from 'react'
import TransactionStorage from '../../../lib/TransactionStorage'
import Transaction from "../../../lib/Transaction";
import { Container, Grid, List, Image, Header, Button, Divider} from 'semantic-ui-react'
import Scrollbars from "react-custom-scrollbars"

const style = require('../../styles/ynos.css')

export interface TransactionsSubpageProps {}

export interface TransactionsSubpageState {
  transactions: Array<Transaction>
}

export default class TransactionsSubpage extends React.Component<TransactionsSubpageProps, any> {
  transactionStorage: TransactionStorage

  constructor(props: TransactionsSubpageProps) {
    super(props)
    this.state = {
      transactions: []
    }
    this.transactionStorage = new TransactionStorage()
  }

  componentDidMount () {
    this.transactionStorage.all().then(transactions => {
      this.setState({
        transactions: transactions
      })
    })
  }

  renderTransaction (transaction: Transaction) {
    let iconSrc = require('../../styles/images/service.png')
    let icon = <Image avatar src={iconSrc} size="mini" />
    let amount = transaction.amount
    let date = transaction.time

    return <List.Item className={style.listItem} key={transaction.id}>
      <List.Content floated='right'>
        <span className={style.channelBalance}>{amount}</span>
      </List.Content>
      {icon}
      <List.Content className={style.listContent}>
        <List.Header className={style.listHeader}>{transaction.title} <span className={style.lifetimeDate}>{date}</span></List.Header>
        <List.Description className={style.listDesc}>{transaction.description}</List.Description>
      </List.Content>
    </List.Item>
  }

  render () {
    let rows = this.state.transactions.map((t: Transaction) => this.renderTransaction(t))

    return <Scrollbars
      renderTrackHorizontal={props => <div {...props} />}
      renderView={props => <div {...props} className={style.scrollbarView}/>}>
      <div className={style.scrollbarContainer}>
        <List className={style.listWrap} divided verticalAlign='middle'>
          {rows}
        </List>
      </div>
    </Scrollbars>
  }
}
