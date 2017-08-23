import * as React from "react";
import {connect} from "react-redux";
import {FrameState} from "../../../reducers/state";
import Terms from './Terms';
import Encryption from './Encryption';
import Mnemonic from './Mnemonic';
import 'semantic-ui-css/semantic.min.css';

export interface Registration {
    needAcceptTerms: boolean
    needSetPassword: boolean
}

const Registration: React.SFC<Registration> = (props) => {
    if (props.needAcceptTerms) {
        return <Terms />
    } else if (props.needSetPassword) {
        return <Encryption />
    } else {
        return <Mnemonic />
    }
}

function mapStateToProps(state: FrameState): Registration {
    return {
        needAcceptTerms: !state.temp.initPage.didAcceptTerms,
        needSetPassword: !state.temp.initPage.mnemonic,
    }
}

export default connect<Registration, undefined, any>(mapStateToProps)(Registration)