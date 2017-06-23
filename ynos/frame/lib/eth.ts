import Tx, {TransactionProperties} from "ethereumjs-tx";
import ethUtil from "ethereumjs-util";
import sigUtil from "eth-sig-util";
import ZeroProvider from "web3-provider-engine/zero";
import * as Web3 from "web3";
import Wallet from "ethereumjs-wallet";

export function buildWeb3 (wallet: Wallet): Web3 {
  type GetAccountsCallback = (error: Error|null, result: string[]) => void;
  const getAccounts = (callback: GetAccountsCallback) => {
    let address = wallet.getAddressString();
    callback(null, address ? [address] : [])
  };

  type ApproveTransactionCallback = (error: Error|null, approved: boolean) => void;
  const approveTransaction = (txParams: any, callback: ApproveTransactionCallback) => {
    console.log('APPROVE TRANSACTION: ', txParams);
    callback(null, true)
  };

  type SignCallback = (error: Error|null, txHex: string) => void;

  const signTransaction = (rawTransaction: TransactionProperties, callback: SignCallback) => {
    let tx = new Tx(rawTransaction);
    let privateKey = wallet.getPrivateKey();
    tx.sign(privateKey);
    let txHex = '0x' + Buffer.from(tx.serialize()).toString('hex');
    callback(null, txHex)
  };

  const signMessage = (messageParams: TransactionProperties, callback: SignCallback) => {
    let message = Buffer.from(messageParams.data.toString().replace(/0x/, ''), 'hex');
    let privateKey = wallet.getPrivateKey();
    let msgSig = ethUtil.ecsign(message, privateKey);
    let rawMsgSig = ethUtil.bufferToHex(sigUtil.concatSig(msgSig.v, msgSig.r, msgSig.s));
    console.log('sign message: ', messageParams);
    callback(null, rawMsgSig)
  };

  const verifyNetwork = (...args: any[]) => {
    console.log(args)
  };

  let provider = ZeroProvider({
    static: {
      eth_syncing: false,
      web3_clientVersion: `LiteratePayments/v${1.0}`,
    },
    rpcUrl: 'https://ropsten.infura.io/',
    getAccounts: getAccounts,
    approveTransaction: approveTransaction,
    signTransaction: signTransaction,
    signMessage: signMessage
    // tx signing, newUnapprovedTransaction
    //processTransaction: processTransaction,
    // old style msg signing, newUnsignedMessage
    //processMessage: processMessage,
    // new style msg signing, newUnsignedPersonalMessage
    //processPersonalMessage: processPersonalMessage,
  });
  provider.on('error', verifyNetwork);

  let web3 = new Web3();
  web3.setProvider(provider);
  return web3;
}
