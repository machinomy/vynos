import BackgroundController from "./BackgroundController";
import { JSONRPC, RequestPayload } from "../../lib/Payload";
import { EndFunction } from "../../lib/StreamServer";
import {
  DidStoreMnemonicRequest, DidStoreMnemonicResponse,
  GenKeyringRequest, GenKeyringResponse, GetSharedStateRequest, GetSharedStateResponse, InitAccountRequest,
  InitAccountResponse,
  LockWalletRequest,
  LockWalletResponse, RestoreWalletRequest, RememberPageRequest,
  UnlockWalletRequest,
  UnlockWalletResponse, RememberPageResponse, TransactonResolved, ChangeNetworkRequest, ChangeNetworkResponse,
  GetPrivateKeyHexRequest, GetPrivateKeyHexResponse
} from "../../lib/rpc/yns";
import { Writable } from "readable-stream";
import { SharedStateBroadcast, SharedStateBroadcastType } from "../../lib/rpc/SharedStateBroadcast";
import NetworkController from "./NetworkController";

export default class BackgroundHandler {
  controller: BackgroundController

  constructor (controller: BackgroundController) {
    this.controller = controller
    this.handler = this.handler.bind(this)
  }

  getSharedState (message: GetSharedStateRequest, next: Function, end: EndFunction) {
    this.controller.getSharedState().then(sharedState => {
      let response: GetSharedStateResponse = {
        id: message.id,
        jsonrpc: JSONRPC,
        result: sharedState
      }
      end(null, response)
    }).catch(end)
  }

  genKeyring (message: GenKeyringRequest, next: Function, end: EndFunction) {
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

  restoreWallet (message: RestoreWalletRequest, next: Function, end: EndFunction) {
    let password: string = message.params[0]
    let mnemonic: string = message.params[1]
    this.controller.restoreWallet(password, mnemonic).then(() => {
      let response: GenKeyringResponse = {
        id: message.id,
        jsonrpc: message.jsonrpc,
        result: mnemonic
      }
      end(null, response)
    }).catch(end)
  }

  didStoreMnemonic (message: DidStoreMnemonicRequest, next: Function, end: EndFunction) {
    this.controller.didStoreMnemonic().then(() => {
      let response: DidStoreMnemonicResponse = {
        id: message.id,
        jsonrpc: message.jsonrpc,
        result: null
      }
      end(null, response)
    }).catch(end)
  }

  unlockWallet (message: UnlockWalletRequest, next: Function, end: EndFunction) {
    let password = message.params[0]
    this.controller.unlockWallet(password).then(() => {
      let response: UnlockWalletResponse = {
        id: message.id,
        jsonrpc: message.jsonrpc,
        result: null
      }
      end(null, response)
    }).catch(err => {
      if (err.message == 'Incorrect password') {
        let response: UnlockWalletResponse = {
          id: message.id,
          jsonrpc: message.jsonrpc,
          result: null,
          error: err.message
        }
        end(null, response)
      } else {
        end(err)
      }
    })
  }

  lockWallet (message: LockWalletRequest, next: Function, end: EndFunction) {
    this.controller.lockWallet().then(() => {
      let response: LockWalletResponse = {
        id: message.id,
        jsonrpc: message.jsonrpc,
        result: null
      }
      end(null, response)
    }).catch(end)
  }

  initAccount (message: InitAccountRequest, next: Function, end: EndFunction) {
    this.controller.awaitUnlock(() => {
      let response: InitAccountResponse = {
        id: message.id,
        jsonrpc: message.jsonrpc,
        result: []
      }
      end(null, response)
    })
  }

  rememberPage (message: RememberPageRequest, next: Function, end: EndFunction) {
    let path = message.params[0]
    this.controller.rememberPage(path)
    let response: RememberPageResponse = {
      id: message.id,
      jsonrpc: message.jsonrpc,
      result: null
    }
    end(null, response)
  }

  resolveTransaction (message: TransactonResolved, next: Function, end: EndFunction) {
    this.controller.resolveTransaction()
    end(null)
  }

changeNetwork (message: ChangeNetworkRequest, next: Function, end: EndFunction) {
    let response: ChangeNetworkResponse = {
      id: message.id,
      jsonrpc: message.jsonrpc,
      result: 'ok'
    }

    this.controller.changeNetwork().then(() => {
      end(null, response)
    }).catch(end)
  }

  getPrivateKeyHex(message: GetPrivateKeyHexRequest, next: Function, end: EndFunction) {
    this.controller.getPrivateKey().then((buffer: Buffer) => {
      let response: GetPrivateKeyHexResponse = {
        id: message.id,
        jsonrpc: message.jsonrpc,
        result: buffer.toString('hex')
      }
      end(null, response)
    }).catch(end)
  }

  handler (message: RequestPayload, next: Function, end: EndFunction) {
    if (GetSharedStateRequest.match(message)) {
      this.getSharedState(message, next, end)
    } else if (GenKeyringRequest.match(message)) {
      this.genKeyring(message, next, end)
    } else if (RestoreWalletRequest.match(message)) {
      this.restoreWallet(message, next, end)
    } else if (DidStoreMnemonicRequest.match(message)) {
      this.didStoreMnemonic(message, next, end)
    } else if (UnlockWalletRequest.match(message)) {
      this.unlockWallet(message, next, end)
    } else if (LockWalletRequest.match(message)) {
      this.lockWallet(message, next, end)
    } else if (InitAccountRequest.match(message)) {
      this.initAccount(message, next, end)
    } else if (RememberPageRequest.match(message)) {
      this.rememberPage(message, next, end)
    } else if (TransactonResolved.match(message)) {
      this.resolveTransaction(message, next, end)
    } else if (ChangeNetworkRequest.match(message)) {
      this.changeNetwork(message, next, end)
    } else if (GetPrivateKeyHexRequest.match(message)) {
      this.getPrivateKeyHex(message, next, end)
    } else {
      next()
    }
  }

  broadcastSharedState (stream: Writable) {
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
