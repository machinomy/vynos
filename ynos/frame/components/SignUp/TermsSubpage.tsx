import * as React from "react";
import {connect, Dispatch} from "react-redux";
import {FrameState} from "../../reducers/state";
import actions from "../../actions";
import Button from 'material-ui/RaisedButton';

const TERMS_OF_USE_ADDRESS = 'https://example.com';

require('../../css/style.styl');

export interface TermsSubpageStateProps {

}

export interface TermsSubpageDispatchProps {
    didAcceptTerms: () => void
}

type TermsSubpageProps = TermsSubpageDispatchProps & TermsSubpageStateProps

function handleTouClick() {
    window.open(TERMS_OF_USE_ADDRESS, '_blank')
}

export default class TermsSubpage extends React.Component<any, any> {
    render() {
        return <div>
            <div className="terms-header">
                <img src={require('../../css/images/logo.png')} className="terms-header__logo" alt="Logo" />
                <h1 className="terms-header__caption">Literate<span className="terms-header__caption_text-wrap">Payments</span></h1>
            </div>
            <div className="terms-subheader">
                <p>Ready to unlock a true value<br/>
                    of quality content<br/>
                    through <em>real</em> micropayments?
                </p>
            </div>
            <div className="terms-read">
                <p>
                    <a href="#" onClick={handleTouClick}>Read terms of use</a>
                </p>
            </div>
            <div className="text-center">
                <Button className="btn-primary" backgroundColor="#077BC3" label={<span className="label-primary">Accept</span>}/>
            </div>
        </div>
    }
}

/*
const TermsSubpage1: React.SFC<any> = () => {
    return <div>
        <div className="terms-header">
            <img src={require('../../css/images/logo.png')} className="terms-header__logo" alt="Logo" />
            <h1 className="terms-header__caption">Literate<span className="terms-header__caption_text-wrap">Payments</span></h1>
        </div>
        <div className="terms-subheader">
            <p>Ready to unlock a true value<br/>
                of quality content<br/>
                through <em>real</em> micropayments?
            </p>
        </div>
        <div className="terms-read">
            <p>
                <a href="#" onClick={handleTouClick}>Read terms of use</a>
            </p>
        </div>
        <div className="terms-accept">
            <p>
                <button>Accept</button>
            </p>
        </div>
    </div>
};
*/

// function mapStateToProps(state: FrameState): TermsSubpageStateProps {
//     return {
//     }
// }
//
// function mapDispatchToProps(dispatch: Dispatch<FrameState>): TermsSubpageDispatchProps {
//     return {
//         didAcceptTerms: () => dispatch(actions.temp.init.didAcceptTerms(true))
//     }
// }
//
// export default connect(mapStateToProps, mapDispatchToProps)(TermsSubpage)
