import StreamProvider from "../lib/StreamProvider";
import {EventEmitter} from "events";
import {SharedState, Preferences} from "../worker/WorkerState";
import {JSONRPC, randomId} from "../lib/Payload";
import {isSharedStateBroadcast, SharedStateBroadcastType} from "../lib/rpc/SharedStateBroadcast";
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
  SetApproveByIdRequest, SetRejectByIdRequest,
  ClearTransactionMetastorageRequest, ClearReduxPersistentStorageRequest,
  ClearChannelMetastorageRequest
} from "../lib/rpc/yns";
import {Action} from "redux";
import Web3 = require("web3")

export default class WorkerProxy extends EventEmitter {
  provider: StreamProvider
  web3: Web3

  constructor() {
    super()
    this.provider = new StreamProvider("WorkerProxy")
    this.provider.listen(SharedStateBroadcastType, data => {
      if (isSharedStateBroadcast(data)) {
        this.emit(SharedStateBroadcastType, data)
      }
    })
    this.web3 = new Web3(this.provider)
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

  restoreWallet (password: string, type: string, value: string): Promise<string> {
    let request: RestoreWalletRequest = {
      id: randomId(),
      jsonrpc: JSONRPC,
      method: RestoreWalletRequest.method,
      params: [password, type, value]
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

  clearTransactionMetastorage(): void {
    let request: ClearTransactionMetastorageRequest = {
      id: randomId(),
      jsonrpc: JSONRPC,
      method: ClearTransactionMetastorageRequest.method,
      params: []
    }
    this.provider.ask(request).then(() => {})
  }

  clearChannelMetastorage(): void {
    let request: ClearChannelMetastorageRequest = {
      id: randomId(),
      jsonrpc: JSONRPC,
      method: ClearChannelMetastorageRequest.method,
      params: []
    }
    this.provider.ask(request).then(() => {})
  }

  clearReduxPersistentStorage(): void {
    let request: ClearReduxPersistentStorageRequest = {
      id: randomId(),
      jsonrpc: JSONRPC,
      method: ClearReduxPersistentStorageRequest.method,
      params: []
    }
    this.provider.ask(request).then(() => {})
  }

}
