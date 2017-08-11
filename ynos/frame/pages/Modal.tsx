import * as React from "react";

const styles = require('./buy-sell-modal.scss')

export default class Modal extends React.Component<any, any> {
  render () {
    return <div className={styles.modalShadow}>
      <div className={styles.modal}>
        { this.props.children }
      </div>
    </div>
  }
}
