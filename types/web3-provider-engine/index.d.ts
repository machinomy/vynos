declare module "web3-provider-engine" {
  interface ProviderOpts {
    static?: {
      eth_syncing?: boolean
      web3_clientVersion?: string
    }
    rpcUrl?: string
    getAccounts?: Function
    approveTransaction?: Function
    signTransaction?: Function
    signMessage?: Function
    processTransaction?: Function
    processMessage?: Function
    processPersonalMessage?: Function
  }
  interface Engine {
    on(event: string, handler: Function): void;
  }
}

declare module "web3-provider-engine/zero" {
  import {ProviderOpts, Engine} from "web3-provider-engine"

  function ZeroClientProvider(opts: ProviderOpts): Engine

  export = ZeroClientProvider
}
