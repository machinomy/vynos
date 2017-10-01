import * as React from 'react'
import { Image } from 'semantic-ui-react'

const VYNOS_STYLE = {
  font: "400 40px 'Alegreya Sans', sans-serif",
  color: "#D04071",
  lineHeight: "0"
}

const Header = () => {
  return <div style={{width: '100px'}} >
    <Image src={require('../../../styles/images/sign-in_logo.svg')} centered/>
    <h1 style={VYNOS_STYLE}>vynos</h1>
  </div>
}

export default Header;
