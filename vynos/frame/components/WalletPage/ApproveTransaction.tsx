import * as React from 'react'
import { Form, Divider } from 'semantic-ui-react'
import TransactionMeta from '../../../lib/TransactionMeta'
import Web3 = require('web3')

const style = require('../../styles/ynos.css')

export interface ApproveTransactionProps {
  transaction: TransactionMeta
}

export interface ApproveTransactionState {
  to: string,
  formatedAmount: string
  formatedTotal: string
  formatedFee: string
}

export default class ApprovePage extends React.Component<ApproveTransactionProps, ApproveTransactionState> {
  constructor (props: any) {
    super(props)

    this.componentWillReceiveProps()
  }

  componentWillReceiveProps () {
    if (!this.props.transaction.to) {
      return
    }

    let formatedAmount = new Web3().fromWei(this.props.transaction.amount, 'ether')
    let formatedFee = new Web3().fromWei(this.props.transaction.fee ? this.props.transaction.fee : 0, 'ether')
    let amount = parseFloat(formatedAmount)
    let fee = parseFloat(formatedFee)
    this.state = {
      to: this.props.transaction.to,
      formatedAmount: formatedAmount,
      formatedFee: formatedFee,
      formatedTotal: (amount + fee).toFixed(6)
    }
  }

  render () {
    return <Form className={style.encryptionForm} >
      <Form.Field className={style.clearIndent}>
        <label>To:</label> <div className={style.listDesc}>{this.state.to}</div>
        <label>Amount:</label> <div>{this.state.formatedAmount}</div>
        <Divider />
        <label>Fee:</label> <div>{this.state.formatedFee}</div>
        <Divider />
        <label>Total:</label> <div>{this.state.formatedTotal}</div>
      </Form.Field>
      <Divider hidden={true} />
    </Form>
  }
}
