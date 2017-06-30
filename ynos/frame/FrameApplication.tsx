import * as React from "react";
import WorkerProxy from "./WorkerProxy";
import {SharedState} from "../worker/State";

export interface FrameApplicationProps {
  workerProxy: WorkerProxy
  frameState: SharedState
}

export interface FrameApplicationState {
  frameState: SharedState
}

export default class FrameApplication extends React.Component<FrameApplicationProps, FrameApplicationState> {
  constructor(props: FrameApplicationProps) {
    super(props)
    this.state = {
      frameState: this.props.frameState
    }
  }

  render () {
    let pageName = this.state.frameState.page.name
    return <p>FrameApplication: {pageName}</p>
  }
}
