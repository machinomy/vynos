import * as React from "react";
import {connect} from "react-redux";
import {AppFrameState} from "../../../reducers/state";
import Encryption from './Encryption';
import Mnemonic from './Mnemonic';

export interface Registration {
    needAcceptTerms: boolean
    needSetPassword: boolean
}

const Registration: React.SFC<Registration> = (props) => {
    if (props.needAcceptTerms) {
      return <p>Terms</p>
    } else if (props.needSetPassword) {
        return <Encryption />
    } else {
        return <Mnemonic />
    }
}

function mapStateToProps(state: AppFrameState): Registration {
    return {
        needAcceptTerms: !state.temp.initPage.didAcceptTerms,
        needSetPassword: !state.temp.initPage.mnemonic,
    }
}

export default connect<Registration, undefined, any>(mapStateToProps)(Registration)
