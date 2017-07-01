import * as React from "react";
import {connect} from "react-redux";
import browser from "../../lib/browser";
import RaisedButton from "material-ui/RaisedButton";
import actions from "../../actions";
import {Dispatch} from "react-redux";

export interface TermsComponentProps {
  onAcceptTerms: Function
}

const TERMS_OF_USE_ADDRESS = 'https://literatepayments.com';

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

const buttonStyle = {
  boxShadow: null
};

const BUTTON_CONTAINER_STYLE = {
  textAlign: 'center',
  top: '325px',
  width: '240px',
  //position: 'absolute'
};

export class TermsComponent extends React.Component<TermsComponentProps, undefined> {
  constructor (props: TermsComponentProps) {
    super(props);
    this.handleTouClick = this.handleTouClick.bind(this)
  }

  handleTouClick () {
    browser.tabs.create({ active: true, url: TERMS_OF_USE_ADDRESS })
  }

  render () {
    return <div>
      ffs
      <div style={motivationStyle}>
        Ready to unlock a true value<br/>
        of quality content<br/>
        through <em>real</em> micropayments?
      </div>
      <div style={touStyle}>Read <a href="#" onClick={this.handleTouClick}>Terms of Use</a></div>
      <div style={BUTTON_CONTAINER_STYLE}>
        <RaisedButton label="ACCEPT" primary={true} style={buttonStyle} onTouchTap={this.props.onAcceptTerms} />
      </div>
    </div>
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>): TermsComponentProps {
  return {
    onAcceptTerms: () => {
      // dispatch(actions.init.acceptTerms(new Date()))
    }
  }
}

export default connect<undefined, TermsComponentProps, any>(null, mapDispatchToProps)(TermsComponent)
