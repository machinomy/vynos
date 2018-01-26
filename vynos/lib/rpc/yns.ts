import {JSONRPC, RequestPayload, ResponsePayload} from "../Payload"
import {SharedState} from "../../worker/WorkerState";
import {PaymentChannelJSON} from "machinomy/lib/channel";
import Payment from "machinomy/lib/Payment";
import VynosBuyResponse from "../VynosBuyResponse";
import { ChannelMeta } from '../storage/ChannelMetaStorage'
import PurchaseMeta from "../PurchaseMeta";

export class InitAccountRequest implements RequestPayload {
  id: number;
  jsonrpc: typeof JSONRPC;
  method: typeof InitAccountRequest.method;
  params: any[];

  static method = "yns_initAccount"

  static match(payload: RequestPayload): payload is InitAccountRequest {
    return payload.method === InitAccountRequest.method
  }
}

export interface InitAccountResponse extends ResponsePayload {
  result: string[]
}

export class GetSharedStateRequest implements RequestPayload {
  id: number;
  jsonrpc: typeof JSONRPC;
  method: typeof GetSharedStateRequest.method;
  params: any[];

  static method: string = "yns_getSharedState"

  static match(payload: RequestPayload): payload is GetSharedStateRequest {
    return payload.method === GetSharedStateRequest.method
  }
}

export interface GetSharedStateResponse extends ResponsePayload {
  result: SharedState
}

export class DidStoreMnemonicRequest implements RequestPayload {
  id: number;
  jsonrpc: typeof JSONRPC;
  method: typeof DidStoreMnemonicRequest.method;
  params: any[];

  static method: string = "yns_didStoreMnemonic"

  static match(payload: RequestPayload): payload is DidStoreMnemonicRequest {
    return payload.method === DidStoreMnemonicRequest.method
  }
}

export interface DidStoreMnemonicResponse extends ResponsePayload {
  result: null
}

export class RememberPageRequest implements RequestPayload {
  id: number
  jsonrpc: typeof JSONRPC
  method: typeof RememberPageRequest.method
  params: [string]

  static method: string = "yns_rememberPage"

  static match(payload: RequestPayload): payload is RememberPageRequest {
    return payload.method === RememberPageRequest.method
  }
}

export interface RememberPageResponse extends ResponsePayload {
  result: null
}

export class GenKeyringRequest implements RequestPayload {
  id: number;
  jsonrpc: typeof JSONRPC;
  method: typeof GenKeyringRequest.method;
  params: string[];

  static method = "yns_genKeyring"

  static match(payload: RequestPayload): payload is GenKeyringRequest {
    return payload.method === GenKeyringRequest.method
  }
}

export interface GenKeyringResponse extends ResponsePayload {
  result: string
}

// RestoreWalletRequest

export class RestoreWalletRequest implements RequestPayload {
  id: number;
  jsonrpc: typeof JSONRPC;
  method: typeof RestoreWalletRequest.method;
  params: [string, string];

  static method = "yns_restoreWallet"

  static match(payload: RequestPayload): payload is RestoreWalletRequest {
    return payload.method === RestoreWalletRequest.method
  }
}

export interface RestoreWalletResponse extends ResponsePayload {
  result: string
}

export class UnlockWalletRequest implements RequestPayload {
  id: number;
  jsonrpc: typeof JSONRPC;
  method: typeof UnlockWalletRequest.method;
  params: string[];

  static method = "yns_unlockWallet"

  static match(payload: RequestPayload): payload is UnlockWalletRequest {
    return payload.method === UnlockWalletRequest.method
  }
}

export interface UnlockWalletResponse extends ResponsePayload {
  result: null
  error?: string
}

export class LockWalletRequest implements RequestPayload {
  id: number;
  jsonrpc: typeof JSONRPC;
  method: typeof LockWalletRequest.method;
  params: string[];

  static method = "yns_lockWallet"

  static match(payload: RequestPayload): payload is LockWalletRequest {
    return payload.method === LockWalletRequest.method
  }
}

export interface LockWalletResponse extends ResponsePayload {
  result: null
}

export class OpenChannelRequest implements RequestPayload {
  id: number;
  jsonrpc: typeof JSONRPC;
  method: typeof OpenChannelRequest.method;
  params: [string, string];

  static method = "yns_openChannel"

  static match(payload: RequestPayload): payload is OpenChannelRequest {
    return payload.method === OpenChannelRequest.method
  }
}

export interface OpenChannelResponse extends ResponsePayload {
  result: [PaymentChannelJSON] //
}

export class CloseChannelRequest implements RequestPayload {
  id: number;
  jsonrpc: typeof JSONRPC;
  method: typeof CloseChannelRequest.method;
  params: [string];

  static method = "yns_closeChannel"

  static match(payload: RequestPayload): payload is CloseChannelRequest {
    return payload.method === CloseChannelRequest.method
  }
}

export interface CloseChannelResponse extends ResponsePayload {
  result: [string] //
}

export class PayInChannelRequest implements RequestPayload {
  id: number;
  jsonrpc: typeof JSONRPC;
  method: typeof PayInChannelRequest.method;
  params: [PaymentChannelJSON, number, boolean];

  static method = "yns_payInChannel"

  static match(payload: RequestPayload): payload is PayInChannelRequest {
    return payload.method === PayInChannelRequest.method
  }
}

export interface PayInChannelResponse extends ResponsePayload {
  result: [PaymentChannelJSON, Payment]
}

export class BuyRequest implements RequestPayload {
  id: number;
  jsonrpc: typeof JSONRPC;
  method: typeof BuyRequest.method;
  params: [string, number, string, string, PurchaseMeta, number];

  static method = "yns_buyRequest"

  static match(payload: RequestPayload): payload is BuyRequest {
    return payload.method === BuyRequest.method
  }
}

export class TransactonResolved implements RequestPayload {
  id: number;
  jsonrpc: typeof JSONRPC;
  method: typeof TransactonResolved.method;
  params: never[];

  static method = "yns_transactionResolved"

  static match(payload: RequestPayload): payload is TransactonResolved {
    return payload.method === TransactonResolved.method
  }
}

export interface BuyResponse extends ResponsePayload {
  result: [VynosBuyResponse]
}

export class ListChannelsRequest implements RequestPayload {
  id: number;
  jsonrpc: typeof JSONRPC;
  method: typeof ListChannelsRequest.method;
  params: any[];

  static method = "yns_listChannels"

  static match(payload: RequestPayload): payload is ListChannelsRequest {
    return payload.method === ListChannelsRequest.method
  }
}

export interface ListChannelsResponse extends ResponsePayload {
  result: Array<PaymentChannelJSON>
}

export class ChangeNetworkRequest implements RequestPayload {
  id: number;
  jsonrpc: typeof JSONRPC;
  method: typeof ChangeNetworkRequest.method;
  params: any[];

  static method: string = "yns_ChangeNetwork"

  static match(payload: RequestPayload): payload is ChangeNetworkRequest {
    return payload.method === ChangeNetworkRequest.method
  }
}

export interface ChangeNetworkResponse extends ResponsePayload {
  result: string
}

export class GetPrivateKeyHexRequest implements RequestPayload {
  id: number;
  jsonrpc: typeof JSONRPC;
  method: typeof GetPrivateKeyHexRequest.method;
  params: never[];

  static method = "yns_getPrivateKeyHex"

  static match (payload: RequestPayload): payload is GetPrivateKeyHexRequest {
    return payload.method === GetPrivateKeyHexRequest.method
  }
}

export interface GetPrivateKeyHexResponse extends ResponsePayload {
  result: string
}
