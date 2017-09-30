import * as React from "react";
import {connect} from "react-redux";
import {AppFrameState} from "../reducers/state";

import SignUp from '../components/SignIn/Registration';
import SignIn from '../components/SignIn/Authentication';


import { Redirect } from 'react-router-dom'

export interface RootProps {
    isInitPageExpected: boolean
    isWalletPageExpected: boolean
    isUnlockPageExpected: boolean
}

const Root: React.SFC<RootProps> = (props) => {
    if (props.isInitPageExpected) {
        return <Redirect to="/sign_up" />
    } else if (props.isUnlockPageExpected) {
        return <SignIn />
    } else if (props.isWalletPageExpected) {
        return <Redirect to="/dashboard" />
    } else {
        return <Redirect to="/" />
    }
}

function mapStateToProps(state: AppFrameState): RootProps {
    return {
        isInitPageExpected: !(state.shared.didInit),
        isWalletPageExpected: !!(state.shared.didInit && state.temp.workerProxy && !state.shared.isLocked),
        isUnlockPageExpected: !!(state.shared.didInit && state.temp.workerProxy && state.shared.isLocked)
    }
}

export default connect<RootProps, undefined, any>(mapStateToProps)(Root)
