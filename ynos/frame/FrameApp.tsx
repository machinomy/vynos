import * as React from "react";
import dnode, {Dnode} from "dnode/browser";
import ThemeProvider from "./components/ThemeProvider";
import {Duplex} from "stream";
import {connect} from "react-redux";
import routing from "./lib/routing";
import {State} from "./state";
import {RouteElement} from "little-router";
import _ from "lodash";
import InitPage from "./pages/init";
import UnlockPage from "./pages/UnlockPage";
import WalletPage from "./pages/wallet/index";

export interface FrameAppProps {
  pageComponent: React.ComponentClass<any>;
  stream: Duplex;
  state: State;
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

const ROUTES: Array<RouteElement> = [
  { path: '/', component: WalletPage },
  { path: '/wallet/*', component: WalletPage },
  { path: '/channels/*', component: ChannelsPage },
  { path: '/preferences/*', component: PreferencesPage },
];

export class FrameApp extends React.Component<FrameAppProps, undefined> {
  stream: Duplex;
  dnode: Dnode;

  constructor (props: FrameAppProps) {
    super(props);
    this.stream = props.stream;
    this.dnode = dnode({
      initAccount: (callback: Function) => {
        callback();
      },
      getAccount: (callback: Function) => {
        if (this.props.state.runtime.wallet) {
          let wallet = this.props.state.runtime.wallet;
          let address = wallet.getAddressString();
          callback(null, address);
        } else {
          callback(new Error("No wallet yet"), null);
        }
      }
    });
    this.stream.pipe(this.dnode).pipe(this.stream);
  }

  componentWillUnmount () {
    this.dnode.end();
  }

  render () {
    let childPage = React.createElement(this.props.pageComponent);
    return <ThemeProvider>
      {childPage}
    </ThemeProvider>
  }
}

function mapStateToProps(state: State, ownProps: FrameAppProps): FrameAppProps {
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
    pageComponent: pageComponent,
    stream: ownProps.stream,
    state: state
  }
}

export default connect<FrameAppProps, any, any>(mapStateToProps)(FrameApp)
