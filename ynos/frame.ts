import FrameStream from "./lib/FrameStream";
import dnode from "dnode/browser";

window.addEventListener("load", () => {
  let stream = new FrameStream("YNOS").toParent();
  let d = dnode({
    initAccount: (callback: Function) => {
      callback();
    }
  });
  stream.pipe(d).pipe(stream);
});
