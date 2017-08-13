import * as React from 'react';
import TermsSubpage from './TermsSubpage'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class SignUp extends React.Component<any, any> {
    render() {
        return (
            <MuiThemeProvider>
                <TermsSubpage />
            </MuiThemeProvider>
        )
    }
}