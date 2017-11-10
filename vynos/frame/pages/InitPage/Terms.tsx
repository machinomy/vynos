import * as React from "react";
import {connect, Dispatch} from "react-redux";
import {FrameState} from "../../redux/FrameState";
import * as actions from "../../redux/actions";
import { Button, Container, Divider  } from 'semantic-ui-react'
import TermsTextPage from '../TermsTextPage'
import RestorePage from '../RestorePage'
import Logo from "../../components/Logo";
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

  doneDisplayRestorePage () {
    this.setState({
      displayRestore: false
    })
  }

  render () {
    if (this.state.displayTermsText)
      return <TermsTextPage goBack={this.doneDisplayTermsText.bind(this)} />

    if (this.state.displayRestore)
      return <RestorePage goBack={this.doneDisplayRestorePage.bind(this)} />

    return <Container textAlign="center" className={`${style.flexContainer} ${style.clearBorder}`}>
      <Logo />
      <Divider hidden />
      <p>
        Ready to unlock a true value<br/>
        of quality content<br/>
        through <em>real</em> micropayments?
      </p>
      <Divider hidden />
      <a className={style.readTerms} onClick={this.doDisplayTermsText.bind(this)} />
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
      dispatch(actions.didAcceptTerms(true))
    }
  }
}

export default connect(null, mapDispatchToProps)(Terms)
