import * as React from 'react'
import TransactionStorage from "../../../lib/storage/TransactionMetaStorage"
import { Menu, Button, Container, Form, Divider } from 'semantic-ui-react'
import WalletAccount from "../../components/WalletPage/WalletAccount"
import WorkerProxy from '../../WorkerProxy'
import { connect, Dispatch } from 'react-redux'
import { FrameState } from '../../redux/FrameState'
import * as actions from "../../redux/actions"
import TransactionMeta from '../../../lib/TransactionMeta'
import TransactionState from '../../../lib/TransactionState'
import TransactionKind from '../../../lib/TransactionKind'
import ApproveSignature from './ApproveSignature'
import ApproveTransaction from './ApproveTransaction'

const style = require('../../styles/ynos.css')

export interface ApprovePageState {
  transaction?: TransactionMeta
  pendingCount: number,
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

  constructor (props: ApprovePageProps) {
    super(props)
    this.state = {
      pendingCount: 0
    }
    this.storage = new TransactionStorage()
  }

  componentWillMount () {
    this.update()
  }

  componentWillReceiveProps () {
    this.update()
  }

  componentWillUnmount () {
    if (this.state.transaction && this.state.transaction.state == TransactionState.PENDING) {
      this.storage.view(this.state.transaction.id).then((result) => {
      })
    }
  }

  update () {
    this.storage.pending().then(pending => {
      let transaction = pending[0]
      if (transaction) {
        this.setState({
          transaction,
          pendingCount: pending.length,
        })
      } else {
        this.props.setPending(false)
      }
    })
  }

  approve (transaction: TransactionMeta) {
    this.storage.approve(transaction.id).then((result) => {
      transaction.state = TransactionState.APPROVED
      this.props.workerProxy.resolveTransaction()
    })
  }

  reject (transaction: TransactionMeta) {
    this.storage.reject(transaction.id).then(() => {
      transaction.state = TransactionState.REJECTED
      this.props.workerProxy.resolveTransaction()
    })
  }

  render () {
    if (!this.state.transaction) {
      return null
    }
    let pending = null
    if (this.state.pendingCount > 1) {
      pending = <div>Pending transactions: {this.state.pendingCount}</div>
    }

    let transactionData
    switch (this.state.transaction.kind) {
      case TransactionKind.SIGN:
        transactionData = <ApproveSignature transaction={this.state.transaction} key={this.state.transaction.id}/>
        break
      case TransactionKind.ETHEREUM:
        transactionData = <ApproveTransaction transaction={this.state.transaction} key={this.state.transaction.id}/>
        break
      default:
        throw new Error("Not Implemented")
    }

    return <div>
      <WalletAccount/>
      <Container textAlign="center" style={{ marginTop: '10px' }}>
        {pending}
        {transactionData}
        <div className="ui grid">
          <div className="eight wide column">
            <button className="positive ui fluid button"
                    onClick={this.approve.bind(this, this.state.transaction)}>Approve
            </button>
          </div>
          <div className="eight wide column">
            <button className="negative ui fluid button"
                    onClick={this.reject.bind(this, this.state.transaction)}>Cancel
            </button>
          </div>
        </div>
      </Container>
    </div>
  }
}

function mapStateToProps (state: FrameState): ApprovePageStateProps {
  return {
    isTransactionPending: state.shared.isTransactionPending,
    workerProxy: state.temp.workerProxy
  }
}

function mapDispatchToProps (dispatch: Dispatch<FrameState>): any {
  return {
    setPending: (state: boolean) => {
      dispatch(actions.setPending(state))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApprovePage)
