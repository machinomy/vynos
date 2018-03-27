import * as React from 'react'
import { Form, Divider } from 'semantic-ui-react'
import TransactionMeta from '../../../lib/TransactionMeta'
import { formatAmount } from "../../../lib/formatting"

const style = require('../../styles/ynos.css')

export interface ApproveTransactionProps {
  transaction: TransactionMeta
}

export interface ApproveTransactionState {
  formatedAmount: string
}

export default class ApprovePage extends React.Component<ApproveTransactionProps, ApproveTransactionState> {
  constructor (props: any) {
    super(props)
    let { value, denomination } = formatAmount(this.props.transaction.amount)
    // Format amount like 1,000,000
    let delimitedOutput = this.props.transaction.amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    let formatedAmount = value + ' ' + denomination + '(' + delimitedOutput + ' wei)'
    this.state = {
      formatedAmount: formatedAmount
    }
  }

  render () {
    return <Form className={style.encryptionForm}>
      <Form.Field className={style.clearIndent}>
        <Form.Group grouped={true}>
          <label>Site</label>
          <div>{this.props.transaction.origin}</div>
        </Form.Group>
        <Form.Group grouped={true}>
          <label>Description</label>
          <div>{this.props.transaction.description}</div>
        </Form.Group>
        <Form.Group grouped={true}>
          <label>Amount</label>
          <div>{this.state.formatedAmount}</div>
        </Form.Group>
      </Form.Field>
      <Divider hidden={true}/>
    </Form>
  }
}
