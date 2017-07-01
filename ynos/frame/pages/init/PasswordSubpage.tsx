import * as React from "react";
import {Dispatch} from "redux";
import {FrameState} from "../../state";
import {ChangeEvent, FormEvent} from "react";
import WorkerProxy from "../../WorkerProxy";
import {connect} from "react-redux";
import actions from "../../actions";

export interface PasswordSubpageState {
  password: null | string,
  passwordConfirmation: null | string,
  passwordError: null | string,
  passwordConfirmationError: null | string
}

const PASSWORD_CONFIRMATION_HINT_TEXT = 'Same as password';
const MINIMUM_PASSWORD_LENGTH = 0; // FIXME ACHTUNG MUST BE 8
const PASSWORD_HINT_TEXT = `At least ${MINIMUM_PASSWORD_LENGTH} characters`;

export interface PasswordSubpageStateProps {
  workerProxy: WorkerProxy
}

export interface PasswordSubpageDispatchProps {
  genKeyring: (workerProxy: WorkerProxy, password: string) => void
}

export type PasswordSubpageProps = PasswordSubpageStateProps & PasswordSubpageDispatchProps

export class PasswordSubpage extends React.Component<PasswordSubpageProps, PasswordSubpageState> {
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

  handleSubmit (ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    if (this.isValid() && this.state.password) {
      this.props.genKeyring(this.props.workerProxy, this.state.password)
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
    let error = this.state.passwordError || this.state.passwordConfirmationError
    if (error) {
      return <p>{error}</p>
    } else {
      return null
    }
  }

  render () {
    return <div>
      <h1>
        Encrypt your new wallet
      </h1>
      <form onSubmit={this.handleSubmit}>
        <input type="password" placeholder="Password" onChange={this.handleChangePassword} />
        <input type="password" placeholder="Password Confirmation" onChange={this.handleChangePasswordConfirmation} />
        {this.renderError()}
        <button type="submit">Create wallet</button>
      </form>
    </div>
  }
}

function mapStateToProps(state: FrameState): PasswordSubpageStateProps {
  return {
    workerProxy: state.temp.workerProxy!
  }
}

function mapDispatchToProps(dispatch: Dispatch<FrameState>): PasswordSubpageDispatchProps {
  return {
    genKeyring: (workerProxy, password) => {
      workerProxy.genKeyring(password).then(mnemonic => {
        dispatch(actions.temp.init.didReceiveMnemonic(mnemonic))
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordSubpage)
