import * as React from "react";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import {CSSProperties} from "react";

export interface PasswordComponentProps {
  onSetPassword: Function
}

export interface PasswordComponentState {
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

export default class PasswordComponent extends React.Component<PasswordComponentProps, PasswordComponentState> {
  constructor (props: PasswordComponentProps) {
    super(props);
    this.state = {
      password: '',
      passwordConfirmation: '',
      passwordError: null,
      passwordConfirmationError: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isValid = this.isValid.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePasswordConfirmationChange = this.handlePasswordConfirmationChange.bind(this);
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

  handlePasswordChange (event: Event, value: string) {
    this.setState({
      password: value,
      passwordError: null
    })
  }

  handlePasswordConfirmationChange (event: Event, value: string) {
    this.setState({
      passwordConfirmation: value,
      passwordConfirmationError: null
    })
  }

  handleSubmit () {
    if (this.isValid()) {
      this.props.onSetPassword(this.state.password)
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
}
