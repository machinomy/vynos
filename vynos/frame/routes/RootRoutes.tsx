import * as React from "react";
import {connect} from "react-redux";
import {AppFrameState} from "../reducers/state";

import SignIn from '../components/SignIn/Authentication';


import { Redirect } from 'react-router-dom'

export interface RootRouteProps {
    isSignUpExpected: boolean
    isWalletPageExpected: boolean
    isUnlockPageExpected: boolean
}

const RootRoute = (props: RootRouteProps) => {
    if (props.isSignUpExpected) {
        return <Redirect to="/sign_up" />
    } else if (props.isUnlockPageExpected) {
        return <SignIn />
    } else if (props.isWalletPageExpected) {
        return <Redirect to="/dashboard" />
    } else {
        return <Redirect to="/" />
    }
}

function mapStateToProps(state: AppFrameState): RootRouteProps {
    return {
        isSignUpExpected: !(state.shared.didInit),
        isWalletPageExpected: !!(state.shared.didInit && state.temp.workerProxy && !state.shared.isLocked),
        isUnlockPageExpected: !!(state.shared.didInit && state.temp.workerProxy && state.shared.isLocked)
    }
}

export default connect<RootRouteProps, undefined, any>(mapStateToProps)(RootRoute)
