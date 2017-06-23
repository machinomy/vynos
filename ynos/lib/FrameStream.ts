import PostStream from "./PostStream";
import duplexify from "duplexify";
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
        name: this.parentName(),
        target: this.childName(),
        targetWindow: frame.contentWindow
      });
      result.setWritable(postStream);
      result.setReadable(postStream)
    });
    return result
  }

  toParent (): Duplex {
    return new PostStream({
      name: this.childName(),
      target: this.parentName(),
      targetWindow: window.parent
    })
  }
}
