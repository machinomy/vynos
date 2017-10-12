import TransactionKind from "./TransactionKind";

export default interface TransactionMeta {
  id: string
  title: string
  description?: string
  icon?: string
  time: number
  amount: number
  fee?: number
  kind: TransactionKind
  state: string
}
