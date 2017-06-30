import * as React from "react";
import {connect} from "react-redux";
import {FrameState} from "./state";
import InitPage from "./pages/init"

export interface FrameApplicationProps {
  didInit: boolean
}

const FrameApplication: React.SFC<FrameApplicationProps> = (props) => {
  if (props.didInit) {
    return <p>FrameApplication: didInit</p>
  } else {
    return <InitPage />
  }
}

function mapStateToProps(state: FrameState): FrameApplicationProps {
  return {
    didInit: state.shared.didInit
  }
}

export default connect<FrameApplicationProps, undefined, any>(mapStateToProps)(FrameApplication)
