import * as React from "react";
import {connect} from "react-redux";
import {FrameState} from "../reducers/state";
//import InitPage from "../../pages/init"
import WalletPage from "../pages/wallet"
import UnlockPage from "../pages/UnlockPage";
import _ = require('lodash')
import { Redirect } from 'react-router-dom';

export interface SignInProps {
    isInitPageExpected: boolean
    isWalletPageExpected: boolean
    isUnlockPageExpected: boolean
}

const SignIn: React.SFC<SignInProps> = (props) => {
    if (props.isInitPageExpected) {

        //return <InitPage />
        return <Redirect to={{
            pathname: '/signup'
        }} />

    } else if (props.isUnlockPageExpected) {
        return <UnlockPage />
    } else if (props.isWalletPageExpected) {
        let scriptQuery = window.location.href.replace(/.*\?/, '')
        let query = _.chain(scriptQuery).replace('?', '').split('&').map(_.ary(_.partial(_.split, _, '='), 1)).fromPairs().value()
        let hideWallet = query.hideWallet
        if (hideWallet) {
            return <p></p>
        } else {
            return <WalletPage />
        }
    }
    return <p>Waiting...</p>
}

function mapStateToProps(state: FrameState): SignInProps {
    return {
        isInitPageExpected: !(state.shared.didInit),
        isWalletPageExpected: !!(state.shared.didInit && state.temp.workerProxy && !state.shared.isLocked),
        isUnlockPageExpected: !!(state.shared.didInit && state.temp.workerProxy && state.shared.isLocked)
    }
}

export default connect<SignInProps, undefined, any>(mapStateToProps)(SignIn)
