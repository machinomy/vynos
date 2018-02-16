import * as React from "react";
import { Container, Form, Button, Input, Label } from 'semantic-ui-react'
import { FrameState } from "../../../redux/FrameState";
import { connect } from "react-redux";
import WorkerProxy from "../../../WorkerProxy";
import {Preferences as PreferencesType}  from "../../../../worker/WorkerState";
const style = require("../../../styles/ynos.css");


export interface PreferencesStateProps {
  preferences: PreferencesType
  throttlingTimeFormatted: string
}

export interface PreferencesProps {
  workerProxy: WorkerProxy
  preferences: PreferencesType
}

export class Preferences extends React.Component<PreferencesProps, PreferencesStateProps> {
  privateKeyHex : string

  constructor(props: PreferencesProps) {
    super(props)
    this.state = {
      preferences : props.preferences,
      throttlingTimeFormatted: props.preferences.micropaymentThrottlingHumanReadable
    }
  }

  async componentWillMount () {
    this.privateKeyHex = await this.props.workerProxy.getPrivateKeyHex()
  }

  render () {
    return <div style={{overflow:"auto", paddingBottom:"20px"}}>
    <Container className={`${style.clearBorder}`}>
      <Form>
        <Form.Group grouped>
          <label>Channels</label>
          <Form.Checkbox label='Ask to create' disabled/>
          <Form.Checkbox label='Throttling' disabled/>
        </Form.Group>
        <Form.Group grouped>
          <label>Micropayments (threshold in wei)</label>
          <Form.Input placeholder='Maximum micropayment' className={'micropaymentThreshold'} value={this.state.preferences.micropaymentThreshold} onChange={()=>{this.handleChangeMicropaymentThreshold()}}/>
          <label>Throttling (in ms, s, m, h, d, w or empty for none, eg 2h5m)</label>
          <Form.Input className={'micropaymentThrottling'} value={this.state.throttlingTimeFormatted}
                      onChange={()=>{this.handleChangeMicropaymentThrottling()}}/>
        </Form.Group>
        <Form.Group grouped>
          <label>Security</label>
          <p>
            <a onClick={() => {this.handleSavePrivateKeyToFile()}}>Save private key to file</a>
          </p>
        </Form.Group>
        {/*<p className={style.buttonNav}>*/}
          {/*<Button type='submit' content="Save" primary disabled/>*/}
        {/*</p>*/}
      </Form>
    </Container>
    </div>
  }

  handleChangeMicropaymentThrottling() {
    let newValueAsString = (document.querySelector('.micropaymentThrottling input') as HTMLInputElement)
      ? (document.querySelector('.micropaymentThrottling input') as HTMLInputElement) .value
      : '0'
    this.state = {...this.state, throttlingTimeFormatted: newValueAsString}
    this.state.preferences.micropaymentThrottlingHumanReadable = this.state.throttlingTimeFormatted
    this.props.workerProxy.setPreferences(this.state.preferences).then(()=>{})
  }

  handleChangeMicropaymentThreshold() {
    let newValueAsString = (document.querySelector('.micropaymentThreshold input') as HTMLInputElement).value
    let newValue = newValueAsString && newValueAsString.length > 0 ? parseInt(newValueAsString) : 0
    if (newValue < 0 || newValue === Number.NaN) {
      newValue = 0
    }
    this.state.preferences.micropaymentThreshold = newValue
    this.props.workerProxy.setPreferences(this.state.preferences).then(()=>{})
  }

  handleSavePrivateKeyToFile() {
    const blob = new Blob([this.privateKeyHex], {type: 'text/plain'})
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

function mapStateToProps (state: FrameState): PreferencesProps {
  const workerProxy = state.temp.workerProxy!
  return {
    workerProxy: workerProxy,
    preferences: state.shared.preferences
  }
}

export default connect(mapStateToProps)(Preferences)
