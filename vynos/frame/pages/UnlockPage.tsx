import * as React from 'react'
import {connect} from 'react-redux'
import {ChangeEvent, FormEvent} from 'react'
import _ = require('lodash')
import WorkerProxy from '../WorkerProxy';
import { Container, Form, Button, Divider } from 'semantic-ui-react'
import Logo from '../components/Logo'
import {FrameState} from "../redux/FrameState";
import RestorePage from "./RestorePage";

const style = require("../styles/ynos.css");

export interface UnlockPageProps {
  workerProxy: WorkerProxy
}

export type UnlockPageState = {
  password: string
  passwordError: string|null
  loading: boolean
  displayRestore: boolean
};

export class UnlockPage extends React.Component<UnlockPageProps, UnlockPageState> {
  constructor (props: UnlockPageProps) {
    super(props);
    this.state = {
      password: '',
      passwordError: null,
      loading: false,
      displayRestore: false
    };
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangePassword (event: ChangeEvent<HTMLInputElement>) {
    let value = event.target.value
    this.setState({
      password: value,
      passwordError: null
    })
  }

  handleSubmit (ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    this.setState({
      loading: true
    });
    let password = _.toString(this.state.password);
    this.props.workerProxy.doUnlock(password).then((errorReason) => {
      if (errorReason) {
        this.setState({
          passwordError: errorReason
        })
      }
    })
  }

  renderPasswordInput () {
    let className = this.state.passwordError ? style.inputError : ''
    return <input type="password"
                  placeholder="Password"
                  className={className}
                  onChange={this.handleChangePassword.bind(this)} />
  }

  renderPasswordHint () {
    if (this.state.passwordError) {
      return <span className={style.errorText}><i className={style.vynosInfo}/> {this.state.passwordError}</span>;
    } else {
      return <span className={style.passLenText}>&nbsp;</span>
    }
  }

  doDisplayRestore () {
    this.setState({
      displayRestore: true
    })
  }

  doneDisplayRestorePage () {
    this.setState({
      displayRestore: false
    })
  }

  render () {
    if (this.state.displayRestore)
      return <RestorePage goBack={this.doneDisplayRestorePage.bind(this)} />

    return <Container textAlign="center" className={`${style.flexContainer} ${style.clearBorder}`}>
      <Logo />
      <Divider hidden />
      <Form onSubmit={this.handleSubmit} className={style.authForm}>
        <Form.Field className={style.authFormField} style={{textAlign: 'left'}}>
          {this.renderPasswordInput()}
          {this.renderPasswordHint()}
        </Form.Field>
        <Divider hidden />
        <Button type='submit' content='Unlock' primary className={style.buttonNav} />
        <br />
        <a onClick={this.doDisplayRestore.bind(this)}>Restore wallet</a>
      </Form>
    </Container>
  }
}

function mapStateToProps (state: FrameState): UnlockPageProps {
  return {
    workerProxy: state.temp.workerProxy
  }
}

export default connect<UnlockPageProps, undefined, any>(mapStateToProps)(UnlockPage)
