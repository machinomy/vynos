import * as actions from '../../../vynos/worker/actions'
import {autoRehydrate} from "redux-persist"
import reducers from '../../../vynos/worker/reducers'
import {INITIAL_STATE, WorkerState} from '../../../vynos/worker/WorkerState'
import {createLogger} from "redux-logger"
import * as redux from 'redux'
import {Store} from 'redux'
import BackgroundController from '../../../vynos/worker/controllers/BackgroundController'
import Keyring from '../../../vynos/frame/lib/Keyring'

describe('actions::setLastUpdateDb', () => {
  let mnemonic: string
  let password: string
  let middleware: redux.GenericStoreEnhancer
  let store: Store<any>
  let workerState: WorkerState

  beforeAll(() => {
    mnemonic = 'dance mutual spike analyst together average reject pudding hazard move fence install'
    password = '12344321'
    middleware = redux.compose(redux.applyMiddleware(createLogger()), autoRehydrate())
    store = redux.createStore(reducers, INITIAL_STATE, middleware)
  })

  beforeEach(() => {
    workerState = INITIAL_STATE
    middleware = redux.compose(redux.applyMiddleware(createLogger()), autoRehydrate())
    store = redux.createStore(reducers, INITIAL_STATE, middleware)
  })

  it('date', async () => {
    const now = undefined
    store.dispatch(actions.setLastUpdateDb(now))
    const newWorkerState = store.getState()
    expect(newWorkerState).toEqual({...workerState, runtime: { ...workerState.runtime, lastUpdateDb: now }})
  })
})

describe('actions::setWallet', () => {
  let mnemonic: string
  let password: string
  let middleware: redux.GenericStoreEnhancer
  let store: Store<any>
  let workerState: WorkerState
  let backgroundController: BackgroundController

  beforeAll(() => {
    mnemonic = 'dance mutual spike analyst together average reject pudding hazard move fence install'
    password = '12344321'
    middleware = redux.compose(redux.applyMiddleware(createLogger()), autoRehydrate())
    store = redux.createStore(reducers, INITIAL_STATE, middleware)
    backgroundController = new BackgroundController()
  })

  beforeEach(() => {
    workerState = INITIAL_STATE
    middleware = redux.compose(redux.applyMiddleware(createLogger()), autoRehydrate())
    store = redux.createStore(reducers, INITIAL_STATE, middleware)
  })

  it('usual wallet', async () => {
    let keyring: Keyring = backgroundController._generateKeyring(password, mnemonic)
    store.dispatch(actions.setWallet(keyring.wallet))
    const newWorkerState = store.getState()
    expect(newWorkerState).toEqual({ ...workerState,
      runtime: { ...workerState.runtime, wallet: keyring.wallet }
    })
  })

  it('undefined as wallet', async () => {
    store.dispatch(actions.setWallet(undefined))
    const newWorkerState = store.getState()
    expect(newWorkerState).toEqual({ ...workerState,
      runtime: { ...workerState.runtime, wallet: undefined }
    })
  })
})
