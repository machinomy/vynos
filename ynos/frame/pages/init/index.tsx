import * as React from "react";
import {connect} from "react-redux";
import {State} from "../../state";
import _ from "lodash";
import TermsComponent from "./TermsComponent";

export interface InitPageStateProps {
  didNotAcceptTerms: boolean;
  mnemonic?: string;
}

export type InitPageProps = InitPageStateProps;

type PasswordComponentProps = {
  onSetPassword: Function
}

class PasswordComponent extends React.Component<PasswordComponentProps, undefined> {
  render () {
    return <p>PasswordComponent</p>
  }
}

class SeedComponent extends React.Component<any, any> {
  render () {
    return <p>SeedComponent</p>
  }
}

export class InitPage extends React.Component<InitPageProps, any> {
  constructor(props: InitPageProps) {
    super(props)
  }

  handleSetPassword () {
    console.log("InitPage#handleSetPassword");
  }

  renderChild() {
    if (this.props.didNotAcceptTerms) {
      return React.createElement(TermsComponent);
    } else if (_.isEmpty(this.props.mnemonic)) {
      return React.createElement(PasswordComponent, {onSetPassword: this.handleSetPassword});
    } else if (this.props.mnemonic) {
      return <SeedComponent />
    } else {
      // @todo Error reporting
      return <p>Error: Impossible State</p>
    }
  }

  render() {
    return this.renderChild();
  }
}

function mapStateToProps (state: State): InitPageStateProps {
  return {
    didNotAcceptTerms: _.isEmpty(state.init.didAcceptTerms),
    mnemonic: state.runtime.mnemonic
  }
}

export default connect<InitPageProps, any, any>(mapStateToProps)(InitPage)
