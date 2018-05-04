import Transaction from './TransactionMeta'
import { randomId } from './Payload'
import TransactionKind from './TransactionKind'
import TransactionState from './TransactionState'
import PurchaseMeta from './PurchaseMeta'
import { resource } from './helpers'

export function ethereum (id: string, to: string, amount: number, fee: number): Transaction {
  return {
    id: randomId().toString(),
    title: 'Ethereum',
    to,
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
    origin: purchaseMeta.origin,
    title: purchaseMeta.siteName,
    description: purchaseMeta.description,
    icon: purchaseMeta.icon,
    time: Date.now(),
    amount: amount,
    fee: 0,
    kind: TransactionKind.MICROPAYMENT,
    state: TransactionState.APPROVED
  }
}

export function signature (from: string, data: string): Transaction {
  return {
    id: randomId().toString(),
    title: 'Signature',
    from,
    data,
    time: Date.now(),
    amount: 0,
    fee: 0,
    kind: TransactionKind.SIGN,
    state: TransactionState.PENDING
  }
}

export function closeChannel (description: string): Transaction {
  return {
    id: randomId().toString(),
    title: 'Closing channel',
    from: '',
    to: '',
    description: description,
    icon: resource('/frame/styles/images/close_channel-approved.png'),
    time: Date.now(),
    amount: 0,
    fee: 0,
    kind: TransactionKind.CLOSE_CHANNEL,
    state: TransactionState.APPROVED
  }
}

export function openChannel (title: string, description: string, from: string, to: string, amount: number): Transaction {
  return {
    id: randomId().toString(),
    from: from,
    to: to,
    title: title,
    description: description,
    icon: resource('/frame/styles/images/open_channel-approved.png'),
    time: Date.now(),
    amount: amount,
    fee: 0,
    kind: TransactionKind.OPEN_CHANNEL,
    state: TransactionState.APPROVED
  }
}
