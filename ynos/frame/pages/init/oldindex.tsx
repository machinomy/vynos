import * as React from "react";
import {connect} from "react-redux";
import {State} from "../../astate";
import _ from "lodash";
import TermsComponent from "./TermsComponent";
import PasswordComponent from "./PasswordComponent";
import SeedComponent from "./SeedComponent";
import bip39 from "bip39";
import {Dispatch} from "react-redux";
import actions from "../../actions";

export interface InitPageStateProps {
  didNotAcceptTerms: boolean;
  mnemonic?: string;
}

export interface InitPageDispatchProps {
  onSetMnemonic: (mnemonic: string, password: string) => void;
}

export type InitPageProps = InitPageStateProps & InitPageDispatchProps;

export class InitPage extends React.Component<InitPageProps, any> {
  constructor(props: InitPageProps) {
    super(props);
    this.handleSetPassword = this.handleSetPassword.bind(this);
  }

  handleSetPassword (password: string) {
    let mnemonic = bip39.generateMnemonic();
    console.log(this.props);
    this.props.onSetMnemonic(mnemonic, password);
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

function mapDispatchToProps(dispatch: Dispatch<any>): InitPageDispatchProps {
  return {
    onSetMnemonic: (mnemonic: string, password: string) => {
      dispatch(actions.runtime.setMnemonic(mnemonic));
      dispatch(actions.init.generateKeyring({mnemonic, password}));
    }
  }
}

export default connect<InitPageStateProps, InitPageDispatchProps, any>(mapStateToProps, mapDispatchToProps)(InitPage)
