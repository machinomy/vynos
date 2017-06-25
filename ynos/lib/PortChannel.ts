import {PortStream} from "./PortStream";
import {Duplex} from "readable-stream";
import dnode from "dnode/browser";

const PUSH_PORT_EVENT_NAME = "PUSH_PORT";

export type OnRemoteCallback<R> = (remote: R) => void;

export default class PortChannel<S, R> {
  streams: Array<Duplex>;
  remotes: Array<R>;
  server: S;
  private _onRemote: OnRemoteCallback<R>|null;

  constructor (server: S) {
    this.server = server;
    this.remotes = [];
    this.streams = [];
    this._onRemote = null;
  }

  onRemote(callback: OnRemoteCallback<R>): void {
    this._onRemote = callback;
  }

  attach (port: MessagePort): void {
    let stream = new PortStream(port);
    this.streams.push(stream);
    let d = dnode(this.server);
    d.on("remote", (remote: R) => {
      this.remotes.push(remote);
      if (this._onRemote) this._onRemote(remote);
    });
    stream.pipe(d).pipe(stream);
  }

  proxy (fn: (remote: R) => void): void {
    this.remotes.forEach(fn);
  }

  registerServer(window: Window): void {
    window.addEventListener("message", event => {
      if (event.data === PUSH_PORT_EVENT_NAME) {
        let port = event.ports[0];
        this.attach(port);
      }
    })
  }

  registerClient(target: ServiceWorker): void {
    let channel = new MessageChannel();
    let targetPort = channel.port2;
    let myPort = channel.port1;
    target.postMessage("PUSH_PORT", [targetPort]);
    this.attach(myPort);
  }
}
