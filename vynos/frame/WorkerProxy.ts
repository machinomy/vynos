import StreamProvider from "../lib/StreamProvider";
import {EventEmitter} from "events";
import {SharedState, Preferences} from "../worker/WorkerState";
import {JSONRPC, randomId} from "../lib/Payload";
import {isSharedStateBroadcast, SharedStateBroadcast, SharedStateBroadcastType} from "../lib/rpc/SharedStateBroadcast";
import {
  DidStoreMnemonicRequest,
  GenKeyringRequest, GenKeyringResponse, GetSharedStateRequest, GetSharedStateResponse, LockWalletRequest,
  RestoreWalletRequest, RestoreWalletResponse, RememberPageRequest,
  UnlockWalletRequest,
  UnlockWalletResponse,
  TransactonResolved,
  ChangeNetworkRequest,
  GetPrivateKeyHexRequest, GetPrivateKeyHexResponse,
  SetPreferencesRequest,
  SetApproveByIdRequest, SetRejectByIdRequest
} from "../lib/rpc/yns";
import {Action} from "redux";
import Web3 = require("web3")
import events, {BuyOnSentPaymentBroadcastType} from '../lib/events'
import {WalletBuyArguments} from "../lib/Vynos";
import {BuyProcessEventBroadcastType, isBuyProcessEventBroadcast} from "../lib/rpc/buyProcessEventBroadcast";

export default class WorkerProxy extends EventEmitter {
  provider: StreamProvider
  web3: Web3
  buyProcessCallbacks: Map<string, (args: WalletBuyArguments) => void>

  constructor() {
    super()
    this.provider = new StreamProvider("WorkerProxy")
    this.provider.listen(SharedStateBroadcastType, data => {
      if (isSharedStateBroadcast(data)) {
        this.emit(SharedStateBroadcastType, data)
      }
    })

    this.provider.listen(BuyProcessEventBroadcastType, data=> {
      if (isBuyProcessEventBroadcast(data)) {
        switch (data.type) {
          case BuyOnSentPaymentBroadcastType: {
            if (this.buyProcessCallbacks.has(data.id)) {
              let callback = this.buyProcessCallbacks.get(data.id)
              callback!(data.args)
            }
          } break;

        }
      }

    })

    this.addListener(BuyOnSentPaymentBroadcastType, this.onSharedStateBroadcast.bind(this))
    this.web3 = new Web3(this.provider)
    this.buyProcessCallbacks = new Map<string, (args: WalletBuyArguments) => void>()
  }

  onSharedStateBroadcast(data: SharedStateBroadcast) {
    this.state = data.result
    this.eventEmitter.emit("update");
  }

  getWeb3(): Web3 {
    return new Web3(this.provider)
  }

  doLock(): Promise<void> {
    let request: LockWalletRequest = {
      id: randomId(),
      jsonrpc: JSONRPC,
      method: LockWalletRequest.method,
      params: []
    }
    return this.provider.ask(request).then(() => {
      return;
    })
  }

  doUnlock(password: string): Promise<string | undefined> {
    let request: UnlockWalletRequest = {
      id: randomId(),
      jsonrpc: JSONRPC,
      method: UnlockWalletRequest.method,
      params: [password]
    }
    return this.provider.ask(request).then((response: UnlockWalletResponse) => {
      return response.error
    })
  }

  genKeyring(password: string): Promise<string> {
    let request: GenKeyringRequest = {
      id: randomId(),
      jsonrpc: JSONRPC,
      method: GenKeyringRequest.method,
      params: [password]
    }
    return this.provider.ask(request).then((response: GenKeyringResponse) => {
      return response.result
    })
  }

  restoreWallet (password: string, mnemonic: string): Promise<string> {
    let request: RestoreWalletRequest = {
      id: randomId(),
      jsonrpc: JSONRPC,
      method: RestoreWalletRequest.method,
      params: [password, mnemonic]
    }
    return this.provider.ask(request).then((response: RestoreWalletResponse) => {
      return response.result
    })
  }

  getSharedState(): Promise<SharedState> {
    let request: GetSharedStateRequest = {
      id: randomId(),
      jsonrpc: JSONRPC,
      method: GetSharedStateRequest.method,
      params: []
    }
    return this.provider.ask(request).then((response: GetSharedStateResponse) => {
      return response.result
    })
  }

  didStoreMnemonic(): Promise<void> {
    let request: DidStoreMnemonicRequest = {
      id: randomId(),
      jsonrpc: JSONRPC,
      method: DidStoreMnemonicRequest.method,
      params: []
    }
    return this.provider.ask(request).then(() => {
      return;
    })
  }

  rememberPage(path: string): void {
    let request: RememberPageRequest = {
      id: randomId(),
      jsonrpc: JSONRPC,
      method: RememberPageRequest.method,
      params: [path]
    }
    this.provider.ask(request).then(() => {
      // Do Nothing
    })
  }

  resolveTransaction(): void {
    let request: TransactonResolved = {
      id: randomId(),
      jsonrpc: JSONRPC,
      method: TransactonResolved.method,
      params: []
    }
    this.provider.ask(request).then(() => {})
  }

  getPrivateKeyHex(): Promise<string> {
    let request: GetPrivateKeyHexRequest = {
      id: randomId(),
      jsonrpc: JSONRPC,
      method: GetPrivateKeyHexRequest.method,
      params: []
    }
    return this.provider.ask(request).then((response: GetPrivateKeyHexResponse) => {
      return response.result
    })
  }

  dispatch<A extends Action>(action: A) {
    console.warn("WorkerProxy#dispatch", action)
  }

  changeNetwork(): Promise<void> {
    let request: ChangeNetworkRequest = {
      id: randomId(),
      jsonrpc: JSONRPC,
      method: ChangeNetworkRequest.method,
      params: []
    }
    return this.provider.ask(request).then(() => {
      return;
    })
  }

  setPreferences(preferences: Preferences): Promise<void> {
    let request: SetPreferencesRequest = {
      id: randomId(),
      jsonrpc: JSONRPC,
      method: SetPreferencesRequest.method,
      params: [preferences]
    }

    return this.provider.ask(request).then(() => {
      return;
    })
  }

  setApproveById(id: string): void {
    let request: SetApproveByIdRequest = {
      id: randomId(),
      jsonrpc: JSONRPC,
      method: SetApproveByIdRequest.method,
      params: [id]
    }
    this.provider.ask(request).then(() => {
      // Do Nothing
    })
  }

  setRejectById(id: string): void {
    let request: SetRejectByIdRequest = {
      id: randomId(),
      jsonrpc: JSONRPC,
      method: SetRejectByIdRequest.method,
      params: [id]
    }
    this.provider.ask(request).then(() => {
      // Do Nothing
    })
  }
}
