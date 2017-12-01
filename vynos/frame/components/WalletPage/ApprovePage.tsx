import * as React from 'react'
import TransactionStorage from "../../../lib/storage/TransactionMetaStorage"
import { Menu, Button, Container, Form, Divider } from 'semantic-ui-react'
import WalletAccount from "../../components/WalletPage/WalletAccount"
const style = require('../../styles/ynos.css')
import WorkerProxy from '../../WorkerProxy'
import {connect} from 'react-redux'
import {FrameState} from '../../redux/FrameState'
import Web3 = require('web3')

export interface ApprovePageProps {
  workerProxy: WorkerProxy
}

export class ApprovePage extends React.Component<any, any> {
  storage: TransactionStorage
  web3: Web3

  constructor(props: ApprovePageProps) {
    super(props)
    this.state = {
      transaction: {}
    }
    this.storage = new TransactionStorage()
    this.web3 = new Web3()
  }

  componentDidMount() {
    this.update()
  }

  componentWillUpdate() {
    this.update()
  }

  update() {
    this.storage.datastore.loadDatabase(()=>{
      this.storage.pending().then(pending => {
        let transaction = pending[0]
        if (transaction && transaction.description) {
          transaction.description = JSON.parse(transaction.description)
          let formatedAmount = this.web3.fromWei(this.state.transaction.amount, 'ether').toString()
          let formatedTotal = formatedAmount
          this.setState({ 
            transaction,
            formatedAmount,
            formatedTotal,
            pendingCount: pending.length
          })
        }
      })
    })
  }
  
  approve() {
    this.storage.approve(this.state.transaction.id).then((result) => {
      this.props.workerProxy.resolveTransaction()
    })
  }

  reject() {
    this.storage.reject(this.state.transaction.id).then(() => {
      this.props.workerProxy.resolveTransaction()
    })
  }

  render() {
    if (!this.state.transaction.id){
      return null
    }
    let pending = null
    if (this.state.pendingCount > 1) {
      pending = <div>Pending transactions: {this.state.pendingCount}</div>
    }
    return <div>
      <WalletAccount />
      <Container textAlign="center" style={{ marginTop: '10px' }}>
        {pending}
        <Form className={style.encryptionForm} >
          <Form.Field className={style.clearIndent}>
            <div>To: {this.state.transaction.description.to}</div>
            <div>Amount: {this.state.formatedAmount}</div>
            <Divider />
            <div>
              <div>Total: {this.state.formatedTotal}</div>
              <div>{this.state.balanceError ? <span className={style.errorText}><i
                className={style.vynosInfo} /> {this.state.balanceError}</span> : ''}</div>
            </div>
          </Form.Field>
          <Divider hidden />
        </Form>
        <div className="ui grid">
            <div className="eight wide column">
              <button className="positive ui fluid button" onClick={this.approve.bind(this)}>Approve</button>
            </div>
            <div className="eight wide column">
              <button className="negative ui fluid button" onClick={this.reject.bind(this)}>Cancel</button>
            </div>
        </div>
      </Container>
    </div>
  }
}
  
function mapStateToProps (state: FrameState): ApprovePageProps {
  return {
    workerProxy: state.temp.workerProxy
  }
}

export default connect<ApprovePageProps, undefined, any>(mapStateToProps)(ApprovePage)
