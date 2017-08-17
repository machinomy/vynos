import * as React from "react"
// import {connect, Dispatch} from "react-redux";
// import {FrameState} from "../../../reducers/state";
// import actions from "../../../actions";
import Button from 'material-ui/RaisedButton'
import { Link } from 'react-router-dom'

//const TERMS_OF_USE_ADDRESS = 'https://example.com';

// export interface TermsSubpageStateProps {
//
// }
//
// export interface TermsSubpageDispatchProps {
//     didAcceptTerms: () => void
// }
//
// type TermsSubpageProps = TermsSubpageDispatchProps & TermsSubpageStateProps
//
// function handleTouClick() {
//     window.open(TERMS_OF_USE_ADDRESS, '_blank')
// }

export default class Terms extends React.Component<any, any> {
    render() {
        return (
            <div>
                <div className="terms-subheader text-center">Ready to unlock a true value<br/>
                    of quality content<br/>
                    through <em>real</em> micropayments?
                </div>
                <div className="terms-text text-center">
                    <Link to="#" className="to-terms">Read terms of use</Link>
                </div>
                <div className="terms-accept text-center">
                    <Button className="btn-primary" backgroundColor="#077BC3" label={<span className="label-primary">Accept</span>}/>
                </div>
            </div>
        )
    }
}

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
