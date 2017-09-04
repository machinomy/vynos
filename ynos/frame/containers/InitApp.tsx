import * as React from "react";
import {connect} from "react-redux";
import {AppFrameState} from "../reducers/state";
import _ = require('lodash')

import SignUp from '../components/SignIn/Registration';
import SignIn from '../components/SignIn/Authentication';
import MyWallet from '../components/Account/MyWallet';
import Account from '../containers/Account';

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

        let scriptQuery = window.location.href.replace(/.*\?/, '')
        let query = _.chain(scriptQuery).replace('?', '').split('&').map(_.ary(_.partial(_.split, _, '='), 1)).fromPairs().value()
        let hideWallet = query.hideWallet
        if (hideWallet) {
            return <p></p>
        } else {
            return <Account>
                <MyWallet />
            </Account>
        }
    }
    return <p>Waiting...</p>
}

function mapStateToProps(state: AppFrameState): InitAppProps {
    return {
        isInitPageExpected: !(state.shared.didInit),
        isWalletPageExpected: !!(state.shared.didInit && state.temp.workerProxy && !state.shared.isLocked),
        isUnlockPageExpected: !!(state.shared.didInit && state.temp.workerProxy && state.shared.isLocked)
    }
}

export default connect<InitAppProps, undefined, any>(mapStateToProps)(InitApp)
