import * as React from "react";
import {connect} from "react-redux";
import {FrameState} from "../../state";
import TermsSubpage from "./TermsSubpage"

export interface InitPageProps {
  needAcceptTerms: boolean
}

const InitPage: React.SFC<InitPageProps> = (props) => {
  if (props.needAcceptTerms) {
    return <TermsSubpage />
  } else {
    return <p>InitPage</p>
  }
}

function mapStateToProps(state: FrameState): InitPageProps {
  return {
    needAcceptTerms: !state.temp.initPage.didAcceptTerms
  }
}

export default connect<InitPageProps, undefined, any>(mapStateToProps)(InitPage)
