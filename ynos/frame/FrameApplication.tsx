import * as React from "react";
import * as DOM from "react-dom";
import WorkerProxy from "./WorkerProxy";
import {SharedState} from "../worker/State";
import {SharedStateBroadcast, SharedStateBroadcastType} from "../lib/rpc/SharedStateBroadcast";

const MOUNT_POINT_ID = "mount-point"

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
    this.onSharedStateBroadcast = this.onSharedStateBroadcast.bind(this)
  }

  componentDidMount() {
    this.props.workerProxy.addListener(SharedStateBroadcastType, this.onSharedStateBroadcast)
  }

  onSharedStateBroadcast(data: SharedStateBroadcast) {
    console.log("onSharedStateBroadcast")
    this.setState({
      frameState: data.payload
    })
  }

  componentWillUnmount() {
    this.props.workerProxy.removeListener(SharedStateBroadcastType, this.onSharedStateBroadcast)
  }

  render () {
    let pageName = this.state.frameState.page.name
    return <p>FrameApplication: {pageName}</p>
  }
}

export function render(document: HTMLDocument, workerProxy: WorkerProxy) {
  let mountPoint = document.getElementById(MOUNT_POINT_ID)
  if (mountPoint) {
    workerProxy.getSharedState().then((frameState: SharedState) => {
      let element = React.createElement(FrameApplication, { workerProxy, frameState })
      DOM.render(element, mountPoint)
    })
  } else {
    console.error(`Can not find mount point element #${MOUNT_POINT_ID}`)
  }
}
