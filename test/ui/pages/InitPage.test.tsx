import * as React from 'react'
import { expect } from 'chai'
import * as Enzyme from 'enzyme'
import { mount } from 'enzyme'
import * as EnzymeAdapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new EnzymeAdapter() })
import { spy } from 'sinon'
import InitPage from '../../../vynos/frame/pages/InitPage'

spy(InitPage.prototype, 'handleChangePassword')

describe('<InitPage />', () => {
  it('calls componentDidMount', () => {
    const wrapper = mount(<InitPage />)
  })
})
