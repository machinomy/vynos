import * as React from 'react'
import * as Enzyme from 'enzyme'
import { mount } from 'enzyme'
import * as EnzymeAdapter from 'enzyme-adapter-react-16'
import InitPage, { InitPageProps, mapStateToProps } from '../../../vynos/frame/pages/InitPage'
import { FrameState, initialState as frameStateInitialStateFn } from '../../../vynos/frame/redux/FrameState'
import * as redux from 'redux'
import createHashHistory from 'history/createHashHistory'
import reducers from '../../../vynos/frame/redux/reducers'
import { Provider, Store } from 'react-redux'
import { createLogger } from 'redux-logger'
import { routerMiddleware } from 'react-router-redux'
import { default as toJson } from 'enzyme-to-json'
import { Password } from '../../../vynos/frame/pages/InitPage/Password'
import * as WorkerProxy from '../../../vynos/frame/WorkerProxy'

Enzyme.configure({ adapter: new EnzymeAdapter() })

describe('<InitPage />', () => {
  let workerProxy: WorkerProxy.default
  let history
  let middleware
  let store: Store<FrameState>
  let frameState: FrameState
  let initPageProps: InitPageProps

  let spyOnGenKeyring: any

  beforeAll(() => {
    spyOnGenKeyring = jest.fn(WorkerProxy.default.prototype.genKeyring)
  })

  beforeEach(() => {
    workerProxy = new WorkerProxy.default()
    history = createHashHistory()
    middleware = redux.applyMiddleware(createLogger(), routerMiddleware(history))
    store = redux.createStore(reducers(workerProxy), frameStateInitialStateFn(workerProxy), middleware)
    frameState = frameStateInitialStateFn(workerProxy)
    initPageProps = mapStateToProps(frameState, { showVerifiable: () => {} })
  })

  it('if didAcceptTerms is not true Accept Terms page must be shown', () => {
    if (store.getState().temp.initPage.didAcceptTerms !== true) {
      const wrapper = mount(<Provider store={store} key="provider">
        <InitPage showVerifiable={initPageProps.showVerifiable}/>
      </Provider>)

      expect(toJson(wrapper)).toMatchSnapshot()
    }
  })

  it('create new wallet', (done) => {
    if (store.getState().temp.initPage.didAcceptTerms !== true) {
      const wrapper = mount(<Provider store={store} key="provider">
        <InitPage showVerifiable={initPageProps.showVerifiable}/>
      </Provider>)

      wrapper.find('button.acceptTermsButton').simulate('click')
      expect(store.getState().temp.initPage.didAcceptTerms).toBe(true)

      const wrapperPassword = mount(<Provider store={store} key="provider">
        <Password showVerifiable={initPageProps.showVerifiable} workerProxy={store.getState().temp.workerProxy}/>
      </Provider>)

      wrapperPassword.find('.newPasswordField > input').simulate('change', { target: { value: '12344321' } })
      wrapperPassword.find('.repeatNewPasswordField > input').simulate('change', { target: { value: '12344321' } })
      wrapperPassword.find('button.createWalletButton').simulate('click')
      setTimeout(() => {
        expect(spyOnGenKeyring).toHaveBeenCalledWith('12344321')
        expect(!!store.getState().temp.initPage.mnemonic).toBe(true)
        done()
      },1000)
    }
  })
})
