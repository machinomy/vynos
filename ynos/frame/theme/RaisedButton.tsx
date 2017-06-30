import RaisedButton from "material-ui/RaisedButton"
import * as React from "react";

export interface RaisedButtonProps {
  onTouchTap?: Function
  style?: Object
  primary?: boolean
  label: string
}

const DEFAULT_STYLE = {
  boxShadow: null
}

export default class extends React.Component<RaisedButtonProps, undefined> {
  render () {
    let options  = {
      style: Object.assign({}, this.props.style, DEFAULT_STYLE),
      label: this.props.label.toUpperCase() || ""
    }
    let props = Object.assign({}, this.props, options)
    return React.createElement(RaisedButton, props)
  }
}
