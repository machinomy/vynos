import {PortStream} from "./PortStream";
import Duplexify from "duplexify";
import MergeReadable from "./MergeReadable";
import MergeWritable from "./MergeWritable";

const PUSH_PORT_EVENT_NAME = "PUSH_PORT";

export default class APortChannel extends Duplexify {
  source: MergeReadable;
  sink: MergeWritable;

  constructor () {
    super();
    this.source = new MergeReadable();
    this.sink = new MergeWritable();
    this.setWritable(this.sink);
    this.setReadable(this.source);
  }

  attach (port: MessagePort): void {
    console.log("attach");
    let stream = new PortStream(port);
    console.log("stream");
    this.sink.add(stream);
    console.log("sink");
    this.source.add(stream);
    console.log("source");
  }

  registerServer(window: Window): void {
    window.addEventListener("message", event => {
      console.log("GOT MESSAGE", event.data.toString());
      if (event.data === PUSH_PORT_EVENT_NAME) {
        let port = event.ports[0];
        this.attach(port);
      }
    }, false)
  }

  registerClient(target: ServiceWorker): void {
    let channel = new MessageChannel();
    let targetPort = channel.port2;
    let myPort = channel.port1;
    target.postMessage(PUSH_PORT_EVENT_NAME, [targetPort]);
    this.attach(myPort);
  }
}
