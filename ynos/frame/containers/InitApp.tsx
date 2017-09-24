import * as React from "react";
import {connect} from "react-redux";
import {AppFrameState} from "../reducers/state";
import _ = require('lodash')

import SignUp from '../components/SignIn/Registration';
import SignIn from '../components/SignIn/Authentication';


import { Redirect } from 'react-router-dom'

export interface InitAppProps {
    isInitPageExpected: boolean
    isWalletPageExpected: boolean
    isUnlockPageExpected: boolean
}

const InitApp: React.SFC<InitAppProps> = (props) => {
    if (props.isInitPageExpected) {
        return <SignUp />
    } else if (props.isUnlockPageExpected) {
        return <SignIn />
    } else if (props.isWalletPageExpected) {
        return <Redirect to="/dashboard" />
    } else {
        return <p>Waiting...</p>
    }
}

function mapStateToProps(state: AppFrameState): InitAppProps {
    return {
        isInitPageExpected: !(state.shared.didInit),
        isWalletPageExpected: !!(state.shared.didInit && state.temp.workerProxy && !state.shared.isLocked),
        isUnlockPageExpected: !!(state.shared.didInit && state.temp.workerProxy && state.shared.isLocked)
    }
}

export default connect<InitAppProps, undefined, any>(mapStateToProps)(InitApp)
