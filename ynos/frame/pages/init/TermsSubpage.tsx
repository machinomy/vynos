import * as React from "react";
import {connect} from "react-redux";
import {FrameState} from "../../state";
import RaisedButton from "../../theme/RaisedButton";

const MOTIVATION_STYLE = {
  textAlign: 'center',
  marginTop: 20,
  marginBottom: 45
};

const TOU_STYLE = {
  textAlign: 'center',
  fontSize: '16px',
  fontFamily: ['Source Sans Pro', 'sans-serif'],
};

const BUTTON_CONTAINER_STYLE = {
  textAlign: 'center',
  top: '325px',
  width: '240px',
  //position: 'absolute'
};

export interface TermsSubpageProps {
}

function handleTouClick() {
  console.log("handleTouClick")
}

function onAcceptTerms() {
  console.log("onAcceptTerms")
}

const TermsSubpage: React.SFC<TermsSubpageProps> = (props) => {
  return <div>
    ffs
    <div style={MOTIVATION_STYLE}>
      Ready to unlock a true value<br/>
      of quality content<br/>
      through <em>real</em> micropayments?
    </div>
    <div style={TOU_STYLE}>Read <a href="#" onClick={handleTouClick}>Terms of Use</a></div>
    <div style={BUTTON_CONTAINER_STYLE}>
      <RaisedButton label="Accept" primary={true} onTouchTap={onAcceptTerms} />
    </div>
  </div>
}

function mapStateToProps(state: FrameState): TermsSubpageProps {
  return {
  }
}

export default connect<TermsSubpageProps, undefined, any>(mapStateToProps)(TermsSubpage)
