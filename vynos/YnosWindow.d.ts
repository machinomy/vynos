import {Vynos} from "./vynos";

export interface DevWindow extends Window {
  RPC_URL: string
}

export interface VynosWindow extends Window {
    ynos: Vynos
}

declare var window: DevWindow & VynosWindow;
