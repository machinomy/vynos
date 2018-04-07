import BackgroundController from './BackgroundController'
import { JSONRPC, RequestPayload } from '../../lib/Payload'
import { EndFunction } from '../../lib/StreamServer'
import {
  DidStoreMnemonicRequest,
  DidStoreMnemonicResponse,
  GenKeyringRequest,
  GenKeyringResponse,
  GetSharedStateRequest,
  GetSharedStateResponse,
  InitAccountRequest,
  InitAccountResponse,
  LockWalletRequest,
  LockWalletResponse,
  RestoreWalletRequest,
  RememberPageRequest,
  UnlockWalletRequest,
  UnlockWalletResponse,
  RememberPageResponse,
  TransactonResolved,
  ChangeNetworkRequest,
  ChangeNetworkResponse,
  GetPrivateKeyHexRequest,
  GetPrivateKeyHexResponse,
  SetPreferencesRequest,
  SetPreferencesResponse,
  ClearTransactionMetastorageRequest,
  ClearReduxPersistentStorageRequest,
  ClearChannelMetastorageRequest
} from '../../lib/rpc/yns'
import { Writable } from 'readable-stream'
import { SharedStateBroadcast, SharedStateBroadcastType } from '../../lib/rpc/SharedStateBroadcast'
import {
  BuyProcessEventBroadcast,
  BuyProcessEvent,
  buyProcessEventBroadcastType
} from '../../lib/rpc/buyProcessEventBroadcast'
import { WalletBuyArguments } from '../../lib/Vynos'
import { ChannelMeta } from '../../lib/storage/ChannelMetaStorage'
import bus from '../../lib/bus'
import { DISPLAY_REQUEST } from '../../lib/constants'
import { DisplayRequestBroadcast, DisplayRequestBroadcastType } from '../../lib/rpc/DisplayRequestBroadcast'

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
    let type: string = message.params[1]
    let value: string = message.params[2]
    this.controller.restoreWallet(password, type, value).then((ok: boolean) => {
      let response: GenKeyringResponse = {
        id: message.id,
        jsonrpc: message.jsonrpc,
        result: ok.toString()
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
      if (err.message === 'Incorrect password') {
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

  getPrivateKeyHex (message: GetPrivateKeyHexRequest, next: Function, end: EndFunction) {
    this.controller.getPrivateKey().then((buffer: Buffer) => {
      let response: GetPrivateKeyHexResponse = {
        id: message.id,
        jsonrpc: message.jsonrpc,
        result: buffer.toString('hex')
      }
      end(null, response)
    }).catch(end)
  }

  setPreferences (message: SetPreferencesRequest, next: Function, end: EndFunction) {
    let preferences = message.params[0]
    this.controller.setPreferences(preferences).then(() => {
      let response: SetPreferencesResponse = {
        id: message.id,
        jsonrpc: message.jsonrpc,
        result: null
      }
      end(null, response)
    }).catch(end)
  }

  clearChannelMetastorage (message: ClearChannelMetastorageRequest, next: Function, end: EndFunction) {
    this.controller.clearChannelMetastorage()
    end(null)
  }

  clearTransactionMetastorage (message: ClearTransactionMetastorageRequest, next: Function, end: EndFunction) {
    this.controller.clearTransactionMetastorage()
    end(null)
  }

  clearReduxPersistentStorage (message: ClearReduxPersistentStorageRequest, next: Function, end: EndFunction) {
    this.controller.clearReduxPersistentStorage()
    end(null)
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
    } else if (SetPreferencesRequest.match(message)) {
      this.setPreferences(message, next, end)
    } else if (ClearChannelMetastorageRequest.match(message)) {
      this.clearChannelMetastorage(message, next, end)
    } else if (ClearTransactionMetastorageRequest.match(message)) {
      this.clearTransactionMetastorage(message, next, end)
    } else if (ClearReduxPersistentStorageRequest.match(message)) {
      this.clearReduxPersistentStorage(message, next, end)
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

  broadcastOnDisplayRequest (stream: Writable) {
    bus.on(DISPLAY_REQUEST, (isDisplay?: boolean) => {
      if (isDisplay === undefined) {
        isDisplay = true
      }
      let message: DisplayRequestBroadcast = {
        id: DisplayRequestBroadcastType,
        jsonrpc: JSONRPC,
        result: isDisplay
      }
      stream.write(message)
    })
  }

  broadcastBuyProcessEvent (stream: Writable) {
    this.controller.onBuyProcessEvent((typeOfMessage: BuyProcessEvent, args: WalletBuyArguments, token?: string, channel?: ChannelMeta) => {
      let message: BuyProcessEventBroadcast = {
        id: buyProcessEventBroadcastType,
        jsonrpc: JSONRPC,
        type: typeOfMessage,
        result: [args, token || '',
          channel ||
            {
              channelId: '',
              title: '',
              host: ''
            }]
      }
      stream.write(message)
    })
  }
}
