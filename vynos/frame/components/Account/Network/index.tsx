import * as React from "react";
import { Container, Form, Radio } from 'semantic-ui-react'
const style = require("../../../styles/ynos.css");


export interface NetworkProps {
}

export interface NetworkState {
  value: string
}

export class Network extends React.Component<NetworkProps, NetworkState> {

  networks: [string];

  constructor () {
    super();
  }

  componentDidMount(){
    this.networks = ['Ropsten', 'Rinkeby', 'Main'];
    this.setState({value: 'Ropsten'});
  }

  setRadio (ev: Event, input: HTMLInputElement) {
    this.setState({value: input.value})
  }

  render () {
    return (
      <Container className={style.clearBorder}>
        <Form className={style.formNetwork}>
          <Form.Group grouped>
            {this.networks && this.networks.map((network) => {
              return <Form.Field key={network}><Radio name={'network'} label={network} value={network}
                                        onChange={this.setRadio.bind(this)}
                                        checked={this.state.value === network} style={{width: '100%'}} disabled/></Form.Field>
            })}
          </Form.Group>
        </Form>
      </Container>
    )
  }
};

export default Network;
