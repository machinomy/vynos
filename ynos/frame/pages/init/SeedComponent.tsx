import * as React from "react";
import {connect} from "react-redux";
import browser from "../../lib/browser";
import RaisedButton from "material-ui/RaisedButton";
import actions from "../../actions";
import {Dispatch} from "react-redux";
import {CSSProperties} from "react";
import {State} from "../../astate";

export interface SeedComponentStateProps {
  mnemonic?: string,
  isButtonDisabled: boolean,
}

export interface SeedComponentDispatchProps {
  onDoneButtonClick: Function
}

export type SeedComponentProps = SeedComponentStateProps & SeedComponentDispatchProps;

export interface SeedComponentState {
  isButtonDisabled: boolean
}

const BUTTON_CONTAINER_STYLE: CSSProperties = {
  textAlign: 'center',
  width: 240,
  top: 325,
  position: 'absolute'
};

const BUTTON_STYLE = {
  boxShadow: null
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

export class SeedComponent extends React.Component<SeedComponentProps, SeedComponentState> {
  render () {
    return <div>
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
          <RaisedButton
            label="DONE"
            style={BUTTON_STYLE}
            primary={true}
            disabled={this.props.isButtonDisabled}
            onTouchTap={this.props.onDoneButtonClick} />
        </div>
      </div>
    </div>
  }
}

function mapStateToProps (state: State): SeedComponentStateProps {
  return {
    isButtonDisabled: !(state.runtime.walletPresent && state.init.keyring),
    mnemonic: state.runtime.mnemonic
  }
}

function mapDispatchToProps (dispatch: Dispatch<any>): SeedComponentDispatchProps {
  return {
    onDoneButtonClick: () => {
      dispatch(actions.init.didStoreSeed(new Date()))
    }
  }
}

export default connect<SeedComponentStateProps, SeedComponentDispatchProps, any>(mapStateToProps, mapDispatchToProps)(SeedComponent)
