import {Ynos} from "./ynos";

export interface DevWindow extends Window {
  FRAME_URL: string
  RPC_URL: string
}

export interface YnosWindow extends Window {
    ynos: Ynos
}

declare var window: DevWindow & YnosWindow;
