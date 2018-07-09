import { JSONRPC, randomId } from '../../vynos/lib/Payload'
import {
  ClearAccountInfoRequest,
  ClearChannelMetastorageRequest,
  ClearMachinomyStorageRequest,
  ClearReduxPersistentStorageRequest,
  ClearTransactionMetastorageRequest,
  GetPrivateKeyHexRequest,
  GetPrivateKeyHexResponse
} from '../../vynos/lib/rpc/yns'
import { Duplex } from 'readable-stream'
import Client from '../../vynos/embed/Client'

export default class MockingClient extends Client {
  constructor (stream: Duplex) {
    super(stream)
  }

  getPrivateKey (): Promise<void> {
    let request: GetPrivateKeyHexRequest = {
      id: randomId(),
      method: GetPrivateKeyHexRequest.method,
      jsonrpc: JSONRPC,
      params: []
    }
    return this.provider.ask(request).then((response: GetPrivateKeyHexResponse) => {
      console.error('getPrivateKey() success')
      return
    })
  }

  clearTransactionMetastorage (): Promise<void> {
    let request: ClearTransactionMetastorageRequest = {
      id: randomId(),
      jsonrpc: JSONRPC,
      method: ClearTransactionMetastorageRequest.method,
      params: []
    }
    return this.provider.ask(request).then(() => {
      console.error('clearTransactionMetastorage() success')
      return
    })
  }

  clearChannelMetastorage (): Promise<void> {
    let request: ClearChannelMetastorageRequest = {
      id: randomId(),
      jsonrpc: JSONRPC,
      method: ClearChannelMetastorageRequest.method,
      params: []
    }
    return this.provider.ask(request).then(() => {
      console.error('clearChannelMetastorage() success')
      return
    })
  }

  clearReduxPersistentStorage (): Promise<void> {
    let request: ClearReduxPersistentStorageRequest = {
      id: randomId(),
      jsonrpc: JSONRPC,
      method: ClearReduxPersistentStorageRequest.method,
      params: []
    }
    return this.provider.ask(request).then(() => {
      console.error('clearReduxPersistentStorage() success')
      return
    })
  }

  clearMachinomyStorage (): Promise<void> {
    let request: ClearMachinomyStorageRequest = {
      id: randomId(),
      jsonrpc: JSONRPC,
      method: ClearMachinomyStorageRequest.method,
      params: []
    }
    return this.provider.ask(request).then(() => {
      console.error('clearMachinomyStorage() success')
      return
    })
  }

  clearAccountInfo (): Promise<void> {
    let request: ClearAccountInfoRequest = {
      id: randomId(),
      jsonrpc: JSONRPC,
      method: ClearAccountInfoRequest.method,
      params: []
    }
    return this.provider.ask(request).then(() => {
      console.error('clearAccountInfo() success')
      return
    })
  }

}
