import * as React from 'react'
import {connect} from 'react-redux'
import { Container, Menu, Form, Button, Divider } from 'semantic-ui-react'
const style = require('../../styles/ynos.css')

import {MINIMUM_PASSWORD_LENGTH, PASSWORD_CONFIRMATION_HINT_TEXT, PASSWORD_HINT_TEXT} from '../../fileWithConstants'
import WorkerProxy from '../../WorkerProxy'
import {RouterProps} from 'react-router'
import {AppFrameState} from "../../reducers/state";
import {ChangeEvent, FormEvent} from "react";

export interface RestoreStateProps {
  workerProxy: WorkerProxy
}

type RestoreProps = RestoreStateProps & RouterProps

export interface RestoreState {
  seed?: string
  password?: string
  passwordConfirmation?: string
  passwordError?: string
  passwordConfirmationError?: string
}

class Restore extends React.Component<RestoreProps, RestoreState> {
  constructor (props: RestoreProps) {
    super(props)
    this.state = {}
  }

  goBack () {
    this.props.history.goBack()
  }

  handleSubmit (ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    if (this.isValid() && this.state.password && this.state.seed) {
      this.props.workerProxy.restoreWallet(this.state.password, this.state.seed).then(() => {
        this.props.history.push('/')
      })
    }
  }

  isValid () {
    let passwordError = this.state.passwordError;
    if (this.state.password && this.state.password.length < MINIMUM_PASSWORD_LENGTH) {
      passwordError = PASSWORD_HINT_TEXT;
      this.setState({
        passwordError: passwordError
      })
    }
    let passwordConfirmationError = this.state.passwordConfirmationError;
    if (this.state.passwordConfirmation !== this.state.password && this.state.passwordConfirmation) {
      passwordConfirmationError = PASSWORD_CONFIRMATION_HINT_TEXT;
      this.setState({
        passwordConfirmationError: passwordConfirmationError
      })
    }
    return !(passwordError || passwordConfirmationError)
  }

  handleChangeSeed (ev: ChangeEvent<EventTarget>) {
    let value = (ev.target as HTMLInputElement).value
    this.setState({
      seed: value,
      passwordError: undefined,
      passwordConfirmationError: undefined
    })
  }

  handleChangePassword (ev: ChangeEvent<EventTarget>) {
    let value = (ev.target as HTMLInputElement).value
    this.setState({
      password: value,
      passwordError: undefined,
      passwordConfirmationError: undefined
    })
  }

  handleChangePasswordConfirmation (ev: ChangeEvent<EventTarget>) {
    let value = (ev.target as HTMLInputElement).value
    this.setState({
      passwordConfirmation: value,
      passwordError: undefined,
      passwordConfirmationError: undefined
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
      return <span className={style.passLenText}>At least {MINIMUM_PASSWORD_LENGTH} characters</span>
    }
  }

  renderPasswordConfirmationInput () {
    let className = this.state.passwordConfirmationError ? style.inputError : ''
    return  <input type="password"
                   placeholder="Password Confirmation"
                   className={className}
                   onChange={this.handleChangePasswordConfirmation.bind(this)} />
  }

  renderPasswordConfirmationHint () {
    if (this.state.passwordConfirmationError) {
      return <span className={style.errorText}><i className={style.vynosInfo}/> {this.state.passwordConfirmationError}</span>;
    } else {
      return <span className={style.errorText}>&nbsp;</span>;
    }
  }

  render () {
    return <div>
      <Menu className={style.clearBorder}>
        <Menu.Item link className={style.menuIntoOneItemFluid} onClick={this.goBack.bind(this)}>
          <i className={style.vynosArrowBack}/> Restore a Wallet
        </Menu.Item>
      </Menu>
      <Container textAlign="center">
        <Form className={style.encryptionForm} onSubmit={this.handleSubmit.bind(this)}>
          <Form.Field control='textarea'
                      rows='3'
                      placeholder='Seed Phrase'
                      className={style.mnemonicInput}
                      onChange={this.handleChangeSeed.bind(this)}
          />
          <Form.Field className={style.clearIndent}>
            {this.renderPasswordInput()}
            {this.renderPasswordHint()}
          </Form.Field>
          <Form.Field className={style.clearIndent}>
            {this.renderPasswordConfirmationInput()}
            {this.renderPasswordConfirmationHint()}
          </Form.Field>
          <Divider hidden />
          <Button type='submit' content="Restore" primary className={style.buttonNav} />
        </Form>
      </Container>
    </div>
  }
}

function mapStateToProps (state: AppFrameState): RestoreStateProps {
  return {
    workerProxy: state.temp.workerProxy!
  }
}

export default connect<RestoreStateProps, undefined, any>(mapStateToProps)(Restore)
