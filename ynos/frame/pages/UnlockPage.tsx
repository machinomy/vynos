import * as React from "react";
import {connect} from "react-redux";
import LargeLogoLayout from "../components/large_logo_layout";
import {ChangeEvent, CSSProperties} from "react";
import _ from "lodash";
import WorkerProxy from "../WorkerProxy";
import {FrameState} from "../state";

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

const BUTTON_STYLE = {
  boxShadow: null
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
  }

  handlePasswordChange (event: ChangeEvent<HTMLInputElement>) {
    let value = event.target.value
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
      this.props.workerProxy.doUnlock(password).then()
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
      <form style={BUTTON_CONTAINER_STYLE} onSubmit={this.handleSubmit}>
        <input type="password" placeholder="Password for the wallet" style={TEXT_FIELD_STYLE} onChange={this.handlePasswordChange} />
        <div>
          <button style={BUTTON_STYLE}>{this.buttonLabel()}</button>
        </div>
        <div>
          <a href="#FIXME" style={MINOR_BUTTON_STYLE}>Forgot password?</a>
        </div>
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
