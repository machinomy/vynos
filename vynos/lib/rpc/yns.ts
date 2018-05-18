import { JSONRPC, RequestPayload, ResponsePayload } from '../Payload'
import { SharedState, Preferences } from '../../worker/WorkerState'
import { SerializedPaymentChannel } from 'machinomy/dist/lib/PaymentChannel'
import VynosBuyResponse from '../VynosBuyResponse'
import PurchaseMeta from '../PurchaseMeta'

export class InitAccountRequest implements RequestPayload {
  static method = 'yns_initAccount'

  id: number
  jsonrpc: typeof JSONRPC
  method: typeof InitAccountRequest.method
  params: any[]

  constructor () {
    this.id = -1
    this.jsonrpc = ''
    this.method = ''
    this.params = ['']
  }

  static match (payload: RequestPayload): payload is InitAccountRequest {
    return payload.method === InitAccountRequest.method
  }
}

export interface InitAccountResponse extends ResponsePayload {
  result: string[]
}

export class GetSharedStateRequest implements RequestPayload {
  static method: string = 'yns_getSharedState'

  id: number
  jsonrpc: typeof JSONRPC
  method: typeof GetSharedStateRequest.method
  params: any[]

  constructor () {
    this.id = -1
    this.jsonrpc = ''
    this.method = ''
    this.params = ['']
  }

  static match (payload: RequestPayload): payload is GetSharedStateRequest {
    return payload.method === GetSharedStateRequest.method
  }
}

export interface GetSharedStateResponse extends ResponsePayload {
  result: SharedState
}

export class DidStoreMnemonicRequest implements RequestPayload {
  static method: string = 'yns_didStoreMnemonic'

  id: number
  jsonrpc: typeof JSONRPC
  method: typeof DidStoreMnemonicRequest.method
  params: any[]

  constructor () {
    this.id = -1
    this.jsonrpc = ''
    this.method = ''
    this.params = ['']
  }

  static match (payload: RequestPayload): payload is DidStoreMnemonicRequest {
    return payload.method === DidStoreMnemonicRequest.method
  }
}

export interface DidStoreMnemonicResponse extends ResponsePayload {
  result: null
}

export class RememberPageRequest implements RequestPayload {
  static method: string = 'yns_rememberPage'

  id: number
  jsonrpc: typeof JSONRPC
  method: typeof RememberPageRequest.method
  params: [string]

  constructor () {
    this.id = -1
    this.jsonrpc = ''
    this.method = ''
    this.params = ['']
  }

  static match (payload: RequestPayload): payload is RememberPageRequest {
    return payload.method === RememberPageRequest.method
  }
}

export interface RememberPageResponse extends ResponsePayload {
  result: null
}

export class GenKeyringRequest implements RequestPayload {
  static method = 'yns_genKeyring'

  id: number
  jsonrpc: typeof JSONRPC
  method: typeof GenKeyringRequest.method
  params: string[]

  constructor () {
    this.id = -1
    this.jsonrpc = ''
    this.method = ''
    this.params = ['']
  }

  static match (payload: RequestPayload): payload is GenKeyringRequest {
    return payload.method === GenKeyringRequest.method
  }
}

export interface GenKeyringResponse extends ResponsePayload {
  result: string
}

// RestoreWalletRequest

export class RestoreWalletRequest implements RequestPayload {
  static method = 'yns_restoreWallet'

  id: number
  jsonrpc: typeof JSONRPC
  method: typeof RestoreWalletRequest.method
  params: [string, string, string]

  constructor () {
    this.id = -1
    this.jsonrpc = ''
    this.method = ''
    this.params = ['', '', '']
  }

  static match (payload: RequestPayload): payload is RestoreWalletRequest {
    return payload.method === RestoreWalletRequest.method
  }
}

export interface RestoreWalletResponse extends ResponsePayload {
  result: string
}

export class UnlockWalletRequest implements RequestPayload {
  static method = 'yns_unlockWallet'

  id: number
  jsonrpc: typeof JSONRPC
  method: typeof UnlockWalletRequest.method
  params: string[]

  constructor () {
    this.id = -1
    this.jsonrpc = ''
    this.method = ''
    this.params = ['']
  }

  static match (payload: RequestPayload): payload is UnlockWalletRequest {
    return payload.method === UnlockWalletRequest.method
  }
}

export interface UnlockWalletResponse extends ResponsePayload {
  result: null
  error?: string
}

export class LockWalletRequest implements RequestPayload {
  static method = 'yns_lockWallet'

  id: number
  jsonrpc: typeof JSONRPC
  method: typeof LockWalletRequest.method
  params: string[]

  constructor () {
    this.id = -1
    this.jsonrpc = ''
    this.method = ''
    this.params = ['']
  }

  static match (payload: RequestPayload): payload is LockWalletRequest {
    return payload.method === LockWalletRequest.method
  }
}

export interface LockWalletResponse extends ResponsePayload {
  result: null
}

export class OpenChannelRequest implements RequestPayload {
  static method = 'yns_openChannel'

  id: number
  jsonrpc: typeof JSONRPC
  method: typeof OpenChannelRequest.method
  params: [string, string]

  constructor () {
    this.id = -1
    this.jsonrpc = ''
    this.method = ''
    this.params = ['', '']
  }

  static match (payload: RequestPayload): payload is OpenChannelRequest {
    return payload.method === OpenChannelRequest.method
  }
}

export interface OpenChannelResponse extends ResponsePayload {
  result: [SerializedPaymentChannel]
}

export class CloseChannelRequest implements RequestPayload {
  static method = 'yns_closeChannel'

  id: number
  jsonrpc: typeof JSONRPC
  method: typeof CloseChannelRequest.method
  params: [string]

  constructor () {
    this.id = -1
    this.jsonrpc = ''
    this.method = ''
    this.params = ['']
  }

  static match (payload: RequestPayload): payload is CloseChannelRequest {
    return payload.method === CloseChannelRequest.method
  }
}

export interface CloseChannelResponse extends ResponsePayload {
  result: [string]
}

export class BuyRequest implements RequestPayload {
  static method = 'yns_buyRequest'

  id: number
  jsonrpc: typeof JSONRPC
  method: typeof BuyRequest.method
  params: [string, number, string, string, PurchaseMeta, number]

  constructor () {
    this.id = -1
    this.jsonrpc = ''
    this.method = ''
    this.params = ['', -1, '', '',
      {
        title: '',
        description: '',
        siteName: '',
        url: '',
        origin: ''
      }, -1]
  }

  static match (payload: RequestPayload): payload is BuyRequest {
    return payload.method === BuyRequest.method
  }
}

export class TransactonResolved implements RequestPayload {
  static method = 'yns_transactionResolved'

  id: number
  jsonrpc: typeof JSONRPC
  method: typeof TransactonResolved.method
  params: never[]

  constructor () {
    this.id = -1
    this.jsonrpc = ''
    this.method = ''
    this.params = []
  }

  static match (payload: RequestPayload): payload is TransactonResolved {
    return payload.method === TransactonResolved.method
  }
}

export interface BuyResponse extends ResponsePayload {
  result: [VynosBuyResponse]
}

export class ListChannelsRequest implements RequestPayload {
  static method = 'yns_listChannels'

  id: number
  jsonrpc: typeof JSONRPC
  method: typeof ListChannelsRequest.method
  params: any[]

  constructor () {
    this.id = -1
    this.jsonrpc = ''
    this.method = ''
    this.params = ['']
  }

  static match (payload: RequestPayload): payload is ListChannelsRequest {
    return payload.method === ListChannelsRequest.method
  }
}

export interface ListChannelsResponse extends ResponsePayload {
  result: Array<SerializedPaymentChannel>
}

export class ChangeNetworkRequest implements RequestPayload {
  static method: string = 'yns_ChangeNetwork'

  id: number
  jsonrpc: typeof JSONRPC
  method: typeof ChangeNetworkRequest.method
  params: any[]

  constructor () {
    this.id = -1
    this.jsonrpc = ''
    this.method = ''
    this.params = ['']
  }

  static match (payload: RequestPayload): payload is ChangeNetworkRequest {
    return payload.method === ChangeNetworkRequest.method
  }
}

export interface ChangeNetworkResponse extends ResponsePayload {
  result: string
}

export class GetPrivateKeyHexRequest implements RequestPayload {
  static method = 'yns_getPrivateKeyHex'

  id: number
  jsonrpc: typeof JSONRPC
  method: typeof GetPrivateKeyHexRequest.method
  params: never[]

  constructor () {
    this.id = -1
    this.jsonrpc = ''
    this.method = ''
    this.params = []
  }

  static match (payload: RequestPayload): payload is GetPrivateKeyHexRequest {
    return payload.method === GetPrivateKeyHexRequest.method
  }
}

export interface GetPrivateKeyHexResponse extends ResponsePayload {
  result: string
}

export class SetPreferencesRequest implements RequestPayload {
  static method = 'yns_setPreferences'

  id: number
  jsonrpc: typeof JSONRPC
  method: typeof SetPreferencesRequest.method
  params: [Preferences]

  constructor () {
    this.id = -1
    this.jsonrpc = ''
    this.method = ''
    this.params = [
      {
        micropaymentThreshold: -1,
        micropaymentThrottlingHumanReadable: '',
        currency: ''
      }
    ]
  }

  static match (payload: RequestPayload): payload is SetPreferencesRequest {
    return payload.method === SetPreferencesRequest.method
  }
}

export interface SetPreferencesResponse extends ResponsePayload {
  result: null
}

export class SetApproveByIdRequest implements RequestPayload {
  static method: string = 'yns_setApproveByIdRequest'

  id: number
  jsonrpc: typeof JSONRPC
  method: typeof SetApproveByIdRequest.method
  params: [string]

  constructor () {
    this.id = -1
    this.jsonrpc = ''
    this.method = ''
    this.params = ['']
  }

  static match (payload: RequestPayload): payload is SetApproveByIdRequest {
    return payload.method === SetApproveByIdRequest.method
  }
}

export interface SetApproveByIdResponse extends ResponsePayload {
  result: null
}

export class SetRejectByIdRequest implements RequestPayload {
  static method: string = 'yns_setRejectByIdRequest'

  id: number
  jsonrpc: typeof JSONRPC
  method: typeof SetRejectByIdRequest.method
  params: [string]

  constructor () {
    this.id = -1
    this.jsonrpc = ''
    this.method = ''
    this.params = ['']
  }

  static match (payload: RequestPayload): payload is SetRejectByIdRequest {
    return payload.method === SetRejectByIdRequest.method
  }
}

export interface SetRejectByIdResponse extends ResponsePayload {
  result: null
}

export class ClearTransactionMetastorageRequest implements RequestPayload {
  static method = 'yns_clearTransactionMetastorageRequest'

  id: number
  jsonrpc: typeof JSONRPC
  method: typeof ClearTransactionMetastorageRequest.method
  params: never[]

  constructor () {
    this.id = -1
    this.jsonrpc = ''
    this.method = ''
    this.params = []
  }

  static match (payload: RequestPayload): payload is ClearTransactionMetastorageRequest {
    return payload.method === ClearTransactionMetastorageRequest.method
  }
}

export interface ClearTransactionMetastorageResponse extends ResponsePayload {
  result: null
}

export class ClearChannelMetastorageRequest implements RequestPayload {
  static method = 'yns_clearChannelMetastorageRequest'

  id: number
  jsonrpc: typeof JSONRPC
  method: typeof ClearChannelMetastorageRequest.method
  params: never[]

  constructor () {
    this.id = -1
    this.jsonrpc = ''
    this.method = ''
    this.params = []
  }

  static match (payload: RequestPayload): payload is ClearChannelMetastorageRequest {
    return payload.method === ClearChannelMetastorageRequest.method
  }
}

export interface ClearChannelMetastorageResponse extends ResponsePayload {
  result: null
}

export class ClearReduxPersistentStorageRequest implements RequestPayload {
  static method = 'yns_clearReduxPersistentStorageRequest'

  id: number
  jsonrpc: typeof JSONRPC
  method: typeof ClearReduxPersistentStorageRequest.method
  params: never[]

  constructor () {
    this.id = -1
    this.jsonrpc = ''
    this.method = ''
    this.params = []
  }

  static match (payload: RequestPayload): payload is ClearReduxPersistentStorageRequest {
    return payload.method === ClearReduxPersistentStorageRequest.method
  }
}

export interface ClearReduxPersistentStorageResponse extends ResponsePayload {
  result: null
}

export class ClearMachinomyStorageRequest implements RequestPayload {
  static method = 'yns_clearMachinomyStorageRequest'

  id: number
  jsonrpc: typeof JSONRPC
  method: typeof ClearMachinomyStorageRequest.method
  params: never[]

  constructor () {
    this.id = -1
    this.jsonrpc = ''
    this.method = ''
    this.params = []
  }

  static match (payload: RequestPayload): payload is ClearMachinomyStorageRequest {
    return payload.method === ClearMachinomyStorageRequest.method
  }
}

export interface ClearMachinomyStorageResponse extends ResponsePayload {
  result: null
}

export class ClearAccountInfoRequest implements RequestPayload {
  static method = 'yns_clearAccountInfoRequest'

  id: number
  jsonrpc: typeof JSONRPC
  method: typeof ClearAccountInfoRequest.method
  params: never[]

  constructor () {
    this.id = -1
    this.jsonrpc = ''
    this.method = ''
    this.params = []
  }

  static match (payload: RequestPayload): payload is ClearAccountInfoRequest {
    return payload.method === ClearAccountInfoRequest.method
  }
}

export interface ClearAccountInfoResponse extends ResponsePayload {
  result: null
}

