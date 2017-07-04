import {PaymentChannel as PC} from "machinomy";

export default class PaymentChannel {
  state: number;
  spent: number;
  value: number;
  channelId: string;
  receiver: string;

  constructor(opts: PC) {
    this.state = opts.state
    this.spent = opts.spent
    this.value = opts.value
    this.channelId = opts.channelId
    this.receiver = opts.receiver
  }

  toJSON(): PC {
    return {
      state: this.state,
      spent: this.spent,
      value: this.value,
      channelId: this.channelId,
      receiver: this.receiver
    }
  }
}
