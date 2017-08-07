import * as React from "react";
import {connect} from "react-redux";
import LargeLogoLayout from "../components/large_logo_layout";
import {ChangeEvent, CSSProperties, FormEvent} from "react";
import _ = require("lodash")
import WorkerProxy from "../WorkerProxy";
import {FrameState} from "../state";
import Button from '@react-mdc/button'
import Textfield from '@react-mdc/textfield'
import Typography from '@react-mdc/typography'

export interface UnlockPageStateProps {
  workerProxy: WorkerProxy
}

export type UnlockPageProps = UnlockPageStateProps;

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

const MINOR_BUTTON_STYLE = {
  display: 'block',
  lineHeight: '25px',
  height: 25
};

const ERROR_MESSAGE = "Incorrect password";

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
    this.handleForgotPassword = this.handleForgotPassword.bind(this);
  }

  handlePasswordChange (event: ChangeEvent<HTMLInputElement>) {
    let value = event.target.value
    this.setState({
      password: value,
      passwordError: null
    })
  }

  handleSubmit (ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    if (!this.state.loading) {
      this.setState({
        loading: true
      });
      let password = _.toString(this.state.password);
      this.props.workerProxy.doUnlock(password).then()
    }
  }

  buttonLabel () {
    if (this.state.loading) {
      return 'Loading...'
    } else {
      return 'Unlock'
    }
  }

  handleForgotPassword () {
    alert('Not Yet Implemented')
  }

  render () {
    return <LargeLogoLayout>
      <form style={BUTTON_CONTAINER_STYLE} onSubmit={this.handleSubmit}>
        <Textfield>
          <Textfield.Input id="password" autoComplete="password" type="password" onChange={this.handlePasswordChange} />
          <Textfield.Label htmlFor="password">
            Password
          </Textfield.Label>
        </Textfield>
        <Button raised={true}>{this.buttonLabel()}</Button>
        <Typography>
          <Typography.Text textStyle="body1">
            <a href="#" style={MINOR_BUTTON_STYLE} onClick={this.handleForgotPassword}>Forgot password?</a>
          </Typography.Text>
        </Typography>
      </form>
    </LargeLogoLayout>
  }
}

function mapStateToProps (state: FrameState): UnlockPageStateProps {
  return {
    workerProxy: state.temp.workerProxy!
  }
}

export default connect<UnlockPageProps, undefined, any>(mapStateToProps)(UnlockPage)
