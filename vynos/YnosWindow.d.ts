import Vynos from './lib/Vynos'

export interface DevWindow extends Window {
  RPC_URL: string
}

export interface VynosWindow extends Window {
    vynos: Vynos
}

declare var window: DevWindow & VynosWindow;
