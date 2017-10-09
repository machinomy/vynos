import * as React from 'react'
import {connect} from 'react-redux'
import { Container, Menu, Form, Button, Divider } from 'semantic-ui-react'
const style = require('../styles/ynos.css')

import {MINIMUM_PASSWORD_LENGTH, PASSWORD_CONFIRMATION_HINT_TEXT, PASSWORD_HINT_TEXT} from '../constants'
import WorkerProxy from '../WorkerProxy'
import {FrameState} from "../redux/FrameState";
import {ChangeEvent, FormEvent} from "react";
import bip39 = require('bip39')

export interface RestorePageStateProps {
  workerProxy: WorkerProxy
}

export interface RestorePageProps extends RestorePageStateProps {
  goBack: () => void
}

export interface RestorePageState {
  seed?: string
  seedError?: string
  password?: string
  passwordConfirmation?: string
  passwordError?: string
  passwordConfirmationError?: string
}

class RestorePage extends React.Component<RestorePageProps, RestorePageState> {
  constructor (props: RestorePageProps) {
    super(props)
    this.state = {}
  }

  goBack () {
    this.props.goBack()
  }

  handleSubmit (ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    if (this.isValid() && this.state.password && this.state.seed) {
      this.props.workerProxy.restoreWallet(this.state.password, this.state.seed).then(() => {
        this.goBack()
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

    let seedError = this.state.seedError
    if (this.state.seed && !bip39.validateMnemonic(this.state.seed)) {
      seedError = 'Probably mistyped seed phrase'
      this.setState({
        seedError: seedError
      })
    }

    return !(passwordError || passwordConfirmationError || seedError)
  }

  handleChangeSeed (ev: ChangeEvent<EventTarget>) {
    let value = (ev.target as HTMLInputElement).value
    this.setValue({
      seed: value
    })
  }

  handleChangePassword (ev: ChangeEvent<EventTarget>) {
    let value = (ev.target as HTMLInputElement).value
    this.setValue({
      password: value
    })
  }

  handleChangePasswordConfirmation (ev: ChangeEvent<EventTarget>) {
    let value = (ev.target as HTMLInputElement).value
    this.setValue({
      passwordConfirmation: value
    })
  }

  setValue(state: RestorePageState) {
    let base = {
      passwordError: undefined,
      passwordConfirmationError: undefined,
      seedError: undefined
    }
    let next = Object.assign(base, state)
    this.setState(next)
  }

  renderSeedInput () {
    let className = style.mnemonicInput + ' ' + (this.state.seedError ? style.inputError : '')
    return <textarea placeholder="Seed Phrase"
                     className={className}
                     rows={3}
                     onChange={this.handleChangeSeed.bind(this)} />
  }

  renderSeedHint () {
    if (this.state.seedError) {
      return <span className={style.errorText}><i className={style.vynosInfo}/> {this.state.seedError}</span>;
    } else {
      return <span className={style.passLenText} />
    }
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
          <Form.Field className={style.clearIndent}>
            {this.renderSeedInput()}
            {this.renderSeedHint()}
          </Form.Field>
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

function mapStateToProps (state: FrameState): RestorePageStateProps {
  return {
    workerProxy: state.temp.workerProxy
  }
}

export default connect<RestorePageStateProps, undefined, any>(mapStateToProps)(RestorePage)
