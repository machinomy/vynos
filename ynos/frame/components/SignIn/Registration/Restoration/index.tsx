import * as React from "react";
import { Container, Menu, Form, Button } from 'semantic-ui-react'
const style = require("../../../../styles/ynos.css");


const Restoration: React.SFC<any> = (props) => {
    return <div>
        <Menu className={style.clearBorder}>
            <Menu.Item link className={style.menuIntoOneItemFluid}><i className={style.vynosArrowBack}></i>Restore A Wallet</Menu.Item>
        </Menu>
        <Container>
            <Form>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <input type="password" placeholder='Password' />
                    </Form.Field>
                    <Form.Field>
                        <input type="password" placeholder='Password Confirmation' />
                    </Form.Field>
                </Form.Group>
                <p className={`${style.buttonNav} ${style.textCenter}`}>
                    <Button type='submit' content="Restore" primary />
                </p>
            </Form>
        </Container>
    </div>
};


export default Restoration;