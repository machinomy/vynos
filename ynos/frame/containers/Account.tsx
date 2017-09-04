import * as React from "react";
import { Link } from 'react-router-dom';
import { Icon, Menu, Dropdown, Button } from 'semantic-ui-react'
const style = require("../styles/ynos.css");

export interface AccountProps { }

const Account: React.SFC<AccountProps> = (props) => {
    return <div>
        <Menu className={style.clearBorder}>
            <Menu.Menu className={style.menuIntoOneItemFluid}>
                <Dropdown
                    icon={
                        <div className={`${style.hamburger} ${style.hamburgerSpin}`}>
                            <div className={style.hamburgerBox}>
                                <div className={style.hamburgerInner} />
                            </div>
                        </div>
                    }
                    id={style.menuItemFluid}
                    pointing
                    className="link"
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
                        <Dropdown.Item as={Link} to='/frame.html'>Wallet</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item as={Link} to='/channels'>Channels</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item as={Link} to='/preferences'>Preferences</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item as={Link} to='/network'>Network</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Menu.Menu>
        </Menu>
        {props.children}
    </div>
};

export default Account;