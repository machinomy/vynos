import StreamProvider from "../lib/StreamProvider";
import {EventEmitter} from "events";
import {SharedState} from "../worker/State";
import {JSONRPC, randomId} from "../lib/Payload";
import {isSharedStateBroadcast, SharedStateBroadcastType} from "../lib/rpc/SharedStateBroadcast";
import {
  DidStoreMnemonicRequest, DidStoreMnemonicResponse,
  GenKeyringRequest, GenKeyringResponse, GetSharedStateRequest, GetSharedStateResponse, LockWalletRequest,
  UnlockWalletRequest,
  UnlockWalletResponse
} from "../lib/rpc/yns";
import {Action} from "redux";
import Web3 from "web3";
import machinomy from "machinomy"
import {buildMachinomyClient} from "../lib/micropayments";

export default class WorkerProxy extends EventEmitter {
  stream: StreamProvider

  constructor() {
    super()
    this.stream = new StreamProvider("WorkerProxy")
    this.stream.listen(SharedStateBroadcastType, data => {
      if (isSharedStateBroadcast(data)) {
        this.emit(SharedStateBroadcastType, data)
      }
    })
  }

  getWeb3(): Web3 {
    let web3 = new Web3()
    web3.setProvider(this.stream)
    return web3
  }

  doLock(): Promise<void> {
    let request: LockWalletRequest = {
      id: randomId(),
      jsonrpc: JSONRPC,
      method: LockWalletRequest.method,
      params: []
    }
    return this.stream.ask(request).then(() => {
      return;
    })
  }

  doUnlock(password: string): Promise<void> {
    let request: UnlockWalletRequest = {
      id: randomId(),
      jsonrpc: JSONRPC,
      method: UnlockWalletRequest.method,
      params: [password]
    }
    return this.stream.ask(request).then(() => {
      return;
    })
  }

  getMachinomyClient(): Promise<machinomy.Sender> {
    return new Promise((resolve, reject) => {
      let web3 = this.getWeb3()
      return web3.eth.getAccounts((error, accounts) => {
        if (error) {
          reject(error)
        } else if (accounts.length === 0) {
          reject(new Error("No accounts found for machinomy to use"))
        } else {
          let account = accounts[0]
          let client = buildMachinomyClient(web3, account)
          resolve(client)
        }
      })
    })
  }

  genKeyring(password: string): Promise<string> {
    let request: GenKeyringRequest = {
      id: randomId(),
      jsonrpc: JSONRPC,
      method: GenKeyringRequest.method,
      params: [password]
    }
    return this.stream.ask(request).then((response: GenKeyringResponse) => {
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
    return this.stream.ask(request).then((response: GetSharedStateResponse) => {
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
    return this.stream.ask(request).then((response: DidStoreMnemonicResponse) => {
      return;
    })
  }

  dispatch<A extends Action>(action: A) {
    console.warn("WorkerProxy#dispatch", action)
  }
}
