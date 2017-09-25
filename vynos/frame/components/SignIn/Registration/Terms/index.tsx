import * as React from "react";
import {connect, Dispatch} from "react-redux";
import {AppFrameState} from "../../../../reducers/state";
import actions from "../../../../actions";
import { Link } from 'react-router-dom';
import { Button, Container, Divider  } from 'semantic-ui-react'
import Logo from '../../Header';
const style = require("../../../../styles/ynos.css");

export interface TermsSubpageStateProps {

}

export interface TermsSubpageDispatchProps {
    didAcceptTerms: () => void
}

type TermsSubpageProps = TermsSubpageDispatchProps & TermsSubpageStateProps


const Terms: React.SFC<TermsSubpageProps> = (props) => {
    return <Container textAlign="center" className={`${style.flexContainer} ${style.clearBorder}`}>
                <Logo />
                <Divider hidden />
                <p>
                    Ready to unlock a true value<br/>
                    of quality content<br/>
                    through <em>real</em> micropayments?
                </p>
                <Divider hidden />
                <Link to="/terms" className={style.readTerms}>Read Terms of Use</Link>
                <Divider hidden />
                <Button onClick={props.didAcceptTerms} content="Accept" primary className={style.buttonNav} />
        </Container>
};

function mapStateToProps(state: AppFrameState): TermsSubpageStateProps {
    return {
    }
}

function mapDispatchToProps(dispatch: Dispatch<AppFrameState>): TermsSubpageDispatchProps {
    return {
        didAcceptTerms: () => dispatch(actions.temp.init.didAcceptTerms(true))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Terms)