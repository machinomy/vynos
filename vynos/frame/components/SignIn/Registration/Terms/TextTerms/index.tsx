import * as React from "react";
import { Container, Menu } from 'semantic-ui-react'
import {RouterProps} from "react-router"
const style = require("../../../../../styles/ynos.css");

const TextTerms: React.SFC<RouterProps> = (props) => {
  return <div>
    <Menu className={style.clearBorder}>
      <Menu.Item
        link className={style.menuIntoOneItemFluid}
        onClick={() => props.history.goBack()}>
        <i className={style.vynosArrowBack}/> Terms of Use
      </Menu.Item>
    </Menu>
    <Container className={style.termsText}>
      <p>The following describes the terms of use that Literate Payments, LLC (“LP,” “we,” “our,” or “us”) require all our visitors to follow when using this Site and purchasing Publisher Services (as defined below) through the Literate Payments Service. In these Terms of Use, the phrase “this Site” refers to our web site located at www.literatepayments.com, and the phrase “Literate Payments Service” ("LP Service") refers to the service offered at this Site that enables users to pay for Publisher Services (as defined below).</p>
      <p>The Literate Payments Service is currently offered as a private beta. While we will make efforts to ensure that the Literate Payments Service is stable and provided in an error-free fashion, certain technical issues may appear from time to time. File security and access cannot be guaranteed. If you experience an issue with the Literate Payments Service, or find any bugs you would like to help us squish, please contact us.</p>
    </Container>
  </div>
}

export default TextTerms
