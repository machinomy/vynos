import * as React from 'react'
import { connect } from 'react-redux'
import { Container, Menu, Form, Button, Icon } from 'semantic-ui-react'

const web3Utils = require('web3-utils')

const style = require('../styles/ynos.css')

const MAX_FILE_SIZE = 1048576 // 1mb

import { MINIMUM_PASSWORD_LENGTH, PASSWORD_CONFIRMATION_HINT_TEXT, PASSWORD_HINT_TEXT } from '../constants'
import WorkerProxy from '../WorkerProxy'
import { FrameState } from '../redux/FrameState'
import * as bip39 from 'bip39'

export interface OwnRestorePageProps {
  showVerifiable?: () => void
}

export interface RestorePageStateProps {
  workerProxy: WorkerProxy
}

export interface RestorePageProps extends RestorePageStateProps {
  goBack: () => void
}

export interface RestorePageState {
  seed?: string
  seedError?: string
  password?: string
  passwordConfirmation?: string
  passwordError?: string
  passwordConfirmationError?: string
  fileError?: string
  fileIsHex?: boolean
  fileIsJSON?: boolean
  fileValue?: string
  incorrectKeyFile?: boolean
}

class RestorePage extends React.Component<RestorePageProps & OwnRestorePageProps, RestorePageState> {
  constructor (props: RestorePageProps & OwnRestorePageProps) {
    super(props)
    this.state = { incorrectKeyFile: false }
    this.onDrag = this.onDrag.bind(this)
    this.onDrop = this.onDrop.bind(this)
  }

  static clickInpFile () {
    document.getElementById('inpFilePrivKey')!.click()
  }

  componentWillMount () {
    document.addEventListener('dragover', this.onDrag, false)
    document.addEventListener('drop', this.onDrop, false)
  }

  componentWillUnmount () {
    document.removeEventListener('dragover', this.onDrag, false)
    document.removeEventListener('drop', this.onDrop, false)
  }

  goBack () {
    this.props.goBack()
  }

  handleSubmit (ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    this.setState({ incorrectKeyFile: false })
    let state = this.state
    if (this.isValid() && state.password) {
      if (state.fileIsHex && state.fileValue) {
        this.props.workerProxy.restoreWallet(state.password, 'hex', state.fileValue).then((ok: string) => {
          if (ok === 'true') {
            localStorage.clear()
            this.goBack()
          } else {
            this.setState({ incorrectKeyFile: true })
          }
        })
      } else if (state.fileIsJSON && state.fileValue) {
        this.props.workerProxy.restoreWallet(state.password, 'json', state.fileValue).then((ok: string) => {
          if (ok === 'true') {
            localStorage.clear()
            this.goBack()
          } else {
            this.setState({ incorrectKeyFile: true })
          }
        })
      } else if (this.isValid() && state.seed) {
        this.props.workerProxy.restoreWallet(state.password, 'seed', state.seed).then(() => {
          localStorage.clear()
          this.goBack()
        })
      }
    }
  }

  isValid () {
    let passwordError = this.state.passwordError
    if (this.state.password && this.state.password.length < MINIMUM_PASSWORD_LENGTH) {
      passwordError = PASSWORD_HINT_TEXT
      this.setState({
        passwordError: passwordError
      })
    }

    let passwordConfirmationError = this.state.passwordConfirmationError
    if (this.state.passwordConfirmation !== this.state.password && this.state.passwordConfirmation) {
      passwordConfirmationError = PASSWORD_CONFIRMATION_HINT_TEXT
      this.setState({
        passwordConfirmationError: passwordConfirmationError
      })
    }

    let seedError = this.state.seedError
    if (this.state.seed && !bip39.validateMnemonic(this.state.seed)) {
      seedError = 'Probably mistyped seed phrase'
      this.setState({
        seedError: seedError
      })
    }

    return !(passwordError || passwordConfirmationError || seedError)
  }

  handleChangeSeed (ev: React.ChangeEvent<EventTarget>) {
    let value = (ev.target as HTMLInputElement).value
    this.setValue({
      seed: value
    })
  }

  handleChangePassword (ev: React.ChangeEvent<EventTarget>) {
    let value = (ev.target as HTMLInputElement).value
    this.setValue({
      password: value
    })
  }

  handleChangePasswordConfirmation (ev: React.ChangeEvent<EventTarget>) {
    let value = (ev.target as HTMLInputElement).value
    this.setValue({
      passwordConfirmation: value
    })
  }

  setValue (state: RestorePageState) {
    let base = {
      passwordError: undefined,
      passwordConfirmationError: undefined,
      seedError: undefined
    }
    let next = Object.assign(base, state)
    this.setState(next)
  }

  renderSeedInput () {
    if (this.state.fileIsHex || this.state.fileIsJSON) {
      return null
    }

    let className = style.mnemonicInput + ' ' + (this.state.seedError ? style.inputError : '')
    return (
      <textarea
        placeholder="Seed Phrase"
        className={className}
        rows={3}
        onChange={this.handleChangeSeed.bind(this)}
      />
    )
  }

  renderSeedHint () {
    if (this.state.fileIsHex || this.state.fileIsJSON) {
      return null
    }

    if (this.state.seedError) {
      return <span className={style.errorText}><i className={style.vynosInfo}/> {this.state.seedError}</span>
    } else {
      return <span className={style.passLenText}/>
    }
  }

  renderPasswordInput () {
    let className = this.state.passwordError ? style.inputError : ''
    return (
      <input
        type="password"
        placeholder="Password"
        className={className}
        autoComplete="new-password"
        onChange={this.handleChangePassword.bind(this)}
      />
    )
  }

  renderPasswordHint () {
    if (this.state.passwordError) {
      return <span className={style.errorText}><i className={style.vynosInfo}/> {this.state.passwordError}</span>
    } else {
      return <span className={style.passLenText}>At least {MINIMUM_PASSWORD_LENGTH} characters</span>
    }
  }

  renderPasswordConfirmationInput () {
    let className = this.state.passwordConfirmationError ? style.inputError : ''
    return (
      <input
        type="password"
        placeholder="Password Confirmation"
        className={className}
        autoComplete="new-password"
        onChange={this.handleChangePasswordConfirmation.bind(this)}
      />
    )
  }

  renderPasswordConfirmationHint () {
    if (this.state.passwordConfirmationError) {
      return <span className={style.errorText}><i className={style.vynosInfo}/> {this.state.passwordConfirmationError}</span>
    } else {
      return <span className={style.errorText}>&nbsp;</span>
    }
  }

  renderPrivKeyText () {
    if (this.state.fileIsHex) {
      return <div>And now set the password</div>
    } else if (this.state.fileIsJSON) {
      return <div>And now set the password for unlocking</div>
    } else {
      return <a onClick={RestorePage.clickInpFile} style={{ float: 'right' }}>Select private key file</a>
    }

  }

  changeInputFile (event: React.ChangeEvent<HTMLInputElement>) {
    let files: FileList | null = event.target.files
    if (files && files.length) {
      this.checkFile(files[0])
    } else {
      this.setState({ fileError: '', fileIsHex: false, fileIsJSON: false, incorrectKeyFile: false })
    }
  }

  checkFile (file: File) {
    if (file.size > MAX_FILE_SIZE) {
      this.setState({ fileError: 'File too large', fileIsHex: false, fileIsJSON: false })
      return
    }

    let reader = new FileReader()
    reader.onload = (file: any) => {
      let f = file.target.result

      if (web3Utils.isHex(f)) {
        this.setState({ fileIsHex: true, fileValue: f })
      } else {
        this.setState({ fileIsHex: false })

        try {
          this.setState({ fileIsJSON: true, fileValue: f })
        } catch (e) {
          this.setState({ fileIsJSON: false })
        }
      }
    }
    reader.readAsText(file)
  }

  onDrag (event: any) {
    event.stopPropagation()
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  }

  onDrop (event: any) {
    event.stopPropagation()
    event.preventDefault()
    let files: FileList | null = event.dataTransfer.files
    if (files && files.length) {
      this.checkFile(files[0])
    } else {
      this.setState({ fileError: '', fileIsHex: false, fileIsJSON: false, incorrectKeyFile: false })
    }
  }

  render () {
    return (
      <div>
        <Menu className={style.clearBorder}>
          <Menu.Item link={true} className={style.menuIntoOneItemFluid} onClick={this.goBack.bind(this)}>
            <i className={style.vynosArrowBack}/> Restore a Wallet
          </Menu.Item>
        </Menu>
        <Container textAlign="center">
          <Form className={style.encryptionForm} onSubmit={this.handleSubmit.bind(this)}>
            <div style={{ marginBottom: '10px' }}>
              {(this.state.incorrectKeyFile) ?
                <span style={{ fontSize: '16px' }} className={style.errorText}>Incorrect key file</span> : ''}
            </div>
            <Form.Field className={style.clearIndent}>
              {this.renderSeedInput()}
              {this.renderSeedHint()}
              {this.renderPrivKeyText()}
            </Form.Field>
            <div><span className={style.errorText}>{this.state.fileError}</span></div>
            <input
              type="file"
              id={'inpFilePrivKey'}
              style={{ display: 'none' }}
              onChange={this.changeInputFile.bind(this)}
            />
            <Form.Field className={style.clearIndent}>
              {this.renderPasswordInput()}
              {this.renderPasswordHint()}
            </Form.Field>
            <Form.Field className={style.clearIndent}>
              {this.renderPasswordConfirmationInput()}
              {this.renderPasswordConfirmationHint()}
            </Form.Field>
            <Button type="submit" content="Restore" primary={true} className={style.buttonNav}/>
          </Form>
        </Container>
        <a onClick={this.props.showVerifiable} id={style.shieldIcon}><Icon name={'shield'} size={'large'}/></a>
      </div>
    )
  }
}

function mapStateToProps (state: FrameState, props: OwnRestorePageProps): RestorePageStateProps & OwnRestorePageProps {
  return {
    workerProxy: state.temp.workerProxy,
    showVerifiable: props.showVerifiable
  }
}

export default connect(mapStateToProps)(RestorePage)
