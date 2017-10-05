import * as React from "react";
import { Menu, Dropdown, Button, Image } from 'semantic-ui-react'
import {Redirect, RouterProps} from "react-router";
import {isUnlockPageExpected} from "../routes/filters";
import {connect} from "react-redux";
import {FrameState} from "../state/FrameState";
import WalletMenuItem from './WalletMenu/WalletMenuItem'
import WorkerProxy from "../WorkerProxy";
import {setWorkerProxy} from "../actions/temp";

const style = require("../styles/ynos.css");


export interface WalletMenuState {
  isOpen: boolean
  currentName: string
}

export interface WalletMenuStateProps {
  isUnlockPageExpected: boolean
  workerProxy: WorkerProxy
}

export type WalletMenuProps = WalletMenuStateProps & { children: Element[] } & RouterProps

export class WalletMenu extends React.Component<WalletMenuProps, WalletMenuState> {

  constructor (props: WalletMenuProps) {
    super(props)
    console.log(props)
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
    return <Image src={require('../styles/images/sign-in_logo.svg')}
                  size='mini'
                  centered
                  className={className} />
  }

  handleChangeItem (href: string, name: string) {
    this.setState({
      currentName: name
    })
  }

  render() {
    if (this.props.isUnlockPageExpected) {
      return <Redirect to='/' />
    } else {
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
                <WalletMenuItem name='Wallet' href='/wallet' onChange={this.handleChangeItem.bind(this)} />
                <Dropdown.Divider />
                <WalletMenuItem name='Channels' href='/wallet/channels' onChange={this.handleChangeItem.bind(this)} />
                <Dropdown.Divider />
                <WalletMenuItem name='Preferences' href='/wallet/preferences' onChange={this.handleChangeItem.bind(this)} />
                <Dropdown.Divider />
                <WalletMenuItem name='Network' href='/wallet/network' onChange={this.handleChangeItem.bind(this)} />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Menu>
        {this.props.children}
      </div>
    }
  }
}

function mapStateToProps(state: FrameState): WalletMenuStateProps {
  return {
    isUnlockPageExpected: isUnlockPageExpected(state),
    workerProxy: state.temp.workerProxy!
  }
}

export default connect(mapStateToProps)(WalletMenu)
