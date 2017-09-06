import * as React from "react";
import {connect} from "react-redux";
//import LargeLogoLayout from "../components/large_logo_layout";
import {ChangeEvent, CSSProperties, FormEvent} from "react";
import _ = require("lodash")
import WorkerProxy from "../../../WorkerProxy";
import {AppFrameState} from "../../../reducers/state";
//import Button from '@react-mdc/button'
import Textfield from '@react-mdc/textfield'
import Typography from '@react-mdc/typography'
import classnames = require('classnames')
import { Container, Form, Input, Header, Button } from 'semantic-ui-react'
import Logo from '../Header';
const style = require("../../../styles/ynos.css");

export interface UnlockPageStateProps {
    workerProxy: WorkerProxy
}

export type UnlockPageProps = UnlockPageStateProps;

export type UnlockPageState = {
    password: string|null;
    passwordError: string|null;
    loading: boolean
};

const ERROR_MESSAGE = "Incorrect password";

export class Authentication extends React.Component<UnlockPageProps, UnlockPageState> {
    constructor (props: UnlockPageProps) {
        super(props);
        this.state = {
            password: null,
            passwordError: null,
            loading: false
        };
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleForgotPassword = this.handleForgotPassword.bind(this);
    }

    handlePasswordChange (event: ChangeEvent<HTMLInputElement>) {
        let value = event.target.value
        this.setState({
            password: value,
            passwordError: null
        })
    }

    handleSubmit (ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault()
        if (!this.state.loading) {
            this.setState({
                loading: true
            });
            let password = _.toString(this.state.password);
            this.props.workerProxy.doUnlock(password).then()
            window.location.reload()
        }
    }

    buttonLabel () {
        if (this.state.loading) {
            return 'Loading...'
        } else {
            return 'Unlock'
        }
    }

    handleForgotPassword () {
        alert('Not Yet Implemented')
    }

    render () {
        return <Container textAlign="center" className={`${style.flexContainer} ${style.clearBorder}`}>
            <p className={style.signInLogo}>
                <Logo />
            </p>
            <Form onSubmit={this.handleSubmit} className={style.authForm}>
                <Form.Group widths='equal'>
                    <Form.Field className={style.authFormField}>
                        <input type="password" placeholder='Password' onChange={this.handlePasswordChange} />
                    </Form.Field>
                </Form.Group>
                <p className={style.buttonNav}>
                    <Button type='submit' content={this.buttonLabel()} primary />
                    <br />
                    <a href="#">Forgot password?</a>
                </p>
            </Form>
        </Container>
    }
}


function mapStateToProps (state: AppFrameState): UnlockPageStateProps {
    return {
        workerProxy: state.temp.workerProxy!
    }
}

export default connect<UnlockPageProps, undefined, any>(mapStateToProps)(Authentication)
