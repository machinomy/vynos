import * as React from 'react'
import { Menu, Button, Container, Form, Divider } from 'semantic-ui-react'
import TransactionMeta from '../../../lib/TransactionMeta'
import Web3 = require('web3')
import {formatAmount} from "../../../lib/formatting";

const style = require('../../styles/ynos.css')

export interface ApproveTransactionProps {
  transaction: TransactionMeta
}

export interface ApproveTransactionState{
  channelId: string
  formatedAmount: string
}

export default class ApprovePage extends React.Component<ApproveTransactionProps, ApproveTransactionState> {
  constructor(props: any) {
    super(props)
    let {value, denomination} = formatAmount(this.props.transaction.amount)
    // Format amount like 1,000,000
    let delimitedOutput = this.props.transaction.amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    let formatedAmount = value + ' ' + denomination + '('+ delimitedOutput +' wei)'
    this.state = {
      channelId: '',
      formatedAmount: formatedAmount
    }
  }

  render() {
    return <Form className={style.encryptionForm} >
      <Form.Field className={style.clearIndent}>
        <label>Channel:</label> <div className={style.listDesc}>{this.state.channelId}</div>
        <label>Amount:</label> <div>{this.state.formatedAmount}</div>
      </Form.Field>
      <Divider hidden />
    </Form>
  }
}
