import * as React from "react";
import {connect} from "react-redux";
import {CSSProperties, FormEvent} from "react";
import {FrameState} from "../../state";
import WorkerProxy from "../../WorkerProxy";

const BUTTON_CONTAINER_STYLE: CSSProperties = {
  textAlign: 'center',
  width: 240,
  top: 325,
  position: 'absolute'
};

const SUBTITLE_STYLE = {
  fontFamily: ['Source Sans Pro', 'sans-serif'],
  fontSize: 14,
  textAlign: 'center'
};

const TEXT_AREA_STYLE = {
  backgroundColor: '#E5F5FC',
  fontFamily: ['Source Sans Pro', 'sans-serif'],
  fontSize: 16,
  textAlign: 'center',
  width: 220,
  padding: '15px 10px',
  resize: 'none',
  border: 'none',
  borderRadius: 4
};

export interface MnemonicSubpageProps {
  mnemonic: string,
  workerProxy: WorkerProxy
}

export class MnemonicSubpage extends React.Component<MnemonicSubpageProps, {}> {
  handleSubmit (ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    this.props.workerProxy.didStoreMnemonic().then()
  }

  render () {
    return <form onSubmit={this.handleSubmit.bind(this)}>
      <h1>
        Remember these words
      </h1>
      <p style={SUBTITLE_STYLE}>
        Save them somewhere safe and secret. <br />
        These restore the wallet.
      </p>
      <div>
        <textarea rows={3} style={TEXT_AREA_STYLE} readOnly={true} value={this.props.mnemonic} />
      </div>
      <div style={BUTTON_CONTAINER_STYLE}>
        <div>
          <button type="submit">Done</button>
        </div>
      </div>
    </form>
  }
}

function mapStateToProps (state: FrameState): MnemonicSubpageProps {
  return {
    mnemonic: state.temp.initPage.mnemonic!,
    workerProxy: state.temp.workerProxy!
  }
}

export default connect<MnemonicSubpageProps, undefined, any>(mapStateToProps)(MnemonicSubpage)
