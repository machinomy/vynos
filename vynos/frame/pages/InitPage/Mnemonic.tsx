import * as React from 'react'
import { connect } from 'react-redux'
import { FrameState } from '../../redux/FrameState'
import WorkerProxy from '../../WorkerProxy'
import { Container, Button, Form, Header, Divider, Tab } from 'semantic-ui-react'
const style = require('../../styles/ynos.css')
import * as qr from 'qr-image'
import Logo from '../../components/Logo'

export interface MnemonicStateProps {
  workerProxy?: WorkerProxy
  showVerifiable?: () => void
}

export interface MnemonicProps extends MnemonicStateProps {
  mnemonic?: string
}

export class Mnemonic extends React.Component<MnemonicProps, {}> {
  renderTabs: any
  renderOnlySeedPhrase: any

  mnemonicTabPanes = [
    { menuItem: 'Words', render: () =>
        (
          <Tab.Pane attached={false}>
            <Header as="h1" className={style.mnemonicHeader}>
              Remember these words
              <Header.Subheader>
                Save them somewhere safe and secret. <br />
                These restore the wallet.
              </Header.Subheader>
            </Header>

            <Form.Field control="textarea" rows="3" value={this.props.mnemonic} readOnly={true} className={style.mnemonicTextarea} />
            <p className={style.mnemonicSaveToFile}>
              <a onClick={this.handleSaveToFile.bind(this)}>Save words to file</a>
            </p>
          </Tab.Pane>
        )
    },
    { menuItem: 'QR', render: () =>
        (
          <Tab.Pane attached={false}>
            <Header as="h1" className={style.mnemonicHeader}>
              OR scan this
            </Header>
            {this.renderQR()}
          </Tab.Pane>
        )
    }]

  constructor (props: MnemonicProps) {
    super(props)

    this.renderTabs = (
      <Container textAlign="center" className={`${style.flexContainer} ${style.clearBorder}`}>
        <Form onSubmit={this.handleSubmit.bind(this)} className={style.mnemonicForm}>
          <Tab menu={{ pointing: true }} panes={this.mnemonicTabPanes} className={style.mnemonicTabs} />
          <Divider hidden={true}/>
          <Button type="submit" content="Done" primary={true} className={style.buttonNav}/>
        </Form>
      </Container>
    )

    this.renderOnlySeedPhrase = (
      <Container textAlign="center" className={`${style.flexContainer} ${style.clearBorder}`}>
        <Logo />
        <Divider hidden={true} />
        <Header as="h1" className={style.mnemonicHeader}>
          Remember these words
          <Header.Subheader>
            Save them somewhere safe and secret. <br />
            These restore the wallet.
          </Header.Subheader>
        </Header>
        <Form onSubmit={this.handleSubmit.bind(this)} className={style.mnemonicForm}>
          <Form.Field control="textarea" rows="3" value={this.props.mnemonic} readOnly={true} className={style.mnemonicTextarea} />
          <Divider hidden={true} />
          <Button type="submit" content="Done" primary={true} className={style.buttonNav} />
          <p>
            <a onClick={this.handleSaveToFile.bind(this)}>Save words to file</a>
          </p>
        </Form>
      </Container>
    )
  }

  handleSubmit (ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    this.props.workerProxy!.didStoreMnemonic()
  }

  renderQR () {
    let mnemonic = this.props.mnemonic
    let pngBuffer = qr.imageSync(mnemonic!, { type: 'png', margin: 1 }) as Buffer
    let dataURI = 'data:image/png;base64,' + pngBuffer.toString('base64')
    return <img className="react-qr mnemonic-qr" src={dataURI} />
  }

  handleSaveToFile () {
    let mnemonic = this.props.mnemonic
    let blob = new Blob([mnemonic], { type: 'text/plain' })
    let filename = 'secretSeedPhrase.txt'
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, filename)
    } else {
      let elem = window.document.createElement('a')
      elem.href = window.URL.createObjectURL(blob)
      elem.download = filename
      document.body.appendChild(elem)
      elem.click()
      document.body.removeChild(elem)
    }
  }

  render () {
    return process.env.QR_TAB ? this.renderTabs : this.renderOnlySeedPhrase
  }
}

function mapStateToProps (state: FrameState, props: MnemonicProps): MnemonicStateProps {
  return {
    workerProxy: state.temp.workerProxy,
    showVerifiable: props.showVerifiable
  }
}

export default connect(mapStateToProps)(Mnemonic)
