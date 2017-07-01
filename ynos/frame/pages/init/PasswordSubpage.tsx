import * as React from "react";
import Textfield from "@react-mdc/textfield"
import Button from "@react-mdc/button";
import {Dispatch} from "redux";
import {FrameState} from "../../state";
import {ChangeEvent, CSSProperties} from "react";
import WorkerProxy from "../../WorkerProxy";
import {connect} from "react-redux";
import actions from "../../actions";

export interface PasswordSubpageState {
  password: null | string,
  passwordConfirmation: null | string,
  passwordError: null | string,
  passwordConfirmationError: null | string
}

const TEXT_FIELD_STYLE = {
  marginTop: -5,
  width: 240
};

const BUTTON_CONTAINER_STYLE: CSSProperties = {
  textAlign: "center",
  width: "240px",
  top: "325px",
  position: "absolute"
};

const BUTTON_STYLE = {
  boxShadow: null
};

const MINOR_BUTTON_STYLE = {
  display: 'block',
  lineHeight: '25px',
  height: 25
};

const PASSWORD_CONFIRMATION_HINT_TEXT = 'Same as password';
const MINIMUM_PASSWORD_LENGTH = 8;
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

  handleSubmit () {
    if (this.isValid() && this.state.password) {
      this.props.genKeyring(this.props.workerProxy, this.state.password)
    }
  }

  passwordConfirmationStyle () {
    if (this.state.passwordError) {
      return Object.assign({}, TEXT_FIELD_STYLE, {
        marginTop: -1*(25 + 2 + 5)
      })
    } else {
      return TEXT_FIELD_STYLE
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
      <Textfield fullwidth onChange={this.handleChangePassword}>
        <Textfield.Input id="password"/>
        <Textfield.Label htmlFor="password">
          Password
        </Textfield.Label>
      </Textfield>
      <Textfield fullwidth onChange={this.handleChangePasswordConfirmation}>
        <Textfield.Input id="password-confirmation" />
        <Textfield.Label htmlFor="password-confirmation">
          Password Confirmation
        </Textfield.Label>
      </Textfield>
      {this.renderError()}
      <Button raised primary onClick={this.handleSubmit}>Create wallet</Button>
    </div>
  }

  /*
  render () {
    return <div>
      <h1>
        Encrypt your new wallet
      </h1>
      <TextField
        floatingLabelText="Password"
        hintText={PASSWORD_HINT_TEXT}
        errorText={this.state.passwordError}
        type="password"
        style={TEXT_FIELD_STYLE}
        onChange={this.handlePasswordChange} />
      <TextField
        floatingLabelText="Password Confirmation"
        hintText={PASSWORD_CONFIRMATION_HINT_TEXT}
        errorText={this.state.passwordConfirmationError}
        type="password"
        style={this.passwordConfirmationStyle()}
        onChange={this.handlePasswordConfirmationChange} />

      <div style={BUTTON_CONTAINER_STYLE}>
        <div>
          <RaisedButton label="CREATE WALLET" style={BUTTON_STYLE} primary={true} onTouchTap={this.handleSubmit} />
        </div>
        <div>
          <a href="#FIXME" style={MINOR_BUTTON_STYLE}>Restore wallet</a>
        </div>
      </div>
    </div>
  }
   */
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
