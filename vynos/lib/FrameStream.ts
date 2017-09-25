import PostStream from "./PostStream";
import duplexify = require("duplexify");
import {Duplex} from "readable-stream";

export default class FrameStream {
  name: string;

  constructor (name?: string) {
    this.name = name || "frame"
  }

  parentName () {
    return `${this.name}-parent`
  }

  childName () {
    return `${this.name}-child`
  }

  toFrame (frame: HTMLIFrameElement): Duplex {
    let result = duplexify.obj();
    frame.addEventListener("load", () => {
      let postStream = new PostStream({
        sourceName: this.parentName(),
        targetName: this.childName(),
        target: frame.contentWindow
      });
      result.setWritable(postStream);
      result.setReadable(postStream)
    });
    return result
  }

  toParent (): Duplex {
    return new PostStream({
      sourceName: this.childName(),
      targetName: this.parentName(),
      target: window.parent
    })
  }
}
