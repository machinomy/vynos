import {Duplex} from "readable-stream";
import IBackgroundController from "./IBackgroundController";

export default class BackgroundController implements IBackgroundController {
  constructor() {
  }

  hello(world: string): Promise<string> {
    return Promise.resolve(`Hello from BackgroundController, ${world}`)
  }
}
