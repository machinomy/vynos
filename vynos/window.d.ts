import Namespace from './inpage/Namespace'

export interface DevWindow extends Window {
  RPC_URL: string
}

export interface VynosWindow extends Window {
  vynos: Namespace,
  send: any,
  sign: any,
  showVynosNotification: any
}

declare var window: DevWindow & VynosWindow;
