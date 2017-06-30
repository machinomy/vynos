import * as React from "react";
import {connect} from "react-redux";
import {FrameState} from "../../state";
import RaisedButton from "material-ui/RaisedButton";

const motivationStyle = {
  textAlign: 'center',
  fontSize: '16px',
  fontFamily: ['Source Sans Pro', 'sans-serif'],
  marginTop: 20,
  marginBottom: 45
};

const touStyle = {
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

const buttonStyle = {
  boxShadow: null
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
    <div style={motivationStyle}>
      Ready to unlock a true value<br/>
      of quality content<br/>
      through <em>real</em> micropayments?
    </div>
    <div style={touStyle}>Read <a href="#" onClick={handleTouClick}>Terms of Use</a></div>
    <div style={BUTTON_CONTAINER_STYLE}>
      <RaisedButton label="ACCEPT" primary={true} style={buttonStyle} onTouchTap={onAcceptTerms} />
    </div>
  </div>
}

function mapStateToProps(state: FrameState): TermsSubpageProps {
  return {
  }
}

export default connect<TermsSubpageProps, undefined, any>(mapStateToProps)(TermsSubpage)
