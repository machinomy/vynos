export default class Transaction {
  title: string

  constructor (title: string) {
    this.title = title
  }

  toString () {
    return this.title
  }
}
