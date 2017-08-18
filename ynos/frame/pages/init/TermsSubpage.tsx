import * as React from "react";
import {connect, Dispatch} from "react-redux";
import {FrameState} from "../../state";
import actions from "../../actions";

const TERMS_OF_USE_ADDRESS = 'https://example.com';

//const style = require("../../styles/ynos.css")

export interface TermsSubpageStateProps {

}

export interface TermsSubpageDispatchProps {
  didAcceptTerms: () => void
}

type TermsSubpageProps = TermsSubpageDispatchProps & TermsSubpageStateProps

function handleTouClick() {
  window.open(TERMS_OF_USE_ADDRESS, '_blank')
}

const TermsSubpage: React.SFC<TermsSubpageProps> = (props) => {
  return <div>
    ffs
    <div className="initTermsMotivation">
      Ready to unlock a true value<br/>
      of quality content<br/>
      through <em>real</em> micropayments?
    </div>
    <div className="initTermsTermsLink">
      Read <a href="#" onClick={handleTouClick}>Terms of Use</a>
    </div>
    <div className="initTermsButtonContainer">
      <button onClick={props.didAcceptTerms}>Accept</button>
    </div>
  </div>
}

function mapStateToProps(state: FrameState): TermsSubpageStateProps {
  return {
  }
}

function mapDispatchToProps(dispatch: Dispatch<FrameState>): TermsSubpageDispatchProps {
  return {
    didAcceptTerms: () => dispatch(actions.temp.init.didAcceptTerms(true))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TermsSubpage)
