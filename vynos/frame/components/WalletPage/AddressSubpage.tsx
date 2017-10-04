import * as React from 'react'
import { Container, Menu, Form, Button, Divider } from 'semantic-ui-react'
import CopyToClipboard = require('react-copy-to-clipboard')

const style = require('../../styles/ynos.css')

export interface AddressSubpageProps {
  address: string | null
}

export interface AddressSubpageState {
  copyToClipboardText: string
}

function etherscanLink(hexAddress: string): string {
  return `https://ropsten.etherscan.io/address/${hexAddress}` // FIXME Networks
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

  render () {
    if (!this.props.address) {
      return <p>Loading...</p>
    }

    return <div className={style.walletAddressSubpage}>
      <div className={style.walletAddressSubpageButtons}>
        <div className={style.walletAddressSubpageButtonsSingle}>
          <Button type="submit" content="Refill" className={style.buttonNav} disabled />
        </div>
        <div className={style.walletAddressSubpageButtonsSingle}>
          <Button type="submit" content="Send" className={style.buttonNav} disabled />
        </div>
      </div>
      <Divider hidden />
      <p className={style.walletAddressSubpageParagraph}>
        {this.props.address}
      </p>
      <p className={style.walletAddressSubpageParagraph}>
        <a href={etherscanLink(this.props.address)} target="_blank">View on Etherscan</a>
      </p>
      <p className={style.walletAddressSubpageParagraph}>
        <CopyToClipboard text={this.props.address} onCopy={this.didCopy.bind(this)}>
          <Button type="submit"
                  content={this.state.copyToClipboardText}
                  primary
                  className={style.buttonNav} />
        </CopyToClipboard>
      </p>
      <Divider hidden />
      <p>QR</p>
    </div>
  }
}
