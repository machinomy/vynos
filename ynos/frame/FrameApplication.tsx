//
// import * as React from "react";
// import {connect} from "react-redux";
// import {FrameState} from "./reducers/state";
//
// /*import InitPage from "./pages/init"
// import WalletPage from "./pages/wallet"*/
// import UnlockPage from "./components/SignIn";
//
// export interface FrameApplicationProps {
//   isInitPageExpected: boolean
//   isWalletPageExpected: boolean
//   isUnlockPageExpected: boolean
// }
//
// const FrameApplication: React.SFC<FrameApplicationProps> = (props) => {
//   if (props.isInitPageExpected) {
//     return <UnlockPage/>
//   } else if (props.isUnlockPageExpected) {
//     return <UnlockPage/>
//   } else if (props.isWalletPageExpected) {
//     return <UnlockPage/>
//   }
//   return <p>Waiting...</p>
// }
//
// function mapStateToProps(state: FrameState): FrameApplicationProps {
//   return {
//     isInitPageExpected: !(state.shared.didInit),
//     isWalletPageExpected: !!(state.shared.didInit && state.temp.workerProxy && !state.shared.isLocked),
//     isUnlockPageExpected: !!(state.shared.didInit && state.temp.workerProxy && state.shared.isLocked)
//   }
// }
//
// export default connect<FrameApplicationProps, undefined, any>(mapStateToProps)(FrameApplication)

