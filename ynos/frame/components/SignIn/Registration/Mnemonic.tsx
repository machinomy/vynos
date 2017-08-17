import * as React from "react";
import {connect} from "react-redux";
import { FormEvent } from "react";
import {FrameState} from "../../../reducers/state";
import WorkerProxy from "../../../WorkerProxy";
import { Link } from 'react-router-dom'
import Button from 'material-ui/RaisedButton'
import '../../../css/Mnemonic.styl';

export interface MnemonicSubpageProps {
  mnemonic: string,
  workerProxy: WorkerProxy
}

// export class Mnemonic extends React.Component<MnemonicSubpageProps, {}> {
export default class Mnemonic extends React.Component<any, any> {
  handleSubmit (ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    this.props.workerProxy.didStoreMnemonic().then()
  }

  render () {
    return (
        <div>
          <div className="text-center mnemonic-subheader">Remember these words</div>
          <form onSubmit={this.handleSubmit.bind(this)}>

            <div className="wallet-created text-center">
              <Button className="btn-primary" backgroundColor="#077BC3" label={<span className="label-primary">Done</span>}/>
            </div>
          </form>
        </div>
    )
  }
}

// return <form onSubmit={this.handleSubmit.bind(this)}>
//   <h1>
//     Remember these words
//   </h1>
//   <p style={SUBTITLE_STYLE}>
//     Save them somewhere safe and secret. <br />
//     These restore the wallet.
//   </p>
//   <div>
//     <textarea rows={3} style={TEXT_AREA_STYLE} readOnly={true} value={this.props.mnemonic} />
//   </div>
//   <div style={BUTTON_CONTAINER_STYLE}>
//     <div>
//       <button type="submit">Done</button>
//     </div>
//   </div>
// </form>

// function mapStateToProps (state: FrameState): MnemonicSubpageProps {
//   return {
//     mnemonic: state.temp.initPage.mnemonic!,
//     workerProxy: state.temp.workerProxy!
//   }
// }
//
// export default connect<MnemonicSubpageProps, undefined, any>(mapStateToProps)(MnemonicSubpage)
