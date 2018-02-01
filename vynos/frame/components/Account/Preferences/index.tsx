import * as React from "react";
import { Container, Form, Button, Input, Label } from 'semantic-ui-react'
import { FrameState } from "../../../redux/FrameState";
import { connect } from "react-redux";
import WorkerProxy from "../../../WorkerProxy";
import {Preferences as PreferencesType}  from "../../../../worker/WorkerState";
const style = require("../../../styles/ynos.css");


export interface PreferencesStateProps {
  preferences: PreferencesType
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
      preferences : props.preferences
    }
  }

  async componentWillMount () {
    this.privateKeyHex = await this.props.workerProxy.getPrivateKeyHex()
  }

  render () {
    return <Container className={`${style.clearBorder}`}>
      <Form>
        <Form.Group grouped>
          <label>Channels</label>
          <Form.Checkbox label='Ask to create' disabled/>
          <Form.Checkbox label='Throttling' disabled/>
        </Form.Group>
        <Form.Group grouped>
          <label>Micropayments</label>
          <Form.Input placeholder='Maximum micropayment' disabled/>
          <Form.Checkbox label='Throttling' disabled/>
        </Form.Group>
        <Form.Group grouped>
          <label>Security</label>
          <p>
            <a onClick={() => {this.handleSavePrivateKeyToFile()}}>Save private key to file</a>
          </p>
        </Form.Group>
        <Form.Group grouped>
          <label>Other</label><br/>
            <label>Threshold (in wei)</label>
            <Form.Input className={'micropaymentThreshold'} value={this.state.preferences.micropaymentThreshold} onChange={()=>{this.handleChangeMicropaymentThreshold()}}/>
        </Form.Group>
        <p className={style.buttonNav}>
          <Button type='submit' content="Save" primary disabled/>
        </p>
      </Form>
    </Container>
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
