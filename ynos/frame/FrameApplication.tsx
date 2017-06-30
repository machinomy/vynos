import * as React from "react";
import {connect} from "react-redux";
import {FrameState} from "./state";
import any = jasmine.any;

export interface FrameApplicationProps {
  pageName: string
}

const FrameApplication: React.SFC<FrameApplicationProps> = (props) => {
  let pageName = props.pageName
  return <p>FrameApplication: {pageName}</p>
}

function mapStateToProps(state: FrameState): FrameApplicationProps {
  return {
    pageName: state.shared.page.name
  }
}

export default connect<FrameApplicationProps, undefined, any>(mapStateToProps)(FrameApplication)
