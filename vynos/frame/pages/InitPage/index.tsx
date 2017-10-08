import * as React from "react";
import {connect} from "react-redux";
import {FrameState} from "../../state/FrameState";
import Terms from './Terms'
import Password from './Password'
/*
import Mnemonic from './Mnemonic'
 */

export interface InitPageProps {
  needAcceptTerms: boolean
  needSetPassword: boolean
  didGenerateMnemonic: boolean
}

const InitPage: React.SFC<InitPageProps> = (props) => {
  if (props.needAcceptTerms) {
    return <Terms />
  } else if (props.needSetPassword) {
    return <Password />
  } else if (props.didGenerateMnemonic) {
    return <p>Mnemonic</p>
  } else {
    return <p>ERROR</p>
  }
}

function mapStateToProps(state: FrameState): InitPageProps {
  return {
    needAcceptTerms: !state.temp.initPage.didAcceptTerms && !state.shared.didInit,
    needSetPassword: !state.temp.initPage.mnemonic && !state.shared.didInit,
    didGenerateMnemonic: !!state.temp.initPage.mnemonic && !state.shared.didInit
  }
}

export default connect<InitPageProps, undefined, any>(mapStateToProps)(InitPage)
