import * as React from "react";
import {connect} from "react-redux";
import {AppFrameState} from "../../reducers/state";
/*
import Terms from './Terms';
import Encryption from './Encryption';
import Mnemonic from './Mnemonic';
*/
import {Redirect} from "react-router";
import Terms from './Terms'
import Password from './Password'
import Mnemonic from './Mnemonic'

export interface Registration {
  needAcceptTerms: boolean
  needSetPassword: boolean
  didGenerateMnemonic: boolean
}

const Registration: React.SFC<Registration> = (props) => {
  console.log('REGISTRATION')
  if (props.needAcceptTerms) {
    return <Terms />
  } else if (props.needSetPassword) {
    return <Password />
  } else if (props.didGenerateMnemonic) {
    return <Mnemonic />
  } else {
    return <Redirect to="/" />
  }
}

function mapStateToProps(state: AppFrameState): Registration {
  return {
    needAcceptTerms: !state.temp.initPage.didAcceptTerms && !state.shared.didInit,
    needSetPassword: !state.temp.initPage.mnemonic && !state.shared.didInit,
    didGenerateMnemonic: !!state.temp.initPage.mnemonic && !state.shared.didInit
  }
}

export default connect<Registration, undefined, any>(mapStateToProps)(Registration)
