import * as React from 'react'
import TransactionStorage from "../../../lib/storage/TransactionMetaStorage"
import { Menu, Button, Container, Form, Divider } from 'semantic-ui-react'
import WalletAccount from "../../components/WalletPage/WalletAccount"
import WorkerProxy from '../../WorkerProxy'
import { connect, Dispatch } from 'react-redux'
import { FrameState } from '../../redux/FrameState'
import Web3 = require('web3')
import * as actions from "../../redux/actions"
import TransactionMeta from '../../../lib/TransactionMeta'
import TransactionState from '../../../lib/TransactionState'
import TransactionKind from '../../../lib/TransactionKind'

const style = require('../../styles/ynos.css')

export interface ApprovePageState {
  transaction?: TransactionMeta
  formatedAmount: string
  formatedTotal: string
  pendingCount: number,
  from: string,
  data: string,
  to: string
}

export interface ApprovePageStateProps {
  workerProxy: WorkerProxy
  isTransactionPending: number
}
export interface ApprovePageDispatchProps {
  setPending: (state: boolean) => void
}

export type ApprovePageProps = ApprovePageStateProps & ApprovePageDispatchProps

export class ApprovePage extends React.Component<ApprovePageProps, ApprovePageState> {
  storage: TransactionStorage
  web3: Web3

  constructor(props: ApprovePageProps) {
    super(props)
    this.state = {
      formatedAmount: '',
      formatedTotal: '',
      pendingCount: 0,
      from: '',
      data: '',
      to: ''
    }
    this.storage = new TransactionStorage()
    this.web3 = new Web3()
  }

  componentWillMount() {
    this.update()
  }

  componentWillReceiveProps() {
    this.update()
  }
  
  componentWillUnmount() {
    if (this.state.transaction && this.state.transaction.state == TransactionState.PENDING) {
      this.storage.view(this.state.transaction.id).then((result) => {})
    }
  }

  update() {
    this.storage.datastore.loadDatabase(() => {
      this.storage.pending().then(pending => {
        let transaction = pending[0]
        if (transaction && transaction.meta) {
          let meta = JSON.parse(transaction.meta)
          let formatedAmount = this.web3.fromWei(transaction.amount, 'ether').toString()
          let formatedTotal = formatedAmount
          this.setState({
            transaction,
            formatedAmount,
            formatedTotal,
            pendingCount: pending.length,
            from: meta.from,
            data: meta.data,
            to: meta.to
          })
        } else {
          this.props.setPending(false)
        }
      })
    })
  }

  approve(transaction: TransactionMeta) {
    this.storage.approve(transaction.id).then((result) => {
      transaction.state = TransactionState.APPROVED
      this.props.workerProxy.resolveTransaction()
    })
  }

  reject(transaction: TransactionMeta) {
    this.storage.reject(transaction.id).then(() => {
      transaction.state = TransactionState.REJECTED
      this.props.workerProxy.resolveTransaction()
    })
  }

  renderTransaction() {
    return <Form className={style.encryptionForm} >
      <Form.Field className={style.clearIndent}>
        <div>To: {this.state.to}</div>
        <div>Amount: {this.state.formatedAmount}</div>
        <Divider />
        <div>
          <div>Total: {this.state.formatedTotal}</div>
        </div>
      </Form.Field>
      <Divider hidden />
    </Form>
  }

  renderSign() {
    return <Form className={style.encryptionForm} >
      <Form.Field className={style.clearIndent}>
        <div className={style.vynosInfo}>Signing this message can have dangerous side effects. 
        Only sign messages from sites you fully trust with your entire account.</div>
        <label>Address:</label> <div className={style.listDesc}>{this.state.from}</div>
        <label>Message:</label> <div className={style.listDesc}>{this.state.data}</div>
        </Form.Field>
      <Divider hidden />
    </Form>
  }

  render() {
    if (!this.state.transaction) {
      return null
    }
    let pending = null
    if (this.state.pendingCount > 1) {
      pending = <div>Pending transactions: {this.state.pendingCount}</div>
    }

    let transactionData;
    if (this.state.transaction.kind == TransactionKind.SIGN) {
      transactionData = this.renderSign()
    } else {
      transactionData = this.renderTransaction()
    }

    return <div>
      <WalletAccount />
      <Container textAlign="center" style={{ marginTop: '10px' }}>
        {pending}
        {transactionData}
        <div className="ui grid">
          <div className="eight wide column">
            <button className="positive ui fluid button" onClick={this.approve.bind(this, this.state.transaction)}>Approve</button>
          </div>
          <div className="eight wide column">
            <button className="negative ui fluid button" onClick={this.reject.bind(this, this.state.transaction)}>Cancel</button>
          </div>
        </div>
      </Container>
    </div>
  }
}

function mapStateToProps(state: FrameState): ApprovePageStateProps {
  return {
    isTransactionPending: state.shared.isTransactionPending,
    workerProxy: state.temp.workerProxy
  }
}

function mapDispatchToProps(dispatch: Dispatch<FrameState>): any {
  return {
    setPending: (state: boolean) => {
      dispatch(actions.setPending(state))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApprovePage)
