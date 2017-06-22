import * as React from "react";
import {connect} from "react-redux";
import {State} from "../state";
import Keyring from "../lib/Keyring";
import Wallet from "ethereumjs-wallet";
import LargeLogoLayout from "../components/large_logo_layout";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import {CSSProperties} from "react";
import _ from "lodash";
import {Dispatch} from "react-redux";
import actions from "../actions";

export interface UnlockPageStateProps {
  keyring: string|null;
}

export interface UnlockPageDispatchProps {
  onUnlock: (wallet: Wallet) => void;
}

export type UnlockPageProps = UnlockPageStateProps & UnlockPageDispatchProps;

export type UnlockPageState = {
  password: string|null;
  passwordError: string|null;
  loading: boolean
};

const TEXT_FIELD_STYLE = {
  marginTop: 20,
  width: 240
};

const BUTTON_CONTAINER_STYLE: CSSProperties = {
  textAlign: 'center',
  width: 240,
  top: 325,
  position: 'absolute'
};

const BUTTON_STYLE = {
  boxShadow: null
};

const MINOR_BUTTON_STYLE = {
  display: 'block',
  lineHeight: '25px',
  height: 25
};

const ERROR_MESSAGE = "Incorrect password";

function unlockWallet (keyringSerialized: string, password: string): Promise<Wallet> {
  return Keyring.deserialize(keyringSerialized, password).then(keyring => {
    return keyring.wallet
  })
}

export class UnlockPage extends React.Component<UnlockPageProps, UnlockPageState> {
  constructor (props: UnlockPageProps) {
    super(props);
    this.state = {
      password: null,
      passwordError: null,
      loading: false
    };
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handlePasswordChange (event: Event, value: string) {
    this.setState({
      password: value,
      passwordError: null
    })
  }

  handleSubmit () {
    if (!this.state.loading) {
      this.setState({
        loading: true
      });
      let password = _.toString(this.state.password);
      if (this.props.keyring) {
        unlockWallet(this.props.keyring, password).then(wallet => {
          this.props.onUnlock(wallet)
        }).catch(error => {
          console.info(error);
          this.setState({
            loading: false,
            passwordError: ERROR_MESSAGE
          })
        })
      }
    }
  }

  buttonLabel () {
    if (this.state.loading) {
      return 'Loading...'
    } else {
      return 'UNLOCK'
    }
  }

  render () {
    return <LargeLogoLayout>
      <TextField
        floatingLabelText="Password"
        hintText="Password for the wallet"
        errorText={this.state.passwordError}
        type="password"
        style={TEXT_FIELD_STYLE}
        onChange={this.handlePasswordChange} />
      <div style={BUTTON_CONTAINER_STYLE}>
        <div>
          <RaisedButton label={this.buttonLabel()} style={BUTTON_STYLE} primary={true} onTouchTap={this.handleSubmit} />
        </div>
        <div>
          <a href="#FIXME" style={MINOR_BUTTON_STYLE}>Forgot password?</a>
        </div>
      </div>
    </LargeLogoLayout>
  }
}

function mapStateToProps (state: State): UnlockPageStateProps {
  return {
    keyring: state.init.keyring
  }
}

function mapDispatchToProps (dispatch: Dispatch<any>): UnlockPageDispatchProps {
  return {
    onUnlock: (wallet: Wallet) => {
      dispatch(actions.runtime.setWallet(wallet))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UnlockPage)
