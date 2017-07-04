import * as React from "react";
import {connect} from "react-redux";
import {FrameState} from "./state";
import InitPage from "./pages/init"
import WalletPage from "./pages/wallet"

export interface FrameApplicationProps {
  isInitPageExpected: boolean
  isWalletPageExpected: boolean
}

const FrameApplication: React.SFC<FrameApplicationProps> = (props) => {
  if (props.isInitPageExpected) {
    return <InitPage />
  } else if (props.isWalletPageExpected) {
    return <WalletPage />
  } else {
    return <p>Waiting...</p>
  }
}

function mapStateToProps(state: FrameState): FrameApplicationProps {
  return {
    isInitPageExpected: !(state.shared.didInit),
    isWalletPageExpected: !!(state.temp.web3)
  }
}

export default connect<FrameApplicationProps, undefined, any>(mapStateToProps)(FrameApplication)
