import * as React from 'react'
import { FrameState } from '../../redux/FrameState'
import WorkerProxy from '../../WorkerProxy'
import { connect, Dispatch } from 'react-redux'
import { Button, Container, Divider, Form, Header, Icon } from 'semantic-ui-react'
import { MINIMUM_PASSWORD_LENGTH, PASSWORD_CONFIRMATION_HINT_TEXT, PASSWORD_HINT_TEXT } from '../../constants'
import RestorePage from '../RestorePage'
import Logo from '../../components/Logo'
import * as actions from '../../redux/actions'

const style = require('../../styles/ynos.css')

export interface PasswordState {
  password: string
  passwordConfirmation: string
  passwordError: null | string
  passwordConfirmationError: null | string
  displayRestore: boolean
}

export interface OwnPasswordProps {
  showVerifiable: () => void
}

export interface PasswordSubpageStateProps {
  workerProxy: WorkerProxy
}

export interface PasswordSubpageDispatchProps {
  genKeyring?: (workerProxy: WorkerProxy, password: string) => void
}

export type PasswordSubpageProps = PasswordSubpageStateProps & PasswordSubpageDispatchProps & OwnPasswordProps

export class Password extends React.Component<PasswordSubpageProps, PasswordState> {
  constructor (props: PasswordSubpageProps) {
    super(props)
    this.state = {
      password: '',
      passwordConfirmation: '',
      passwordError: null,
      passwordConfirmationError: null,
      displayRestore: false
    }
    this.handleChangePassword = this.handleChangePassword.bind(this)
    this.handleChangePasswordConfirmation = this.handleChangePasswordConfirmation.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  isValid () {
    let passwordError = this.state.passwordError
    if (this.state.password.length < MINIMUM_PASSWORD_LENGTH) {
      passwordError = PASSWORD_HINT_TEXT
      this.setState({
        passwordError: passwordError
      })
    }
    let passwordConfirmationError = this.state.passwordConfirmationError
    if (this.state.passwordConfirmation !== this.state.password && this.state.password) {
      passwordConfirmationError = PASSWORD_CONFIRMATION_HINT_TEXT
      this.setState({
        passwordConfirmationError: passwordConfirmationError
      })
    }
    return !(passwordError || passwordConfirmationError)
  }

  handleSubmit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (this.isValid() && this.state.password) {
      return this.props.genKeyring!(this.props.workerProxy, this.state.password)
    }
  }

  handleChangePassword (ev: React.ChangeEvent<EventTarget>) {
    let value = (ev.target as HTMLInputElement).value
    this.setState({
      password: value,
      passwordError: null,
      passwordConfirmationError: null
    })
  }

  handleChangePasswordConfirmation (ev: React.ChangeEvent<EventTarget>) {
    let value = (ev.target as HTMLInputElement).value
    this.setState({
      passwordConfirmation: value,
      passwordError: null,
      passwordConfirmationError: null
    })
  }

  renderPasswordInput () {
    let className = this.state.passwordError ? style.inputError : ''
    return (
      <input
        type="password"
        placeholder="Password"
        className={className}
        onChange={this.handleChangePassword}
        autoComplete="new-password"
      />
    )
  }

  renderPasswordHint () {
    if (this.state.passwordError) {
      return <span className={style.errorText}><i className={style.vynosInfo}/> {this.state.passwordError}</span>
    } else {
      return <span className={style.passLenText}>At least {MINIMUM_PASSWORD_LENGTH} characters</span>
    }
  }

  renderPasswordConfirmationInput () {
    let className = this.state.passwordConfirmationError ? style.inputError : ''
    return (
      <input
        type="password"
        placeholder="Password Confirmation"
        className={className}
        onChange={this.handleChangePasswordConfirmation}
        autoComplete="new-password"
      />
    )
  }

  renderPasswordConfirmationHint () {
    if (this.state.passwordConfirmationError) {
      return <span className={style.errorText}><i className={style.vynosInfo}/> {this.state.passwordConfirmationError}</span>
    } else {
      return <span className={style.errorText}>&nbsp;</span>
    }
  }

  doDisplayRestorePage () {
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
    if (this.state.displayRestore) {
      return <RestorePage goBack={this.doneDisplayRestorePage.bind(this)}/>
    }

    return (
      <Container textAlign="center" className={`${style.flexContainer} ${style.clearBorder}`}>
        <Logo />
        <Divider hidden={true} />
        <Header as="h1" className={style.encryptionHeader}>Encrypt your new wallet</Header>
        <Form onSubmit={this.handleSubmit} className={style.encryptionForm}>
          <div className="equal width fields" style={{ flexDirection: 'column', textAlign: 'left' }}>
            <Form.Field className={style.clearIndent}>
              {this.renderPasswordInput()}
              {this.renderPasswordHint()}
            </Form.Field>
            <Form.Field className={style.clearIndent}>
              {this.renderPasswordConfirmationInput()}
              {this.renderPasswordConfirmationHint()}
            </Form.Field>
          </div>
          <Divider hidden={true} />
          <Button type="submit" content="Create wallet" primary={true} className={style.buttonNav} />
          <br />
          <a onClick={this.doDisplayRestorePage.bind(this)}>Restore wallet</a>
        </Form>
        <a onClick={this.props.showVerifiable} id={style.shieldIcon}><Icon name={'shield'} size={'large'}/></a>
      </Container>
    )
  }
}

function mapStateToProps (state: FrameState, props: OwnPasswordProps): PasswordSubpageStateProps & OwnPasswordProps {
  return {
    workerProxy: state.temp.workerProxy,
    showVerifiable: props.showVerifiable
  }
}

function mapDispatchToProps (dispatch: Dispatch<FrameState>): PasswordSubpageDispatchProps {
  return {
    genKeyring: (workerProxy, password) => {
      workerProxy.genKeyring(password).then(mnemonic => {
        dispatch(actions.didReceiveMnemonic(mnemonic))
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Password)
