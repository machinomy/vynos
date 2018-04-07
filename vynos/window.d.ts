import Wallet from './embed/Wallet'

export interface VynosWindow extends Window {
  vynos: Wallet,
  showVynosNotification: any
}

declare var window: VynosWindow
