import * as React from "react";
import { Container, Form, Button } from 'semantic-ui-react'
const style = require("../../../styles/ynos.css");

export interface PreferencesProps { }

const Preferences: React.SFC<PreferencesProps> = (props) => {
    return <Container className={`${style.clearBorder}`}>
        <Form>
            <Form.Group grouped>
                <label>Channels</label>
                <Form.Checkbox label='Ask to create' disabled/>
                <Form.Checkbox label='Throttling' disabled/>
            </Form.Group>
            <Form.Group grouped>
                <label>Micropayments</label>
                <Form.Input placeholder='Maximum micropayment' disabled/>
                <Form.Checkbox label='Throttling' disabled/>
            </Form.Group>
            <p className={style.buttonNav}>
                <Button type='submit' content="Save" primary disabled/>
            </p>
        </Form>
    </Container>
};

export default Preferences;
