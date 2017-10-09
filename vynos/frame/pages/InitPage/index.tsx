import * as React from "react";
import {connect} from "react-redux";
import {FrameState} from "../../redux/FrameState";
import Terms from './Terms'
import Password from './Password'
import Mnemonic from './Mnemonic'

export interface InitPageProps {
  needAcceptTerms: boolean
  needSetPassword: boolean
  didGenerateMnemonic: boolean
  mnemonic: string|null
}

const InitPage: React.SFC<InitPageProps> = (props) => {
  if (props.needAcceptTerms) {
    return <Terms />
  } else if (props.needSetPassword) {
    return <Password />
  } else if (props.didGenerateMnemonic && props.mnemonic) {
    return <Mnemonic mnemonic={props.mnemonic} />
  } else {
    return <Terms />
  }
}

function mapStateToProps(state: FrameState): InitPageProps {
  return {
    needAcceptTerms: !state.temp.initPage.didAcceptTerms,
    needSetPassword: !state.temp.initPage.mnemonic,
    didGenerateMnemonic: !!state.temp.initPage.mnemonic,
    mnemonic: state.temp.initPage.mnemonic
  }
}

export default connect<InitPageProps, undefined, any>(mapStateToProps)(InitPage)
