import * as React from "react";
import { Container, Menu, Form, Button, Divider } from 'semantic-ui-react'
const style = require("../../../../styles/ynos.css");

import {MINIMUM_PASSWORD_LENGTH} from '../../../../fileWithConstants';


const Restoration: React.SFC<any> = (props) => {
    return <div>
        <Menu className={style.clearBorder}>
            <Menu.Item
                link
                className={style.menuIntoOneItemFluid}
                onClick={() => props.history.goBack()}>
                    <i className={style.vynosArrowBack}></i>Restore A Wallet
            </Menu.Item>
        </Menu>
        <Container textAlign="center">
            <Form className={style.encryptionForm}>
                <Form.Group widths='equal'>
                    <Form.Field className={style.clearIndent}>
                        <input type="password" placeholder='Password' />
                        <span className={style.passLenText}>At least {MINIMUM_PASSWORD_LENGTH} characters</span>
                    </Form.Field>
                    <Form.Field className={style.clearIndent}>
                        <input type="password" placeholder='Password Confirmation'/>
                    </Form.Field>
                </Form.Group>
                <Divider hidden />
                <Button type='submit' content="Restore" primary className={style.buttonNav} />
            </Form>
        </Container>
    </div>
};

export default Restoration;