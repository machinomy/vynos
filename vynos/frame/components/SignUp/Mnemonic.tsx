import * as React from "react";
import {connect} from "react-redux";
import {FormEvent} from "react";
import {AppFrameState} from "../../reducers/state";
import WorkerProxy from "../../WorkerProxy";
import Logo from './Logo'
import { Container, Button, Form, Header, Divider } from 'semantic-ui-react'
const style = require('../../styles/ynos.css')

export interface MnemonicSubpageProps {
  mnemonic: string,
  workerProxy: WorkerProxy
}

export class Mnemonic extends React.Component<MnemonicSubpageProps, {}> {
  handleSubmit (ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    this.props.workerProxy.didStoreMnemonic()
  }

  render () {
    console.log('Mnemonic Render')
    return <Container textAlign="center" className={`${style.flexContainer} ${style.clearBorder}`}>
      <Logo />
      <Divider hidden />
      <Header as='h1' className={style.mnemonicHeader}>
        Remember these words
        <Header.Subheader>
          Save them somewhere safe and secret. <br />
          These restore the wallet.
        </Header.Subheader>
      </Header>
      <Form onSubmit={this.handleSubmit.bind(this)} className={style.mnemonicForm}>
        <Form.Field control='textarea' rows='3' value={this.props.mnemonic} readOnly />
        <Divider hidden />
        <Button type='submit' content="Done" primary className={style.buttonNav} />
      </Form>
    </Container>
  }
}

function mapStateToProps (state: AppFrameState): MnemonicSubpageProps {
  return {
    mnemonic: state.temp.initPage.mnemonic!,
    workerProxy: state.temp.workerProxy!
  }
}

export default connect<MnemonicSubpageProps, undefined, any>(mapStateToProps)(Mnemonic)
