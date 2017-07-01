import * as React from "react";
import {connect} from "react-redux";
import {FrameState} from "./state";
import InitPage from "./pages/init"
import WalletPage from "./pages/wallet"

export interface FrameApplicationProps {
  needInit: boolean
}

const FrameApplication: React.SFC<FrameApplicationProps> = (props) => {
  if (props.needInit) {
    return <InitPage />
  } else {
    return <WalletPage />
  }
}

function mapStateToProps(state: FrameState): FrameApplicationProps {
  return {
    needInit: !state.shared.didInit
  }
}

export default connect<FrameApplicationProps, undefined, any>(mapStateToProps)(FrameApplication)
