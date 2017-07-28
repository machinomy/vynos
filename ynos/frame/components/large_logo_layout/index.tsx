import * as React from "react";
//import LargeLogo from "./large_logo.svg";
import Typography from '@react-mdc/typography'

const logoContainerStyle = {
  width: '100%',
  height: 140,
  textAlign: 'center',
};

const logoStyle = {
  height: 110,
  align: 'center',
  marginTop: 20,
  marginBottom: 10
};

const childrenContainerStyle = {
  paddingLeft: 40,
  paddingRight: 40
};

export interface LargeLogoLayoutProps {
  children: any
}

export default class LargeLogoLayout extends React.Component<LargeLogoLayoutProps, {}> {
  render () {
    return <div>
      <div style={logoContainerStyle}>
        <Typography>
          <Typography.Text textStyle="title">VYNOS</Typography.Text>
        </Typography>
      </div>
      <div style={childrenContainerStyle} className="large-logo-layout">
        {this.props.children}
      </div>
    </div>
  }
}
