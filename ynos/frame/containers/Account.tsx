import * as React from "react";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Menu, Dropdown, Button, Image } from 'semantic-ui-react'
//import {MenuState} from '../reducers/menu';
const style = require("../styles/ynos.css");



class Account extends React.Component<any, any> {

    render() {
        console.log(this.props);
        console.log('-------------------------')
        const { dispatch, children, currentMenuItem, submenuShowState} = this.props;

        return <div>
            <Menu className={`${style.clearBorder} ${currentMenuItem.toLowerCase() === 'wallet' ?  style.clearIndent : ''}`}>
                <Menu.Menu className={`${style.menuIntoOneItemFluid} ${currentMenuItem.toLowerCase() === 'wallet' ? style.clearShadow : ''}`}>
                    <Button icon className={style.btnLock}>
                        <i className={style.vynosLock}></i>
                    </Button>
                    <Image src={require('../styles/images/menu_logo.svg')} size='tiny' centered className={
                        `${style.menuLogo} ${submenuShowState ? style[submenuShowState] : " " }`} />
                    <Dropdown text={`${!submenuShowState ? currentMenuItem : ""}`}
                        icon={
                            <div className={`${style.hamburger} ${style.hamburgerSpin} ${submenuShowState ? style[submenuShowState] : " " }`}>
                                <div className={style.hamburgerBox}>
                                    <div className={style.hamburgerInner} />
                                </div>
                            </div>
                        }
                        id={style.menuItemFluid}
                        pointing
                        className='link'
                        onOpen={
                            () => {
                                dispatch({type:"SET_SUBMENU_SHOW_STATE", className: "is-active"})
                            }
                        }

                        onClose={
                            () => {
                                dispatch({type:"SET_SUBMENU_SHOW_STATE", className: ""})
                            }
                        } >
                        <Dropdown.Menu className={style.submenuFluid}>
                            <Dropdown.Item as={Link} to='/frame.html' onClick={() => dispatch({type:"SET_CURRENT_MENU_ITEM", menuItem: "Wallet"})}>Wallet</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item as={Link} to='/channels' onClick={() => dispatch({type:"SET_CURRENT_MENU_ITEM", menuItem: "Channels"})}>Channels</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item as={Link} to='/preferences' onClick={() => dispatch({type:"SET_CURRENT_MENU_ITEM", menuItem: "Preferences"})}>Preferences</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item as={Link} to='/network' onClick={() => dispatch({type:"SET_CURRENT_MENU_ITEM", menuItem: "Network"})}>Network</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Menu>
            </Menu>
            {children}
        </div>
    }
}

const mapStateToProps = (state:any):any => (
    {
        currentMenuItem: state.menu.topmenu.currentMenuItem,
        submenuShowState: state.menu.topmenu.submenuShowState
    }
);

export default connect(mapStateToProps)(Account);