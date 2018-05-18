import * as React from 'react'
import { Container, Form, Button } from 'semantic-ui-react'
import { FrameState } from '../../../redux/FrameState'
import { connect, Dispatch } from 'react-redux'
import WorkerProxy from '../../../WorkerProxy'
import { Preferences as PreferencesType } from '../../../../worker/WorkerState'
import * as actions from '../../../redux/actions'
import Currency from '../../../lib/currency'
const style = require('../../../styles/ynos.css')

export interface PreferencesStateProps {
  preferences: PreferencesType
  throttlingTimeFormatted: string
  currencies: Array<DropdownCurrencyData>
  currentCurrency: string
}

export interface OwnPreferencesProps {
  showVerifiable?: () => void
}

export interface DispatchPreferencesProps {
  clearTempState?: () => void
}

export interface PreferencesProps {
  workerProxy?: WorkerProxy
  preferences?: PreferencesType
}

export interface DropdownCurrencyData {
  key?: string
  value?: string
  text?: string
}

export class Preferences extends React.Component<PreferencesProps & OwnPreferencesProps & DispatchPreferencesProps, PreferencesStateProps> {
  privateKeyHex: string

  constructor (props: PreferencesProps & OwnPreferencesProps) {
    super(props)
    this.state = {
      preferences : props.preferences!,
      throttlingTimeFormatted: props.preferences && props.preferences.micropaymentThrottlingHumanReadable ? props.preferences.micropaymentThrottlingHumanReadable : '-1ms',
      currencies: [],
      currentCurrency: props.preferences!.currency
    }
    this.privateKeyHex = ''
  }

  async componentWillMount () {
    this.privateKeyHex = await this.props.workerProxy!.getPrivateKeyHex()
    let listOfCurrencies: Array<DropdownCurrencyData> = []
    for (const key of Currency.instance().currencies.keys()) {
      listOfCurrencies.push({ 'value': key, 'text': key + ' ' + Currency.instance().currencies.get(key) })
    }

    this.setState({ ...this.state, currencies: listOfCurrencies })
  }

  render () {
    return (
      <div style={{ overflow: 'auto', paddingBottom: '20px', position: 'absolute', top: '56px', bottom: '0' }}>
        <Container className={`${style.clearBorder}`}>
        <Form>
          <Form.Group grouped={true}>
            <label>Channels</label>
            <Form.Checkbox label="Ask to create" disabled={true}/>
            <Form.Checkbox label="Throttling" disabled={true}/>
          </Form.Group>
          <Form.Group grouped={true}>
            <label>Micropayments (threshold in wei)</label>
            <Form.Input placeholder="Maximum micropayment" className={'micropaymentThreshold'} value={this.state.preferences.micropaymentThreshold} onChange={() => { this.handleChangeMicropaymentThreshold() }}/>
            <label>Throttling (in ms, s, m, h, d, w or empty for none, eg 2h5m)</label>
            <Form.Input
              className={'micropaymentThrottling'}
              value={this.state.throttlingTimeFormatted}
              onChange={() => { this.handleChangeMicropaymentThrottling() }}
            />
          </Form.Group>
          <Form.Group grouped={true}>
            <label>Security</label>
            <p>
              <a onClick={() => { this.handleSavePrivateKeyToFile() }}>Save private key to file</a>
            </p>
            <p>
              <a onClick={this.props.showVerifiable}>Verify authenticity Vynos</a>
            </p>
          </Form.Group>
          <Form.Group grouped={true}>
            <label>Other</label>
            <p>
              <label>Display balance currency</label>
            </p>
            <select value={this.state.currentCurrency} onChange={(event) => { this.handleChangeCurrency(event.target.value) }}>
            {
              this.state.currencies.map((currency) => {
                return <option key={currency.value} value={currency.value}>{currency.text}</option>
              })
            }
            </select>
          </Form.Group>
          <p className={style.forgetAccount}>
            <Button content="Forget account" primary={true} onClick={() => { this.handleForgetAccount() }}/>
          </p>
        </Form>
        </Container>
      </div>
    )
  }

  handleChangeCurrency (newCurrency: string) {
    this.state = { ...this.state, currentCurrency: newCurrency, preferences: { ...this.state.preferences, currency: newCurrency } }
    this.setState(this.state)
    this.props.workerProxy!.setPreferences(this.state.preferences)
  }

  handleChangeMicropaymentThrottling () {
    let newValueAsString = (document.querySelector('.micropaymentThrottling input') as HTMLInputElement)
      ? (document.querySelector('.micropaymentThrottling input') as HTMLInputElement) .value
      : '0'
    this.state = { ...this.state, throttlingTimeFormatted: newValueAsString }
    this.state.preferences.micropaymentThrottlingHumanReadable = this.state.throttlingTimeFormatted
    this.props.workerProxy!.setPreferences(this.state.preferences).then(() => {
      // Do nothing
    })
  }

  handleChangeMicropaymentThreshold () {
    let newValueAsString = (document.querySelector('.micropaymentThreshold input') as HTMLInputElement).value
    let newValue = newValueAsString && newValueAsString.length > 0 ? parseInt(newValueAsString, 10) : 0
    if (newValue < 0 || newValue === Number.NaN) {
      newValue = 0
    }
    this.state.preferences.micropaymentThreshold = newValue
    this.props.workerProxy!.setPreferences(this.state.preferences).then(() => {
      // Do nothing
    })
  }

  handleForgetAccount () {
    this.props.workerProxy!.clearReduxPersistentStorage()
    this.props.clearTempState!()
    this.props.workerProxy!.clearAccountInfo()
    localStorage.setItem('mc_wallet_avatar', '')
  }

  handleSavePrivateKeyToFile () {
    const blob = new Blob([this.privateKeyHex], { type: 'text/plain' })
    const filename = 'secretPrivateKey.txt'
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, filename)
    } else {
      const elem = window.document.createElement('a')
      elem.href = window.URL.createObjectURL(blob)
      elem.download = filename
      document.body.appendChild(elem)
      elem.click()
      document.body.removeChild(elem)
    }
  }
}

function mapStateToProps (state: FrameState, props: OwnPreferencesProps): PreferencesProps & OwnPreferencesProps {
  const workerProxy = state.temp.workerProxy
  return {
    workerProxy: workerProxy,
    showVerifiable: props.showVerifiable,
    preferences: state.shared.preferences
      ? state.shared.preferences
      : {
        micropaymentThreshold: 1000000,
        micropaymentThrottlingHumanReadable: '-1ms',
        currency: 'ETH'
      }
  }
}

function mapDispatchToProps (dispatch: Dispatch<FrameState>): DispatchPreferencesProps {
  return {
    clearTempState: () => {
      dispatch(actions.clearTempState(true))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Preferences)
