import * as React from 'react'
import {connect} from 'react-redux'
import {FrameState} from "../state/FrameState"

import SignIn from '../components/UnlockPage'


import { Redirect } from 'react-router-dom'
import {isUnlockPageExpected} from "./filters";

export interface RootRouteProps {
  isInitPageExpected: boolean
  isWalletPageExpected: boolean
  isUnlockPageExpected: boolean
}

const RootRoute = (props: RootRouteProps) => {
  if (props.isInitPageExpected) {
    return <Redirect to="/init" />
  } else if (props.isUnlockPageExpected) {
    return <SignIn/>
  } else if (props.isWalletPageExpected) {
    return <Redirect to="/wallet" />
  } else {
    return <Redirect to="/" />
  }
}

function mapStateToProps(state: FrameState): RootRouteProps {
  return {
    isInitPageExpected: !(state.shared.didInit),
    isWalletPageExpected: !!(state.shared.didInit && state.temp.workerProxy && !state.shared.isLocked),
    isUnlockPageExpected: isUnlockPageExpected(state)
  }
}

export default connect<RootRouteProps, undefined, any>(mapStateToProps)(RootRoute)
