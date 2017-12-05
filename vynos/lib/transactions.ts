import Transaction from "./TransactionMeta";
import {randomId} from "./Payload";
import TransactionKind from "./TransactionKind";
import TransactionState from "./TransactionState";
import PurchaseMeta from "./PurchaseMeta";

export function ethereum (id: string, description: string, meta: string, amount: number, fee: number): Transaction {
  return {
    id: randomId().toString(),
    title: 'Ethereum',
    description: description,
    meta: meta,
    time: Date.now(),
    amount: amount,
    fee: fee,
    kind: TransactionKind.ETHEREUM,
    state: TransactionState.PENDING
  }
}

export function micropayment (purchaseMeta: PurchaseMeta, receiver: string, amount: number): Transaction {
  return {
    id: randomId().toString(),
    title: purchaseMeta.siteName,
    description: purchaseMeta.description,
    icon: purchaseMeta.siteIcon,
    time: Date.now(),
    amount: amount,
    fee: 0,
    kind: TransactionKind.MICROPAYMENT,
    state: TransactionState.APPROVED
  }
}

export function signature (description: string, meta: string): Transaction {
  return {
    id: randomId().toString(),
    title: 'Signature',
    description: description,
    meta: meta,
    time: Date.now(),
    amount: 0,
    fee: 0,
    kind: TransactionKind.SIGN,
    state: TransactionState.PENDING
  }
}
