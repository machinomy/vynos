import * as React from 'react'
import TransactionStorage from '../../../lib/storage/TransactionMetaStorage'
import Transaction from "../../../lib/TransactionMeta";
import TransactionState from "../../../lib/TransactionState"
import TransactionKind from "../../../lib/TransactionKind"
import { List, Image } from 'semantic-ui-react'
import { formatAmount, formatDate } from "../../../lib/formatting";
import BlockieComponent from "../../components/BlockieComponent";
import { connect } from 'react-redux';
import { FrameState } from "../../redux/FrameState";

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
  _isMounted: boolean

  constructor (props: TransactionsSubpageProps) {
    super(props)
    this.state = {
      transactions: []
    }
    this.localLastUpdateDb = props.lastUpdateDb;
    this.transactionStorage = new TransactionStorage()
    this._isMounted = false
  }

  componentDidMount () {
    this._isMounted = true
    this.updateTransactions();
  }

  updateTransactions () {
    this.transactionStorage.all().then(transactions => {
      if (this._isMounted) {
        this.setState({
          transactions: transactions.reverse()
        })
      }
    })
  }

  shouldComponentUpdate (nextProps: TransactionsSubpageProps) {
    if (this.localLastUpdateDb < nextProps.lastUpdateDb) {
      this.localLastUpdateDb = nextProps.lastUpdateDb;
      this.updateTransactions();
      return false;
    }
    return true;
  }

  transactionIcon (transaction: Transaction) {
    let kind = transaction.kind
    let state = transaction.state
    let imageSrc = '/frame/styles/images/' + kind.toLowerCase() + '-' + state.toLowerCase() + '.png'
    return <div className={"ui mini image " + style.listItemAvatar}><Image src={imageSrc} size="mini"/></div>
  }

  transactionDescription (transaction: Transaction) {
    let description
    if (transaction.kind == TransactionKind.MICROPAYMENT) {
      description = transaction.description
    } else if (transaction.kind == TransactionKind.ETHEREUM && transaction.to) {
      description = 'Send to ' + transaction.to.slice(0, 8) + '..' + transaction.to.slice(-2)
    } else if (transaction.kind == TransactionKind.SIGN && transaction.data) {
      description = transaction.data.slice(0, 8) + '..' + transaction.data.slice(-2)
    } else if (transaction.kind == TransactionKind.CLOSE_CHANNEL && transaction.description) {
      let parsedDescription = JSON.parse(transaction.description)
      description = parsedDescription.channelId.slice(0, 8) + '..' + parsedDescription.channelId.slice(-2)
    } else if (transaction.kind == TransactionKind.OPEN_CHANNEL) {
      if (transaction.description !== undefined) {
        let parsedDescription = JSON.parse(transaction.description)
        if (parsedDescription.channelId !== undefined) {
          description = parsedDescription.channelId.slice(0, 8) + '..' + parsedDescription.channelId.slice(-2)
        }
      }
    }
    return description
  }

  renderTransaction (transaction: Transaction) {
    let icon = this.transactionIcon(transaction)
    let { value, denomination } = formatAmount(transaction.amount)
    let date = formatDate(transaction.time)
    let styleListItem = style.listItem
    let transactiontTitle = null
    if (transaction.state === TransactionState.REJECTED || transaction.state === TransactionState.VIEWED) {
      styleListItem += ' ' + style.rejectedItem
      transactiontTitle = 'Transaction was rejected by user'
    }
    let fee = formatAmount(transaction.fee ? transaction.fee : 0)

    return <List.Item className={styleListItem} key={transaction.id} title={transactiontTitle}>
      <List.Content floated='right'>
        <span className={style.channelBalance}>{value} {denomination}</span>
        <p>
          <span className={style.channelBalance}>Fee {fee.value} {fee.denomination}</span>
        </p>
      </List.Content>
      {icon}
      <List.Content className={style.listContent}>
        <List.Header className={style.listHeader}>{transaction.title} <span className={style.lifetimeDate}>{date}</span></List.Header>
        <List.Description className={style.listDesc}>{this.transactionDescription(transaction)}</List.Description>
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

  componentWillUnmount() {
    this._isMounted = false
  }
}

function mapStateToProps (state: FrameState): TransactionsSubpageProps {
  return {
    lastUpdateDb: state.shared.lastUpdateDb
  }
}

export default connect(mapStateToProps)(TransactionsSubpage)
