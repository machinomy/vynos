import * as React from 'react'
import { Button, Divider } from 'semantic-ui-react'
import * as qr from 'qr-image'

const style = require('../../styles/ynos.css')

export interface AddressSubpageProps {
  address: string
  network: string
  showSend (): void
}

export interface AddressSubpageState {
  copyToClipboardText: string
}

const LABEL_COPY_TO_CLIPBOARD = 'Copy to Clipboard'
const LABEL_COPIED = 'Copied'

export default class AddressSubpage extends React.Component<AddressSubpageProps, AddressSubpageState> {
  constructor (props: AddressSubpageProps) {
    super(props)
    this.state = {
      copyToClipboardText: LABEL_COPY_TO_CLIPBOARD
    }
  }

  etherscanLink (): string {
    switch (this.props.network) {
      case 'Ropsten': return `https://ropsten.etherscan.io/address/${this.props.address}`
      case 'Rinkeby': return `https://rinkeby.etherscan.io/address/${this.props.address}`
      case 'Main': return `https://etherscan.io/address/${this.props.address}`
      default: return 'about:blank'
    }
  }

  didCopy () {
    this.setState({
      copyToClipboardText: LABEL_COPIED
    })
    setTimeout(() => {
      this.setState({
        copyToClipboardText: LABEL_COPY_TO_CLIPBOARD
      })
    }, 1200)
  }

  renderQR () {
    let pngBuffer = qr.imageSync(this.props.address, { type: 'png', margin: 1 }) as Buffer
    let dataURI = 'data:image/png;base64,' + pngBuffer.toString('base64')
    return <img className="react-qr" src={dataURI} />
  }

  renderLink () {
    if (this.props.network) {
      return <a href={this.etherscanLink()} target="_blank">View on Etherscan</a>
    } else {
      return <span>&nbsp;</span>
    }
  }

  render () {
    return (
      <div className={style.walletAddressSubpage}>
        <div className={style.walletAddressSubpageButtons}>
          <div className={style.walletAddressSubpageButtonsSingle}>
            <Button type="submit" content="Refill" className={style.buttonNav} disabled={true} />
          </div>
          <div className={style.walletAddressSubpageButtonsSingle}>
            <Button type="submit" content="Send" className={style.buttonNav} onClick={this.props.showSend.bind(this)} />
          </div>
        </div>
        <Divider hidden={true} />
        <p className={style.walletAddressSubpageParagraph}>
          {this.props.address}
        </p>
        <p className={style.walletAddressSubpageParagraph}>
          {this.renderLink()}
        </p>
        <Divider hidden={true} />
        <p className={style.walletAddressSubpageParagraph}>
          {this.renderQR()}
        </p>
      </div>
    )
  }
}
