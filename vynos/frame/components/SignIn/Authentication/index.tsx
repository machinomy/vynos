import * as React from "react";
import {connect} from "react-redux";
import {ChangeEvent, CSSProperties, FormEvent} from "react";
import _ = require("lodash")
import WorkerProxy from "../../../WorkerProxy";
import {FrameState} from "../../../state/FrameState";
import { Container, Form, Input, Header, Button, Divider } from 'semantic-ui-react'
import Logo from '../Header';
import { Redirect } from 'react-router-dom'

const style = require("../../../styles/ynos.css");

export interface UnlockPageStateProps {
  workerProxy: WorkerProxy
}

export type UnlockPageProps = UnlockPageStateProps;

export type UnlockPageState = {
  password: string|null;
  passwordError: string|null;
  loading: boolean
};

const ERROR_MESSAGE = "Incorrect password";

export class Authentication extends React.Component<UnlockPageProps, UnlockPageState> {
  constructor (props: UnlockPageProps) {
    super(props);
    this.state = {
      password: null,
      passwordError: null,
      loading: false
    };
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleForgotPassword = this.handleForgotPassword.bind(this);
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

  handleForgotPassword () {
    alert('Not Yet Implemented')
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

  render () {
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
        <a href="#">Forgot password?</a>
      </Form>
    </Container>
  }
}


function mapStateToProps (state: FrameState): UnlockPageStateProps {
  return {
    workerProxy: state.temp.workerProxy!
  }
}

export default connect<UnlockPageProps, undefined, any>(mapStateToProps)(Authentication)
