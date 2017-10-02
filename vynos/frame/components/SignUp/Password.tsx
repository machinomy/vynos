import * as React from 'react'
import {ChangeEvent, FormEvent} from 'react'
import {Dispatch} from 'redux'
import {AppFrameState} from '../../reducers/state'
import WorkerProxy from '../../WorkerProxy'
import {connect} from 'react-redux'
import actions from '../../actions'
import {Button, Container, Divider, Form, Header, GridRow} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import Logo from './Logo'
import {MINIMUM_PASSWORD_LENGTH, PASSWORD_CONFIRMATION_HINT_TEXT, PASSWORD_HINT_TEXT} from '../../fileWithConstants';

const style = require('../../styles/ynos.css')

export interface PasswordSubpageState {
  password: null | string,
  passwordConfirmation: null | string,
  passwordError: null | string,
  passwordConfirmationError: null | string
}

export interface PasswordSubpageStateProps {
  workerProxy: WorkerProxy
}

export interface PasswordSubpageDispatchProps {
  genKeyring: (workerProxy: WorkerProxy, password: string) => void
}

export type PasswordSubpageProps = PasswordSubpageStateProps & PasswordSubpageDispatchProps

export class Encryption extends React.Component<PasswordSubpageProps, PasswordSubpageState> {
  constructor (props: PasswordSubpageProps) {
    super(props);
    this.state = {
      password: '',
      passwordConfirmation: '',
      passwordError: null,
      passwordConfirmationError: null
    };
    this.handleChangePassword = this.handleChangePassword.bind(this)
    this.handleChangePasswordConfirmation = this.handleChangePasswordConfirmation.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
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
    if (this.state.passwordConfirmation !== this.state.password) {
      passwordConfirmationError = PASSWORD_CONFIRMATION_HINT_TEXT;
      this.setState({
        passwordConfirmationError: passwordConfirmationError
      })
    }
    return !(passwordError || passwordConfirmationError)
  }

  handleSubmit (e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (this.isValid() && this.state.password) {
      return this.props.genKeyring(this.props.workerProxy, this.state.password)
    }
  }

  handleChangePassword(ev: ChangeEvent<EventTarget>) {
    let value = (ev.target as HTMLInputElement).value
    this.setState({
      password: value,
      passwordError: null,
      passwordConfirmationError: null
    })
  }

  handleChangePasswordConfirmation(ev: ChangeEvent<EventTarget>) {
    let value = (ev.target as HTMLInputElement).value
    this.setState({
      passwordConfirmation: value,
      passwordError: null,
      passwordConfirmationError: null
    })
  }

  renderError () {
    if (this.state.passwordConfirmationError) {
      return <span className={style.errorText}><i className={style.vynosInfo}/> {this.state.passwordConfirmationError}</span>;
    } else if (this.state.passwordError) {
      return <span className={style.errorText}><i className={style.vynosInfo}/> {this.state.passwordError}</span>;
    } else {
      return null
    }
  }

  render () {
    return <Container textAlign="center" className={`${style.flexContainer} ${style.clearBorder}`}>
      <Logo />
      <Divider hidden />
      <Header as='h1' className={style.encryptionHeader}>Encrypt your new wallet</Header>
      <Form onSubmit={this.handleSubmit} className={style.encryptionForm}>
        <div className='equal width fields' style={{flexDirection: 'column', textAlign: 'left'}}>
          <Form.Field className={style.clearIndent}>
            <input type="password" placeholder='Password' onChange={this.handleChangePassword} />
            <span className={style.passLenText}>At least {MINIMUM_PASSWORD_LENGTH} characters</span>
          </Form.Field>
          <Form.Field className={style.clearIndent}>
            <input type="password" placeholder='Password Confirmation'
                   className={this.renderError() ? style.inputError : ''}
                   onChange={this.handleChangePasswordConfirmation} />
            {this.renderError()}
          </Form.Field>
        </div>
        <Divider hidden />
        <Button type='submit' content="Create wallet" primary className={style.buttonNav} />
        <br />
        <Link to="/restore">Restore wallet</Link>
      </Form>
    </Container>
  }
}

function mapStateToProps(state: AppFrameState): PasswordSubpageStateProps {
  return {
    workerProxy: state.temp.workerProxy!
  }
}

function mapDispatchToProps(dispatch: Dispatch<AppFrameState>): PasswordSubpageDispatchProps {
  return {
    genKeyring: (workerProxy, password) => {
      workerProxy.genKeyring(password).then(mnemonic => {
        dispatch(actions.temp.init.didReceiveMnemonic(mnemonic))
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Encryption)
