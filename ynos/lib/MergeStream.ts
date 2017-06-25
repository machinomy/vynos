import {Duplex, PassThrough, Readable, Stream, Writable, WritableStream} from "readable-stream";

abstract class MergeStream<S extends Stream> extends PassThrough {
  streams: Array<S>;

  abstract _pipeStream(stream: S): void;

  constructor (...streams: Array<S>) {
    super({objectMode: true});
    this.streams = [];
    this.setMaxListeners(0);
    this.on('unpipe', this.remove.bind(this));

    streams.forEach(s => {
      this.add(s)
    });
  }

  add (stream: S|Array<S>): this {
    console.log("MergeStream#add", stream);
    if (Array.isArray(stream)) {
      stream.forEach(this.add.bind(this));
      return this;
    }

    this.streams.push(stream);

    stream.once("end", () => {
      this.remove(stream);
    });
    stream.once("error", () => {
      this.emit("error");
    });
    this._pipeStream(stream);
    return this;
  }

  isEmpty (): boolean {
    return this.streams.length === 0;
  }

  remove (stream: Stream): this {
    this.streams = this.streams.filter(s => s !== stream );

    if (!this.streams.length && this.readable) { this.end() }
    return this;
  }
}

export default MergeStream
