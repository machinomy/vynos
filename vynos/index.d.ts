declare module 'vynos' {
  import Wallet from 'dist/types/vynos/embed/Wallet';
  declare let wallet: Wallet;
  export { WalletBuyArguments } from 'dist/types/vynos/lib/Vynos';
  export { BuyProcessEvent } from 'dist/types/vynos/lib/rpc/buyProcessEventBroadcast';
  export { ChannelMeta } from 'dist/types/vynos/lib/storage/ChannelMetaStorage';
  export { default as PromisedWalletResponse } from 'dist/types/vynos/lib/promised';
  export { default as VynosBuyResponse } from 'dist/types/vynos/lib/VynosBuyResponse';
  export default wallet;
}
