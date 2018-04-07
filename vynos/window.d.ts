import Namespace from './inpage/Namespace'

export interface DevWindow extends Window {
  signMessage: (message: string) => void
}

export interface VynosWindow extends Window {
  vynos: Namespace,
  showVynosNotification: any
}

declare var window: DevWindow & VynosWindow
