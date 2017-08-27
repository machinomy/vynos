import * as React from "react";
import {connect, Dispatch} from "react-redux";
import {FrameState} from "../../../../reducers/state";
import actions from "../../../../actions";
import { Segment, Button } from 'semantic-ui-react'
import Logo from '../../Header';
const TERMS_OF_USE_ADDRESS = 'https://example.com';


export interface TermsSubpageStateProps {

}

export interface TermsSubpageDispatchProps {
    didAcceptTerms: () => void
}

type TermsSubpageProps = TermsSubpageDispatchProps & TermsSubpageStateProps

function handleTouClick() {
    window.open(TERMS_OF_USE_ADDRESS, '_blank')
}

const Terms: React.SFC<TermsSubpageProps> = (props) => {
    return <Segment textAlign="center">
        <Logo />
        <p>
            Ready to unlock a true value<br/>
            of quality content<br/>
            through <em>real</em> micropayments?
        </p>
        <p>
            Read <a href="#" onClick={handleTouClick}>Terms of Use</a>
        </p>
        <p>
            <Button onClick={props.didAcceptTerms} primary>Accept</Button>
        </p>
    </Segment>
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