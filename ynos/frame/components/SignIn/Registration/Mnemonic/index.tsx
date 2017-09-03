import * as React from "react";
import {connect} from "react-redux";
import {CSSProperties, FormEvent} from "react";
import {FrameState} from "../../../../reducers/state";
import WorkerProxy from "../../../../WorkerProxy";
import Logo from '../../Header';
import { Container, Button, Form, Header } from 'semantic-ui-react'
const style = require("../../../../styles/ynos.css");

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
        return <Container textAlign="center" className={`${style.flexContainer} ${style.clearBorder}`}>
                    <p className={style.signInLogo}>
                        <Logo />
                    </p>
                    <Header as='h1' className={style.mnemonicHeader}>
                        Remember these words
                        <Header.Subheader>
                            Save them somewhere safe and secret. <br />
                            These restore the wallet.
                        </Header.Subheader>
                    </Header>
                    <Form onSubmit={this.handleSubmit.bind(this)} className={style.mnemonicForm}>
                        <Form.Field control='textarea' rows='2' value={this.props.mnemonic} readOnly autoHeight />
                        <p className={style.buttonNav}>
                            <Button type='submit' primary>Done</Button>
                        </p>
                    </Form>
            </Container>
    }
}

function mapStateToProps (state: FrameState): MnemonicSubpageProps {
    return {
        mnemonic: state.temp.initPage.mnemonic!,
        workerProxy: state.temp.workerProxy!
    }
}

export default connect<MnemonicSubpageProps, undefined, any>(mapStateToProps)(Mnemonic)
