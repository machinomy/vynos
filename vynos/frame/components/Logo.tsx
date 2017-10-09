import * as React from 'react'
import { Image } from 'semantic-ui-react'

const logoImage = require('../styles/images/sign-in_logo.svg')

const VYNOS_STYLE = {
  font: "400 40px 'Alegreya Sans', sans-serif",
  color: "#D04071",
  lineHeight: "0"
}

const Logo = () => {
  return <div style={{width: '100px'}} >
    <Image src={logoImage} centered/>
    <h1 style={VYNOS_STYLE}>vynos</h1>
  </div>
}

export default Logo;
