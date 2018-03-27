import * as React from 'react'
import { connect } from 'react-redux'
import { FrameState } from '../../../redux/FrameState'
import { Menu } from 'semantic-ui-react'

const style = require('../../../styles/ynos.css')

export interface VerifiablePageProps {
  showVerifiable: () => void
  hideVerifiable: () => void
}

export interface VerifiablePageState {
  randNumber: number
}

export class VerifiablePage extends React.Component<VerifiablePageProps, VerifiablePageState> {

  win: Window | null

  constructor (props: VerifiablePageProps) {
    super(props)
    let randNumber = VerifiablePage.getRandomNumber(1000, 9999)
    localStorage.setItem('randNumber', randNumber.toString())
    this.state = { randNumber }
  }

  static getRandomNumber (min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min)
  }

  show () {
    this.win = window.open('/check.html', '', 'width=300,height=200')
    this.win.onbeforeunload = () => {
      this.props.hideVerifiable()
    }
  }

  menu () {
    return <Menu className={style.clearBorder} style={{ zIndex: 10 }}>
      <Menu.Item link className={style.menuIntoOneItemFluid}
                 onClick={this.props.hideVerifiable}>
        <i className={style.vynosArrowBack}/> Verify Vynos
      </Menu.Item>
    </Menu>
  }

  componentWillUnmount () {
    if (this.win && !this.win.closed) {
      this.win.close()
    }
    localStorage.removeItem('randNumber')
  }

  render () {
    return <div id={style.verifiableBlock}>
      {this.menu()}
      <div id={style.verifiableText}>Кликаем по ссылке ниже, сравниваем циферки и если они совпадают - радуемся</div>
      <div id={style.verifiableRandNumber}>{this.state.randNumber}</div>
      <div><a onClick={this.show.bind(this)}>Verify authenticity Vynos</a></div>
    </div>
  }
}

function mapStateToProps (state: FrameState, props: VerifiablePageProps): VerifiablePageProps {
  return {
    showVerifiable: props.showVerifiable,
    hideVerifiable: props.hideVerifiable
  }
}

export default connect(mapStateToProps)(VerifiablePage)
