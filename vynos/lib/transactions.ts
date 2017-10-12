import Transaction from "./Transaction";
import {randomId} from "./Payload";
import TransactionKind from "./TransactionKind";
import TransactionState from "./TransactionState";

export function ethereum (id: string, description: string, amount: number, fee: number): Transaction {
  return {
    id: randomId().toString(),
    title: 'Ethereum',
    description: description,
    time: Date.now(),
    amount: amount,
    fee: fee,
    kind: TransactionKind.ETHEREUM,
    state: TransactionState.PENDING
  }
}

export function micropayment (title: string, description: string, amount: number): Transaction {
  return {
    id: randomId().toString(),
    title: title,
    description: description,
    time: Date.now(),
    amount: amount,
    fee: 0,
    kind: TransactionKind.MICROPAYMENT,
    state: TransactionState.APPROVED
  }
}
