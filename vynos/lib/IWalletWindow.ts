import Wallet from '../embed/Wallet'

declare global {
  interface Window {
    signMessage: (message: string) => void
  }
}

export default interface IWalletWindow extends Window {
  vynos: Wallet,
  wallet: Wallet,
  showVynosNotification: any
}
