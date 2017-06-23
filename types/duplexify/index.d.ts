declare module "duplexify" {
  import {Duplex, Readable, Writable} from "readable-stream";

  class AsyncDuplex extends Duplex {
    setReadable(stream: Readable): void;
    setWritable(stream: Writable): void;
  }

  export function obj(): AsyncDuplex;
}
