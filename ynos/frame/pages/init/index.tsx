import * as React from "react";
import {connect} from "react-redux";
import {FrameState} from "../../state";
import TermsSubpage from "./TermsSubpage";
import PasswordSubpage from "./PasswordSubpage";

export interface InitPageProps {
  needAcceptTerms: boolean
  needSetPassword: boolean
  needStoreMnemonic: boolean
}

const InitPage: React.SFC<InitPageProps> = (props) => {
  if (props.needAcceptTerms) {
    return <TermsSubpage />
  } else if (props.needSetPassword) {
    return <PasswordSubpage />
  } else if (props.needStoreMnemonic) {
    return <p>Need to Store mnemonic</p>
  } else {
    return <p>InitPage</p>
  }
}

function mapStateToProps(state: FrameState): InitPageProps {
  return {
    needAcceptTerms: !state.temp.initPage.didAcceptTerms,
    needSetPassword: !state.temp.initPage.mnemonic,
    needStoreMnemonic: !state.temp.initPage.didStoreMnemonic
  }
}

export default connect<InitPageProps, undefined, any>(mapStateToProps)(InitPage)
