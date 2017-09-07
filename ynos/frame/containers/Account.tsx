import * as React from "react";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Menu, Dropdown, Button } from 'semantic-ui-react'
import {MenuState} from '../reducers/menu';
const style = require("../styles/ynos.css");



class Account extends React.Component<any, any> {

    render() {
        console.log(this.props);
        console.log('-------------------------')
        const { dispatch, children, currentMenuItem } = this.props;

        return <div>
            <Menu className={style.clearBorder}>
                <Menu.Menu className={style.menuIntoOneItemFluid}>
                    <Button icon className={style.btnLock}>
                        <i className={style.vynosLock}></i>
                    </Button>
                    <Dropdown text={currentMenuItem}
                        icon={
                            <div className={`${style.hamburger} ${style.hamburgerSpin}`}>
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

                                console.log('cliked');
                            }
                        }

                        onClose={
                            () => {
                                console.log('closed')
                            }
                        } >
                        <Dropdown.Menu className={style.submenuFluid}>
                            <Dropdown.Item as={Link} to='/frame.html' onClick={() => dispatch({type:"CHANGE_CURRENT_MENU_ITEM", menuItem: "Wallet"})}>Wallet</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item as={Link} to='/channels' onClick={() => dispatch({type:"CHANGE_CURRENT_MENU_ITEM", menuItem: "Channels"})}>Channels</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item as={Link} to='/preferences' onClick={() => dispatch({type:"CHANGE_CURRENT_MENU_ITEM", menuItem: "Preferences"})}>Preferences</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item as={Link} to='/network' onClick={() => dispatch({type:"CHANGE_CURRENT_MENU_ITEM", menuItem: "Network"})}>Network</Dropdown.Item>
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
    }
);

export default connect(mapStateToProps)(Account);