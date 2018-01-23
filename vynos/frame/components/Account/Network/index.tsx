import * as React from "react";
import { Container, Form, Radio } from 'semantic-ui-react'
import SettingStorage from "../../../../lib/storage/SettingStorage";
import { connect } from "react-redux";
import { FrameState } from "../../../redux/FrameState";
import { ChangeEvent } from "react";

const style = require("../../../styles/ynos.css");
const networks = require('../../../../networks.json')


export interface NetworkProps {
  changeNetwork: () => void
}

export interface NetworkState {
  value: string
  customNetwork: string
  savedCustomNetwork: string
}

export class Network extends React.Component<NetworkProps, NetworkState> {
  settingStorage: SettingStorage
  networkNames: string[]

  constructor () {
    super();
    this.settingStorage = new SettingStorage()
    this.networkNames = []
    this.state = { value: '0', customNetwork: '', savedCustomNetwork: '' }
    this.handleChange = this.handleChange.bind(this)
  }

  async componentDidMount () {
    for (let name in networks) {
      this.networkNames.push(name)
    }
    let resultNetwork: any = await this.settingStorage.getNetwork()
    let value;
    if (this.networkNames.indexOf(resultNetwork.name) !== -1) {
      value = resultNetwork.name
    } else {
      value = 'Other'
      this.setState({ customNetwork: resultNetwork.value, savedCustomNetwork: resultNetwork.value })
    }
    this.setState({ value: value });
  }

  setRadio (ev: Event, input: HTMLInputElement) {
    this.setState({ value: input.value }, this.saveNetwork)
  }

  saveNetwork () {
    let network = this.state.value
    if (this.state.value === 'Other') {
      network = this.state.customNetwork
    }
    this.settingStorage.save('network', network).then(this.props.changeNetwork).catch(console.error)
    this.setState({ savedCustomNetwork: this.state.customNetwork })
  }

  handleChange (event: ChangeEvent<HTMLInputElement>) {
    this.setState({ customNetwork: event.target.value })
  }

  render () {
    let buttonStyle
    if (this.state.customNetwork !== this.state.savedCustomNetwork) {
      buttonStyle = 'inline-block'
    } else {
      buttonStyle = 'none'
    }
    return (
      <Container className={style.clearBorder}>
        <Form className={style.formNetwork} onSubmit={this.saveNetwork.bind(this)}>
          <Form.Group grouped>
            {this.networkNames.length && this.networkNames.map((network: string) => {
              return <Form.Field key={network}><Radio name={'network'} label={network} value={network}
                                                      onChange={this.setRadio.bind(this)}
                                                      checked={this.state.value === network} style={{ width: '100%' }}/></Form.Field>
            })}
            <Form.Field key={'Other'}><Radio name={'network'} label={'Other'} value={'Other'}
                                             onChange={this.setRadio.bind(this)}
                                             checked={this.networkNames.indexOf(this.state.value) === -1}
                                             style={{ width: '100%' }}/></Form.Field>
            <input type="text" placeholder="http://127.0.0.1:8545" onChange={this.handleChange}
                   value={this.state.customNetwork} id={'customNetwork'}/>
            <input type="submit" value="Save network" style={{ marginTop: '30px', display: buttonStyle }}/>
          </Form.Group>
        </Form>
      </Container>
    )
  }
}

function mapStateToProps (state: FrameState): NetworkProps {
  return {
    changeNetwork: () => {
      return state.temp.workerProxy.changeNetwork()
    }
  }
}

export default connect(mapStateToProps)(Network)
