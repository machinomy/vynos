import * as React from "react";
import {connect, Dispatch} from "react-redux";
import {FrameState} from "../../state/FrameState";
import actions from "../../actions";
import { Button, Container, Divider  } from 'semantic-ui-react'
import Logo from './Logo';
import TermsTextPage from "../TermsTextPage";
const style = require('../../styles/ynos.css')

export interface TermsSubpageDispatchProps {
  didAcceptTerms: () => void
}

export type TermsSubpageProps = TermsSubpageDispatchProps

export interface TermsState {
  displayTermsText: boolean
  displayRestore: boolean
}

export class Terms extends React.Component<TermsSubpageProps, TermsState> {
  constructor (props: TermsSubpageProps) {
    super(props)
    this.state = {
      displayTermsText: false,
      displayRestore: false
    }
  }

  doDisplayTermsText () {
    this.setState({
      displayTermsText: true
    })
  }

  doDisplayRestore () {
    this.setState({
      displayRestore: true
    })
  }

  doneDisplayTermsText () {
    this.setState({
      displayTermsText: false
    })
  }

  render () {
    if (this.state.displayTermsText)
      return <TermsTextPage goBack={this.doneDisplayTermsText.bind(this)}/>

    return <Container textAlign="center" className={`${style.flexContainer} ${style.clearBorder}`}>
      <Logo />
      <Divider hidden />
      <p>
        Ready to unlock a true value<br/>
        of quality content<br/>
        through <em>real</em> micropayments?
      </p>
      <Divider hidden />
      <a className={style.readTerms} onClick={this.doDisplayTermsText.bind(this)}>Read Terms of Use</a>
      <Divider hidden />
      <Button onClick={this.props.didAcceptTerms} content="Accept" primary className={style.buttonNav} />
      <br />
      <a onClick={this.doDisplayRestore.bind(this)}>Restore wallet</a>
    </Container>
  }
}

function mapDispatchToProps(dispatch: Dispatch<FrameState>): TermsSubpageDispatchProps {
  return {
    didAcceptTerms: () => {
      dispatch(actions.temp.init.didAcceptTerms(true))
    }
  }
}

export default connect(null, mapDispatchToProps)(Terms)
