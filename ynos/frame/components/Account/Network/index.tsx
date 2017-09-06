import * as React from "react";
import { Container, Form, Radio, Button } from 'semantic-ui-react'
const style = require("../../../styles/ynos.css");


export interface NetworkProps { }

//const Network: React.SFC<NetworkProps> = (props) => {
export class Network extends React.Component<any, any> {


    render() {

        return (
            <Container className={`${style.clearBorder}`}>
                <Form className={style.formNetwork}>
                    <Form.Group grouped>
                        <Form.Field control={Radio} label='One' value='1' />
                    </Form.Group>
                    <Form.Group grouped>
                        <Form.Field control={Radio} label='Two' value='2'  />
                    </Form.Group>
                    <Form.Group grouped>
                        <Form.Field control={Radio} label='Three' value='3'  />
                    </Form.Group>
                </Form>
            </Container>
        )
    }
};

export default Network;