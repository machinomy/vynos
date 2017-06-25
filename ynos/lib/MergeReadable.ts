import {Readable} from "readable-stream";
import MergeStream from "./MergeStream";

export default class MergeReadable extends MergeStream<Readable> {
  _pipeStream(stream: Readable): void {
    console.log("MergeReadable", this._readableState.pipes);
    stream.pipe(this);
  }
}
