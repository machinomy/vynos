import * as React from 'react'
import TransactionStorage from '../../../lib/storage/TransactionMetaStorage'
import Transaction from "../../../lib/TransactionMeta";
import {List, Image} from 'semantic-ui-react'
import {formatAmount, formatDate} from "../../../lib/formatting";
import BlockieComponent from "../../components/BlockieComponent";
import {connect} from 'react-redux';
import {FrameState} from "../../redux/FrameState";

const style = require('../../styles/ynos.css')

export interface TransactionsSubpageProps {
  lastUpdateDb: number
}

export interface TransactionsSubpageState {
  transactions: Array<Transaction>
}

export class TransactionsSubpage extends React.Component<TransactionsSubpageProps, TransactionsSubpageState> {
  transactionStorage: TransactionStorage
  localLastUpdateDb: number

  constructor(props: TransactionsSubpageProps) {
    super(props)
    this.state = {
      transactions: []
    }
    this.localLastUpdateDb = props.lastUpdateDb;
    this.transactionStorage = new TransactionStorage()
  }

  componentDidMount () {
    this.updateTransactions();
  }

  updateTransactions (){
    this.transactionStorage.all().then(transactions => {
      this.setState({
        transactions: transactions.reverse()
      })
    })
  }

  shouldComponentUpdate (nextProps: TransactionsSubpageProps) {
    if(this.localLastUpdateDb < nextProps.lastUpdateDb){
      this.localLastUpdateDb = nextProps.lastUpdateDb;
      this.updateTransactions();
      return false;
    }
    return true;
  }

  transactionIcon (transaction: Transaction) {
    if (transaction.icon) {
      return <div className={"ui mini image " + style.listItemAvatar}><Image src={transaction.icon} size="mini" /></div>
    } else {
      return <BlockieComponent classDiv={"ui mini avatar image " + style.listItemAvatar} classCanvas={"ui mini avatar image"} size={35} scale={2} seed={transaction.id} />
    }
  }

  renderTransaction (transaction: Transaction) {
    let icon = this.transactionIcon(transaction)
    let { value, denomination } = formatAmount(transaction.amount)
    let date = formatDate(transaction.time)

    return <List.Item className={style.listItem} key={transaction.id}>
      <List.Content floated='right'>
        <span className={style.channelBalance}>{value} {denomination}</span>
      </List.Content>
      {icon}
      <List.Content className={style.listContent}>
        <List.Header className={style.listHeader}>{transaction.title} <span className={style.lifetimeDate}>{date}</span></List.Header>
        <List.Description className={style.listDesc}>{transaction.description}({transaction.state})</List.Description>
      </List.Content>
    </List.Item>
  }

  render () {
    let rows = this.state.transactions.map((t: Transaction) => this.renderTransaction(t))
    let className = style.listWrap + ' ' + style.scrollbarContainer

    if (rows.length) {
      return <List className={className} divided verticalAlign='middle'>
        {rows}
      </List>
    } else {
      return <p></p>
    }
  }
}

function mapStateToProps(state: FrameState): TransactionsSubpageProps {
  return {
    lastUpdateDb: state.shared.lastUpdateDb
  }
}

export default connect(mapStateToProps)(TransactionsSubpage)
