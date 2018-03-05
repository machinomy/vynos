import * as React from "react";
import {connect} from "react-redux";
import {FrameState} from "../../redux/FrameState";
import Terms from './Terms'
import Password from './Password'
import Mnemonic from './Mnemonic'

export interface InitPageProps {
  needAcceptTerms?: boolean
  needSetPassword?: boolean
  didGenerateMnemonic?: boolean
  mnemonic?: string|null
  showVerifiable: () => void
}

const InitPage: React.SFC<InitPageProps> = (props) => {
  if (props.needAcceptTerms) {
    return <Terms showVerifiable={props.showVerifiable} />
  } else if (props.needSetPassword) {
    return <Password showVerifiable={props.showVerifiable} />
  } else if (props.didGenerateMnemonic && props.mnemonic) {
    return <Mnemonic mnemonic={props.mnemonic} showVerifiable={props.showVerifiable} />
  } else {
    return <Terms showVerifiable={props.showVerifiable} />
  }
}

function mapStateToProps(state: FrameState, props: InitPageProps): InitPageProps {
  return {
    needAcceptTerms: !state.temp.initPage.didAcceptTerms,
    needSetPassword: !state.temp.initPage.mnemonic,
    didGenerateMnemonic: !!state.temp.initPage.mnemonic,
    mnemonic: state.temp.initPage.mnemonic,
    showVerifiable: props.showVerifiable
  }
}

export default connect<InitPageProps, undefined, any>(mapStateToProps)(InitPage)
