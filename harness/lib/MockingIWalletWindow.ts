import { default as MockingWallet } from '../embed/MockingWallet'

export default interface MockingIWalletWindow extends Window {
  vynos: MockingWallet,
  wallet: MockingWallet,
  showVynosNotification: any
}
