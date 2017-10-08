import * as React from 'react';
import { Container, Menu } from 'semantic-ui-react'
const style = require('../styles/ynos.css')

export interface TermsTextPageProps {
  goBack: () => void
}

export default class TermsTextPage extends React.Component<TermsTextPageProps, any> {
  render () {
    return <div>
      <Menu className={style.clearBorder}>
        <Menu.Item
          link className={style.menuIntoOneItemFluid}
          onClick={this.props.goBack}>
          <i className={style.vynosArrowBack}/> Terms of Use
        </Menu.Item>
      </Menu>
      <Container className={style.termsText}>
        <p>The following describes the terms of use that FIXME (“LP,” “we,” “our,” or “us”) require all our visitors to follow when using this Site and purchasing Publisher Services (as defined below) through the FIXME. In these Terms of Use, the phrase “this Site” refers to our web site located at www.FIXME.com, and the phrase “FIXME” ("FIXME Service") refers to the service offered at this Site that enables users to pay for Publisher Services (as defined below).</p>
        <p>FIXME Service is currently offered as a private beta. While we will make efforts to ensure that the FIXME is stable and provided in an error-free fashion, certain technical issues may appear from time to time. File security and access cannot be guaranteed. If you experience an issue with the FIXME, or find any bugs you would like to help us squish, please contact us.</p>
      </Container>
    </div>
  }
}
