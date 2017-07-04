import BackgroundController from "./BackgroundController";
import {JSONRPC, RequestPayload} from "../../lib/Payload";
import {EndFunction} from "../../lib/StreamServer";
import {
  DidStoreMnemonicRequest, DidStoreMnemonicResponse,
  GenKeyringRequest, GenKeyringResponse, GetSharedStateRequest, GetSharedStateResponse, InitAccountRequest,
  InitAccountResponse,
  LockWalletRequest,
  LockWalletResponse,
  UnlockWalletRequest,
  UnlockWalletResponse
} from "../../lib/rpc/yns";
import {Writable} from "readable-stream";
import {SharedStateBroadcast, SharedStateBroadcastType} from "../../lib/rpc/SharedStateBroadcast";

export default class BackgroundHandler {
  controller: BackgroundController

  constructor(controller: BackgroundController) {
    this.controller = controller
    this.handler = this.handler.bind(this)
  }

  getSharedState(message: GetSharedStateRequest, next: Function, end: EndFunction) {
    this.controller.getSharedState().then(sharedState => {
      let response: GetSharedStateResponse = {
        id: message.id,
        jsonrpc: JSONRPC,
        result: sharedState
      }
      end(null, response)
    }).catch(end)
  }

  genKeyring(message: GenKeyringRequest, next: Function, end: EndFunction) {
    let password: string = message.params[0]
    this.controller.genKeyring(password).then((mnemonic: string) => {
      let response: GenKeyringResponse = {
        id: message.id,
        jsonrpc: message.jsonrpc,
        result: mnemonic
      }
      end(null, response)
    }).catch(end)
  }

  didStoreMnemonic(message: DidStoreMnemonicRequest, next: Function, end: EndFunction) {
    this.controller.didStoreMnemonic().then(() => {
      let response: DidStoreMnemonicResponse = {
        id: message.id,
        jsonrpc: message.jsonrpc,
        result: null
      }
      end(null, response)
    }).catch(end)
  }

  unlockWallet(message: UnlockWalletRequest, next: Function, end: EndFunction) {
    let password = message.params[0]
    this.controller.unlockWallet(password).then(() => {
      let response: UnlockWalletResponse = {
        id: message.id,
        jsonrpc: message.jsonrpc,
        result: null
      }
      end(null, response)
    }).catch(end)
  }

  lockWallet(message: LockWalletRequest, next: Function, end: EndFunction) {
    this.controller.lockWallet().then(() => {
      let response: LockWalletResponse = {
        id: message.id,
        jsonrpc: message.jsonrpc,
        result: null
      }
      end(null, response)
    }).catch(end)
  }

  initAccount(message: InitAccountRequest, next: Function, end: EndFunction) {
    this.controller.awaitUnlock(() => {
      let response: InitAccountResponse = {
        id: message.id,
        jsonrpc: message.jsonrpc,
        result: []
      }
      end(null, response)
    })
  }

  handler (message: RequestPayload, next: Function, end: EndFunction) {
    if (GetSharedStateRequest.match(message)) {
      this.getSharedState(message, next, end)
    } else if (GenKeyringRequest.match(message)) {
      this.genKeyring(message, next, end)
    } else if (DidStoreMnemonicRequest.match(message)) {
      this.didStoreMnemonic(message, next, end)
    } else if (UnlockWalletRequest.match(message)) {
      this.unlockWallet(message, next, end)
    } else if (LockWalletRequest.match(message)) {
      this.lockWallet(message, next, end)
    } else if (InitAccountRequest.match(message)) {
      this.initAccount(message, next, end)
    } else {
      next()
    }
  }

  broadcastSharedState(stream: Writable) {
    this.controller.didChangeSharedState(sharedState => {
      let message: SharedStateBroadcast = {
        id: SharedStateBroadcastType,
        jsonrpc: JSONRPC,
        result: sharedState
      }
      stream.write(message)
    })
  }
}
