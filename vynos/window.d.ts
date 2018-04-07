import Namespace from './embed/Namespace'

export interface VynosWindow extends Window {
  vynos: Namespace,
  showVynosNotification: any
}

declare var window: VynosWindow
