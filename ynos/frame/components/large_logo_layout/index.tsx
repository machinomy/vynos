import * as React from "react";
//import LargeLogo from "./large_logo.svg";

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

export default class LargeLogoLayout extends React.Component<LargeLogoLayoutProps, undefined> {
  render () {
    return <div>
      <div style={logoContainerStyle}>
        <p>LargeLogo style=logoStyle </p>
      </div>
      <div style={childrenContainerStyle} className="large-logo-layout">
        {this.props.children}
      </div>
    </div>
  }
}
