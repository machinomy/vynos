import BackgroundController from "../worker/BackgroundController";
import {JSONRPC, RequestPayload} from "./Payload";
import {EndFunction} from "./StreamServer";
import {GetSharedStateRequest, GetSharedStateResponse, SetPageRequest, SetPageResponse} from "./rpc/yns";
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
    }).catch(error => {
      end(error)
    })
  }

  setPage(message: SetPageRequest, next: Function, end: EndFunction) {
    this.controller.setPage(message.params[0]).then(sharedState => {
      let response: SetPageResponse = {
        id: message.id,
        jsonrpc: JSONRPC,
        result: sharedState
      }
      end(null, response)
    }).catch(error => {
      end(error)
    })
  }

  handler (message: RequestPayload, next: Function, end: EndFunction) {
    if (GetSharedStateRequest.match(message)) {
      this.getSharedState(message, next, end)
    } else if (SetPageRequest.match(message)) {
      this.setPage(message, next, end)
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
