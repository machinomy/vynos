import * as React from "react";
import {connect} from "react-redux";
import {AppFrameState} from "../reducers/state";
/*
import Terms from './Terms';
import Encryption from './Encryption';
import Mnemonic from './Mnemonic';
*/
import 'semantic-ui-css/semantic.min.css';
import {Redirect} from "react-router";

export interface Registration {
  needAcceptTerms: boolean
  needSetPassword: boolean
}

const Registration: React.SFC<Registration> = (props) => {
  if (props.needAcceptTerms) {
    return <Redirect to="/sign_up/terms" />
  } else if (props.needSetPassword) {
    return <p>Encryption</p>
  } else {
    return <p>Mnemonic</p>
  }
}

function mapStateToProps(state: AppFrameState): Registration {
  return {
    needAcceptTerms: !state.temp.initPage.didAcceptTerms,
    needSetPassword: !state.temp.initPage.mnemonic,
  }
}

export default connect<Registration, undefined, any>(mapStateToProps)(Registration)
