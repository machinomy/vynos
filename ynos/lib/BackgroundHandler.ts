import BackgroundController from "../worker/BackgroundController";
import {JSONRPC, RequestPayload} from "./Payload";
import {EndFunction} from "./StreamServer";
import {GetSharedStateRequest, GetSharedStateResponse} from "./rpc/yns";

export default class BackgroundHandler {
  controller: BackgroundController

  constructor(controller: BackgroundController) {
    this.controller = controller
    this.handler = this.handler.bind(this)
  }

  handler (message: RequestPayload, next: Function, end: EndFunction) {
    if (GetSharedStateRequest.match(message)) {
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
    next()
  }
}
