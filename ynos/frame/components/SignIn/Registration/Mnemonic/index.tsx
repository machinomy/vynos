import * as React from "react";
import {connect} from "react-redux";
import {CSSProperties, FormEvent} from "react";
import {FrameState} from "../../../../reducers/state";
import WorkerProxy from "../../../../WorkerProxy";
import Logo from '../../Header';
import { Segment, Button, Form, Header } from 'semantic-ui-react'

export interface MnemonicSubpageProps {
    mnemonic: string,
    workerProxy: WorkerProxy
}

export class Mnemonic extends React.Component<MnemonicSubpageProps, {}> {
    handleSubmit (ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault()
        this.props.workerProxy.didStoreMnemonic().then()
    }

    render () {
        return <Segment textAlign="center">
            <Logo />
            <Header as='h2'>
                Remember these words
                <Header.Subheader>
                    Save them somewhere safe and secret. <br />
                    These restore the wallet.
                </Header.Subheader>
            </Header>
            <Form onSubmit={this.handleSubmit.bind(this)}>
                <Form.Field control='textarea' rows='3' value={this.props.mnemonic} readOnly />
                <p>
                    <Button type='submit' primary>Done</Button>
                </p>
            </Form>
        </Segment>
    }
}

function mapStateToProps (state: FrameState): MnemonicSubpageProps {
    return {
        mnemonic: state.temp.initPage.mnemonic!,
        workerProxy: state.temp.workerProxy!
    }
}

export default connect<MnemonicSubpageProps, undefined, any>(mapStateToProps)(Mnemonic)
