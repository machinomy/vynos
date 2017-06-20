import React from "react";
import dnode, {Dnode} from "dnode/browser";
import FrameStream from "../lib/FrameStream";
import {Duplex} from "stream";

export default class FrameApp extends React.Component<undefined, undefined> {
  stream: Duplex;
  dnode: Dnode;

  constructor () {
    super();
    this.stream = new FrameStream("YNOS").toParent();
    this.dnode = dnode({
      initAccount: (callback: Function) => {
        callback();
      }
    });
    this.stream.pipe(this.dnode).pipe(this.stream);
  }

  render () {
    return <p>Hello, world!</p>
  }
}
