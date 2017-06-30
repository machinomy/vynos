import * as React from "react";
import {connect} from "react-redux";
import {FrameState} from "./state";
import InitPage from "./pages/init"
import ThemeProvider from "./components/ThemeProvider";

export interface FrameApplicationProps {
  didInit: boolean
}

function childPage(props: FrameApplicationProps) {
  if (props.didInit) {
    return <p>FrameApplication: didInit</p>
  } else {
    return <InitPage />
  }
}

const FrameApplication: React.SFC<FrameApplicationProps> = (props) => {
  return <ThemeProvider>
    {childPage(props)}
  </ThemeProvider>
}

function mapStateToProps(state: FrameState): FrameApplicationProps {
  return {
    didInit: state.shared.didInit
  }
}

export default connect<FrameApplicationProps, undefined, any>(mapStateToProps)(FrameApplication)
