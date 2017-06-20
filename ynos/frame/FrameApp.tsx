import * as React from "react";
import dnode, {Dnode} from "dnode/browser";
import FrameStream from "../lib/FrameStream";
import ThemeProvider from "./components/ThemeProvider";
import {Duplex} from "stream";
import { connect } from "react-redux";
import routing from "./lib/routing";
import {State} from "./state";
import {RouteElement} from "little-router";
import _ from "lodash";

export interface FrameAppProps {
  pageComponent: React.ComponentClass<any>
}

class WalletPage extends React.Component<any, any> {
  render() {
    return <p>WalletPage</p>
  }
}

class ChannelsPage extends React.Component<any, any> {
  render() {
    return <p>ChannelsPage</p>
  }
}

class PreferencesPage extends React.Component<any, any> {
  render() {
    return <p>PreferencesPage</p>
  }
}

class InitPage extends React.Component<any, any> {
  render() {
    return <p>InitPage</p>
  }
}

class UnlockPage extends React.Component<any, any> {
  render() {
    return <p>UnlockPage</p>
  }
}

const ROUTES: Array<RouteElement> = [
  { path: '/', component: WalletPage },
  { path: '/wallet/*', component: WalletPage },
  { path: '/channels/*', component: ChannelsPage },
  { path: '/preferences/*', component: PreferencesPage },
];

function mapStateToProps(state: State): FrameAppProps {
  let isKeyringPresent = !_.isEmpty(state.init.keyring);
  let needInit = !(state.init.didAcceptTerms && isKeyringPresent && state.init.didStoreSeed);

  let pageComponent = null;
  if (needInit) {
    pageComponent = InitPage
  } else if (_.isEmpty(state.runtime.wallet)) {
    pageComponent = UnlockPage
  } else {
    let location = routing.location(state);
    pageComponent = routing.match(ROUTES, location).component
  }

  return {
    pageComponent: pageComponent
  }
}

export class FrameApp extends React.Component<FrameAppProps, undefined> {
  constructor () {
    super();
    /*
    this.stream = new FrameStream("YNOS").toParent();
    this.dnode = dnode({
      initAccount: (callback: Function) => {
        callback();
      }
    });
    this.stream.pipe(this.dnode).pipe(this.stream);
    */
  }

  render () {
    let childPage = React.createElement(this.props.pageComponent);
    return <ThemeProvider>
      {childPage}
    </ThemeProvider>
  }
}

export default connect<FrameAppProps, any, any>(mapStateToProps)(FrameApp)
