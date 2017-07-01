import BackgroundController from "../worker/BackgroundController";
import {JSONRPC, RequestPayload} from "./Payload";
import {EndFunction} from "./StreamServer";
import {
  DidStoreMnemonicRequest, DidStoreMnemonicResponse,
  GenKeyringRequest, GenKeyringResponse, GetSharedStateRequest, GetSharedStateResponse, SetPageRequest,
  SetPageResponse
} from "./rpc/yns";
import {Writable} from "readable-stream";
import {SharedStateBroadcast, SharedStateBroadcastType} from "./rpc/SharedStateBroadcast";

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

  setPage(message: SetPageRequest, next: Function, end: EndFunction) {
    this.controller.setPage(message.params[0]).then(sharedState => {
      let response: SetPageResponse = {
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

  handler (message: RequestPayload, next: Function, end: EndFunction) {
    if (GetSharedStateRequest.match(message)) {
      this.getSharedState(message, next, end)
    } else if (SetPageRequest.match(message)) {
      this.setPage(message, next, end)
    } else if (GenKeyringRequest.match(message)) {
      this.genKeyring(message, next, end)
    } else if (DidStoreMnemonicRequest.match(message)) {
      this.didStoreMnemonic(message, next, end)
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
