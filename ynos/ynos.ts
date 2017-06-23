import {DevWindow, YnosWindow} from "./YnosWindow";
import {Duplex} from "stream";
import FrameStream from "./lib/FrameStream";
import dnode from "dnode/browser";

let _window = (<DevWindow & YnosWindow>window);

export interface Ynos {
  getAccount: () => Promise<string>
  openChannel: () => void
  depositToChannel: () => void
  closeChannel: () => void
  listChannels: () => void
  makePayment: () => void
  payInChannel: () => void
  initAccount: () => Promise<void>
  initFrame: () => Promise<void>
}

class YnosImpl implements Ynos {
  frame: HTMLElement;
  stream: Duplex;
  remote: any;

  getAccount (): Promise<string> {
    return new Promise((resolve, reject) => {
      this.remote.getAccount((error: string, address: string) => {
        if (error) {
          reject(error);
        } else {
          resolve(address);
        }
      })
    })
  }

  openChannel () {

  }

  closeChannel () {

  }

  listChannels () {

  }

  makePayment () {

  }

  payInChannel () {

  }

  depositToChannel (): void {

  }

  initAccount (): Promise<void> {
    if (!this.remote) return Promise.reject(new Error("Do initFrame first"));

    return new Promise<void>((resolve, reject) => {
      this.remote.initAccount(resolve)
    });
  }

  initFrame (): Promise<void> {
    if (this.frame) return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
      try {
        let frame = document.createElement('iframe');
        frame.id = 'ynos_frame';
        frame.src = _window.FRAME_URL;
        frame.style.borderWidth = '0px';
        frame.style.position = 'fixed';
        frame.style.top = '0px';
        frame.style.right = '0px';
        frame.style.bottom = '0px';
        frame.height = '100%';
        frame.width = '320px';
        //frame.style.marginRight = '-320px';
        frame.setAttribute("sandbox", "allow-scripts allow-modals allow-same-origin");
        this.frame = frame;
        let stream = new FrameStream('YNOS');
        this.stream = stream.toFrame(frame);

        document.body.appendChild(this.frame);

        let d = dnode();
        this.stream.pipe(d).pipe(this.stream);
        d.on("remote", (remote: any) => {
          this.remote = remote;
          resolve();
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}

let ynosPresent = _window.ynos && _window.ynos instanceof YnosImpl;
if (!ynosPresent) {
  _window.ynos = new YnosImpl();
}
