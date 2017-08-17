import * as React from "react";
import {Dispatch} from "redux";
import {FrameState} from "../../../reducers/state";
import {ChangeEvent, FormEvent} from "react";
import WorkerProxy from "../../../WorkerProxy";
import {connect} from "react-redux";
import actions from "../../../actions";
import Button from 'material-ui/RaisedButton'
import Textfield from 'material-ui/TextField'
import { Link } from 'react-router-dom'
import '../../../css/Encryption.styl';

export interface PasswordSubpageState {
  password: null | string,
  passwordConfirmation: null | string,
  passwordError: null | string,
  passwordConfirmationError: null | string
}

const PASSWORD_CONFIRMATION_HINT_TEXT = 'Same as password';
const MINIMUM_PASSWORD_LENGTH = 0; // FIXME ACHTUNG MUST BE 8
const PASSWORD_HINT_TEXT = `At least ${MINIMUM_PASSWORD_LENGTH} characters`;

export interface PasswordSubpageStateProps {
  workerProxy: WorkerProxy
}

export interface PasswordSubpageDispatchProps {
  genKeyring: (workerProxy: WorkerProxy, password: string) => void
}

export type PasswordSubpageProps = PasswordSubpageStateProps & PasswordSubpageDispatchProps

//export default class Encryption extends React.Component<PasswordSubpageProps, PasswordSubpageState> {
export default class Encryption extends React.Component<any, any> {
  constructor (props: PasswordSubpageProps) {
    super(props);
    this.state = {
      password: '',
      passwordConfirmation: '',
      passwordError: null,
      passwordConfirmationError: null
    };
    this.handleChangePassword = this.handleChangePassword.bind(this)
    this.handleChangePasswordConfirmation = this.handleChangePasswordConfirmation.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  isValid () {
    let passwordError = this.state.passwordError;
    if (this.state.password && this.state.password.length < MINIMUM_PASSWORD_LENGTH) {
      passwordError = PASSWORD_HINT_TEXT;
      this.setState({
        passwordError: passwordError
      })
    }
    let passwordConfirmationError = this.state.passwordConfirmationError;
    if (this.state.passwordConfirmation !== this.state.password) {
      passwordConfirmationError = PASSWORD_CONFIRMATION_HINT_TEXT;
      this.setState({
        passwordConfirmationError: passwordConfirmationError
      })
    }
    return !(passwordError || passwordConfirmationError)
  }

  handleSubmit (ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    if (this.isValid() && this.state.password) {
      this.props.genKeyring(this.props.workerProxy, this.state.password)
    }
  }

  handleChangePassword(ev: ChangeEvent<EventTarget>) {
    let value = (ev.target as HTMLInputElement).value
    this.setState({
      password: value,
      passwordError: null,
      passwordConfirmationError: null
    })
  }

  handleChangePasswordConfirmation(ev: ChangeEvent<EventTarget>) {
    let value = (ev.target as HTMLInputElement).value
    this.setState({
      passwordConfirmation: value,
      passwordError: null,
      passwordConfirmationError: null
    })
  }

  renderError () {
    let error = this.state.passwordError || this.state.passwordConfirmationError
    if (error) {
      return <p>{error}</p>
    } else {
      return null
    }
  }

  render () {
    return (
        <div>
          <div className="text-center encryption-text">Encrypt your new wallet</div>
          <form onSubmit={this.handleSubmit}>
            <div className="encryption-text-field text-center">
              <Textfield
                  onChange={() => {}}
                  floatingLabelText="Password"
                  floatingLabelStyle={{'font-family': "'source_sans_proregular', sans-serif", 'font-size': '16px', 'top': '26px'}}
                  style={{'height': '60px'}}
                  fullWidth
                  inputStyle={{'margin-top': '2px'}}
              />
              <Textfield
                  onChange={() => {}}
                  floatingLabelText="Password Confirmation"
                  floatingLabelStyle={{'font-family': "'source_sans_proregular', sans-serif", 'font-size': '16px', 'top': '26px'}}
                  fullWidth
                  style={{'height': '60px'}}
                  inputStyle={{'margin-top': '2px'}}
              />
            </div>
            {this.renderError()}
            <div className="create-wallet text-center">
              <Button className="btn-primary" backgroundColor="#077BC3" label={<span className="label-primary">CREATE A WALLET</span>}/>
              <div className="restore-text text-center">
                <Link to="#" className="to-restore">Restore wallet</Link>
              </div>
            </div>
          </form>
      </div>
    )
  }
}

// function mapStateToProps(state: FrameState): PasswordSubpageStateProps {
//   return {
//     workerProxy: state.temp.workerProxy!
//   }
// }
//
// function mapDispatchToProps(dispatch: Dispatch<FrameState>): PasswordSubpageDispatchProps {
//   return {
//     genKeyring: (workerProxy, password) => {
//       workerProxy.genKeyring(password).then(mnemonic => {
//         dispatch(actions.temp.init.didReceiveMnemonic(mnemonic))
//       })
//     }
//   }
// }
//
// export default connect(mapStateToProps, mapDispatchToProps)(PasswordSubpage)
