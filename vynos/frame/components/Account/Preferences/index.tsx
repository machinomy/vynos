import * as React from "react";
import { Container, Form, Button } from 'semantic-ui-react'
import { FrameState } from "../../../redux/FrameState";
import { connect } from "react-redux";
import WorkerProxy from "../../../WorkerProxy";
const style = require("../../../styles/ynos.css");


export interface PreferencesStateProps {}

export interface PreferencesProps {
  workerProxy: WorkerProxy
}

export class Preferences extends React.Component<PreferencesProps, PreferencesStateProps> {
  privateKeyHex : string

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
        <p className={style.buttonNav}>
          <Button type='submit' content="Save" primary disabled/>
        </p>
      </Form>
    </Container>
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
    workerProxy: workerProxy
  }
}

export default connect(mapStateToProps)(Preferences)
