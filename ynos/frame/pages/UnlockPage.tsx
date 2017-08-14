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
import classnames = require('classnames')

const styles = require('./buy-sell-modal.scss')

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
    return <div className={styles.buySellModal}>
      <div className={styles.tabContent}>
        <div className={styles.vynosHeader}>
          <h1>VYNOS</h1>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className={styles.vynosContent}>
            <div className={classnames(styles.inputGroup, styles.loginForm)}>
              <label>Password</label>
              <input type="password" onChange={this.handlePasswordChange} className={styles.vynosPassword} />
            </div>
            <button className={styles.loginBtn} type="submit">LOGIN</button>
            <button className={styles.cancelLoginBtn} type="reset">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  }
}

function mapStateToProps (state: FrameState): UnlockPageStateProps {
  return {
    workerProxy: state.temp.workerProxy!
  }
}

export default connect<UnlockPageProps, undefined, any>(mapStateToProps)(UnlockPage)
