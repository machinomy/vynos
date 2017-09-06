import * as React from "react";
import {Dispatch} from "redux";
import {AppFrameState} from "../../../../reducers/state";
import {ChangeEvent, FormEvent} from "react";
import WorkerProxy from "../../../../WorkerProxy";
import {connect} from "react-redux";
import actions from "../../../../actions";
import { Container, Form, Input, Header, Button } from 'semantic-ui-react'
import Logo from '../../Header';
const style = require("../../../../styles/ynos.css");

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

export class Encryption extends React.Component<PasswordSubpageProps, PasswordSubpageState> {
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
        return <Container textAlign="center" className={`${style.flexContainer} ${style.clearBorder}`}>
                    <p className={style.signInLogo}>
                        <Logo />
                    </p>
                    <Header as='h1' className={style.encryptionHeader}>Encrypt your new wallet</Header>
                    <Form onSubmit={this.handleSubmit} className={style.encryptionForm}>
                        <Form.Group widths='equal'>
                            <Form.Field>
                                <input type="password" placeholder='Password' onChange={this.handleChangePassword} />
                            </Form.Field>
                            <Form.Field>
                                <input type="password" placeholder='Password Confirmation' onChange={this.handleChangePasswordConfirmation} />
                            </Form.Field>
                        </Form.Group>
                        <p>
                            {this.renderError()}
                        </p>
                        <p className={style.buttonNav}>
                            <Button type='submit' content="Create wallet" primary />
                            <br />
                            <a href="#">Restore wallet</a>
                        </p>
                    </Form>
            </Container>
    }
}

function mapStateToProps(state: AppFrameState): PasswordSubpageStateProps {
    return {
        workerProxy: state.temp.workerProxy!
    }
}

function mapDispatchToProps(dispatch: Dispatch<AppFrameState>): PasswordSubpageDispatchProps {
    return {
        genKeyring: (workerProxy, password) => {
            workerProxy.genKeyring(password).then(mnemonic => {
                dispatch(actions.temp.init.didReceiveMnemonic(mnemonic))
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Encryption)
