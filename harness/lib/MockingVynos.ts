import Vynos from '../../vynos/lib/Vynos'

export default interface MockingVynos extends Vynos {
  getPrivateKey: () => Promise<void>
  clearTransactionMetastorage: () => Promise<void>
  clearChannelMetastorage: () => Promise<void>
  clearReduxPersistentStorage: () => Promise<void>
  clearMachinomyStorage: () => Promise<void>
  clearAccountInfo: () => Promise<void>
}
