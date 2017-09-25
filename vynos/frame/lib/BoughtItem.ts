export interface BoughtItemOpts {
  media: string
  title: string
  date: string
  price: number
}
export default class BoughtItem {
  media: string
  title: string
  date: string
  price: number

  constructor(opts: BoughtItemOpts) {
    this.media = opts.media;
    this.title = opts.title;
    this.date = opts.date;
    this.price = opts.price
  }
}
