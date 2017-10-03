import * as React from 'react'
import {Link} from 'react-router-dom'
import {Dropdown} from 'semantic-ui-react'

export interface WalletMenuItemProps {
  name: string
  href: string
  onChange: (href: string, name: string) => void
}

export default class WalletMenuItem extends React.Component<WalletMenuItemProps, {}> {
  constructor (props: WalletMenuItemProps) {
    super(props)
  }

  handleClick () {
    this.props.onChange(this.props.href, this.props.name)
  }

  render () {
    return <Dropdown.Item as={Link} to={this.props.href} onClick={this.handleClick.bind(this)}>
      {this.props.name}
    </Dropdown.Item>
  }
}
