import Namespace from './inpage/Namespace'

export interface VynosWindow extends Window {
  vynos: Namespace,
  showVynosNotification: any
}

declare var window: VynosWindow
