import React from 'react'
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import injectTapEventPlugin from "react-tap-event-plugin";

injectTapEventPlugin();

const BLUE_THEME = getMuiTheme({
  fontFamily: ['Source Sans Pro', 'sans-serif'],
  fontSize: 16,
  palette: {
    primary1Color: '#0071BC',
    accent1Color: '#29ABE2'
  }
});

export default class ThemeProvider extends React.Component<any, any> {
  render () {
    return <MuiThemeProvider muiTheme={BLUE_THEME}>
      {this.props.children}
    </MuiThemeProvider>
  }
}
