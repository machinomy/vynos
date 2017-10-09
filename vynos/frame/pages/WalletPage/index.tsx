import * as React from "react";
import { Menu, Dropdown, Button, Image } from 'semantic-ui-react'
import {connect} from "react-redux";
import WorkerProxy from "../../WorkerProxy";
import WalletMenuItem from "../WalletMenu/WalletMenuItem";
import {FrameState} from "../../redux/FrameState";

const style = require('../../styles/ynos.css')

const SIGN_IN_LOGO = require('../../styles/images/sign-in_logo.svg')

export interface WalletMenuState {
  isOpen: boolean
  currentName: string
}

export interface WalletMenuStateProps {
  workerProxy: WorkerProxy
}

export type WalletMenuProps = WalletMenuStateProps

export class WalletMenu extends React.Component<WalletMenuProps, WalletMenuState> {

  constructor (props: WalletMenuProps) {
    super(props)
    this.state = {
      isOpen: false,
      currentName: 'Wallet'
    }
  }

  handleLockButton () {
    this.props.workerProxy.doLock()
  }

  handleOpenDropdown () {
    this.setState({
      isOpen: true
    })
  }

  handleCloseDropdown () {
    this.setState({
      isOpen: false
    })
  }

  renderHamburgerIcon () {
    return <div className={`${style.hamburger} ${style.hamburgerSpin} ${this.isActiveClassName()}`}>
      <div className={style.hamburgerBox}>
        <div className={style.hamburgerInner} />
      </div>
    </div>
  }

  isActiveClassName () {
    return this.state.isOpen ? style.isActive : ''
  }

  dropdownText () {
    if (!this.state.isOpen) {
      return this.state.currentName
    }
  }

  renderLogo () {
    let className = style.menuLogo
    if (this.state.isOpen) {
      className = className + ' ' + style.isActive
    }
    return <Image src={SIGN_IN_LOGO}
                  size='mini'
                  centered
                  className={className} />
  }

  handleChangeItem (name: string) {
    this.setState({
      currentName: name
    })
  }

  renderChildren () {
    switch (this.state.currentName) {
      case 'Dashboard':
        return <p>Dashboard</p>
      case 'Channels':
        return <p>Channels</p>
      case 'Preferences':
        return <p>Preferences</p>
      case 'Network':
        return <p>Network</p>
    }
  }

  render() {
    return <div className={style.walletMenuContainer}>
      <Menu style={{margin: 0}} className={style.walletMenu}>
        <Menu.Menu className={style.menuIntoOneItemFluid}>
          <Button icon
                  className={style.btnLock}
                  style={{order: 2, zIndex: 10, background: 'transparent', width: '65px', margin: '0 0 0 -65px', padding: 0, height: '4rem'}}
                  onClick={this.handleLockButton.bind(this)}>
            <i className={style.vynosLock}/>
          </Button>
          {this.renderLogo()}
          <Dropdown text={this.dropdownText()}
                    icon={this.renderHamburgerIcon()}
                    id={style.menuItemFluid}
                    pointing
                    className='link'
                    onOpen={this.handleOpenDropdown.bind(this)}
                    onClose={this.handleCloseDropdown.bind(this)} >
            <Dropdown.Menu className={style.submenuFluid}>
              <WalletMenuItem name='Dashboard' onChange={this.handleChangeItem.bind(this)} />
              <Dropdown.Divider />
              <WalletMenuItem name='Channels' onChange={this.handleChangeItem.bind(this)} />
              <Dropdown.Divider />
              <WalletMenuItem name='Preferences' onChange={this.handleChangeItem.bind(this)} />
              <Dropdown.Divider />
              <WalletMenuItem name='Network' onChange={this.handleChangeItem.bind(this)} />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
      {this.renderChildren()}
    </div>
  }
}

function mapStateToProps(state: FrameState): WalletMenuStateProps {
  return {
    workerProxy: state.temp.workerProxy
  }
}

export default connect(mapStateToProps)(WalletMenu)
