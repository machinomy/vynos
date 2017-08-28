import * as React from "react";
import { Link } from 'react-router-dom';
import { Icon, Menu, Dropdown, Button } from 'semantic-ui-react'


export interface AccountProps { }

const Account: React.SFC<AccountProps> = (props) => {
    return <div>
        <Menu size='small'>
            <Menu.Menu>
                <Dropdown text='Wallet' pointing className='link item'>
                    <Dropdown.Menu>
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
            <Menu.Menu>
                <Menu.Item>
                    <img src={require('../styles/images/menu_logo.svg')} />
                </Menu.Item>
                <Menu.Item>
                    <Button primary>Lock</Button>
                </Menu.Item>
            </Menu.Menu>
        </Menu>
        {props.children}
    </div>
};

export default Account;