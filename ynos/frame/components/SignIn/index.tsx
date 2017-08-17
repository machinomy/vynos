import * as React from "react"
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Image from 'material-ui-image'
import Terms from './Registration/Terms'
import Encryption from './Registration/Encryption'
import Mnemonic from './Registration/Mnemonic'


export default class SignIn extends React.Component<any, any> {
    render() {
        return (
            <div>
                <MuiThemeProvider>
                    <Image src={require('../../css/images/sign-in_logo.svg')}
                        color="#ffffff"
                        style={{'width': 'initial', 'height': 'initial', 'text-align': 'center'}}
                        imageStyle={{'width': '144px', 'height': 'initial'}}
                        className="sign-in-logo"
                    />
                </MuiThemeProvider>
                <MuiThemeProvider>
                    {/*<Terms />*/}
                    {/*<Encryption />*/}
                    <Mnemonic />
                </MuiThemeProvider>
            </div>
        )
    }
}