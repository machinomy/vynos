import * as React from "react";
import {connect, Dispatch} from "react-redux";
import {FrameState} from "../../../../reducers/state";
import actions from "../../../../actions";
import { Link } from 'react-router-dom';
import { Button, Container  } from 'semantic-ui-react'
import Logo from '../../Header';
const TERMS_OF_USE_ADDRESS = 'https://example.com';
const style = require("../../../../styles/ynos.css");

export interface TermsSubpageStateProps {

}

export interface TermsSubpageDispatchProps {
    didAcceptTerms: () => void
}

type TermsSubpageProps = TermsSubpageDispatchProps & TermsSubpageStateProps


const Terms: React.SFC<TermsSubpageProps> = (props) => {
    return <Container textAlign="center" className={`${style.flexContainer} ${style.clearBorder}`}>
                <p className={style.signInLogo}>
                    <Logo />
                </p>
                <p>
                    Ready to unlock a true value<br/>
                    of quality content<br/>
                    through <em>real</em> micropayments?
                </p>
                <p className={style.readTerms}>
                    <Link to="/terms">Read Terms of Use</Link>
                </p>
                <p className={style.buttonNav}>
                    <Button onClick={props.didAcceptTerms} primary>Accept</Button>
                </p>
        </Container>
};

function mapStateToProps(state: FrameState): TermsSubpageStateProps {
    return {
    }
}

function mapDispatchToProps(dispatch: Dispatch<FrameState>): TermsSubpageDispatchProps {
    return {
        didAcceptTerms: () => dispatch(actions.temp.init.didAcceptTerms(true))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Terms)