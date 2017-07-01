import * as React from "react";
import {connect} from "react-redux";
import {FrameState} from "../../state";
import TermsSubpage from "./TermsSubpage";
import PasswordSubpage from "./PasswordSubpage";
import MnemonicSubpage from "./MnemonicSubpage";

export interface InitPageProps {
  needAcceptTerms: boolean
  needSetPassword: boolean
}

const InitPage: React.SFC<InitPageProps> = (props) => {
  if (props.needAcceptTerms) {
    return <TermsSubpage />
  } else if (props.needSetPassword) {
    return <PasswordSubpage />
  } else {
    return <MnemonicSubpage />
  }
}

function mapStateToProps(state: FrameState): InitPageProps {
  return {
    needAcceptTerms: !state.temp.initPage.didAcceptTerms,
    needSetPassword: !state.temp.initPage.mnemonic,
  }
}

export default connect<InitPageProps, undefined, any>(mapStateToProps)(InitPage)
