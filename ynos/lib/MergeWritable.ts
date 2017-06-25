import {Writable} from "readable-stream";
import MergeStream from "./MergeStream";

export default class MergeWritable extends MergeStream<Writable> {
  _pipeStream(stream: Writable): void {
    console.log("MergeWritable", this._readableState.pipes);
    this.pipe(stream);
  }
}
