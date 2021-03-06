import * as React from 'react'
import { Container, Menu, List, Button } from 'semantic-ui-react'
const style = require('../../../styles/ynos.css')

const Refill: React.SFC<any> = (props) => {
  return (
    <div>
      <Menu className={style.clearBorder}>
          <Menu.Item link={true} className={style.menuIntoOneItemFluid}><i className={style.vynosArrowBack}/>Refill</Menu.Item>
      </Menu>
      <Container>
          <List>
              <List.Item>
                  <List.Header>Using US dollars</List.Header>
                  <span>for US citizens only</span>
                  <p className={style.buttonNav}>
                      <Button content="Via coinbase" primary={true} />
                  </p>
              </List.Item>
              <List.Item>
                  <List.Header>Using cryptocurrency</List.Header>
                  <p className={style.buttonNav}>
                      <Button content="Via changelly" primary={true} />
                  </p>
              </List.Item>
          </List>
      </Container>
  </div>
  )
}

export default Refill
