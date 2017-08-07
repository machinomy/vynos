import {Ynos} from "./ynos";

export interface DevWindow extends Window {
  RPC_URL: string
}

export interface YnosWindow extends Window {
    ynos: Ynos
}

declare var window: DevWindow & YnosWindow;
