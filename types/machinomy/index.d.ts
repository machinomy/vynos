declare module "machinomy" {
  import Web3 from "web3";

  export interface PaymentChannel {
    state: number;
    spent: number;
    value: number;
    channelId: string;
    receiver: string;
    sender: string;
  }

  interface MachinomyStorageChannels {
    all: () => Promise<PaymentChannel[]>
  }

  export class Storage {
    channels: MachinomyStorageChannels
    payments: PaymentsDatabase
  }

  export class Paywall {}

  export class Transport {}

  export interface transport {
    build: () => Transport
    Transport: Transport
  }

  class ChannelContract {
    buildPaymentChannel (sender: string, receiver: string, channelValue: number): Promise<PaymentChannel>
    startSettle(account: string, channelId: string, payment: number): Promise<void>
    claim(receiver: string, channelId: string, value: number, v: number, r: string, s: string): Promise<number>
    finishSettle(account: string, channelId: string): Promise<number>
    canClaim(channelId: string, paymentValue: number, v: number, r: string, s: string): boolean
    canFinishSettle(account: string, channelId: string): boolean
    getUntil(channelId: string): number
  }

  interface channel {
    contract: ChannelContract
    PaymentChannel: {
      fromPayment: (payment: Payment) => PaymentChannel
    }
  }

  interface configuration {

  }

  export class Payment {
    channelId: string
    sender: string
    receiver: string
    price: number
    value: number
    channelValue: number
    v: number
    r: string
    s: string

    static fromPaymentChannel(web3: Web3, channel: PaymentChannel, price: number): Promise<Payment>
  }

  interface ChannelsDatabase {
    all (): Promise<Array<PaymentChannel>>
  }

  interface PaymentDoc {
    value: number
    v: number
    r: string
    s: string
  }

  interface PaymentsDatabase {
    firstMaximum(channelId: string): Promise<PaymentDoc>
  }

  interface storage {
    build: (web3: Web3, name: string, namespace: string) => Storage
    Storage: Storage
    channels: ChannelsDatabase
  }

  export class Sender {
    storage: Storage
    contract: ChannelContract
  }

  interface sender {
    build: (web3: Web3, account: string, contract: ChannelContract, transport: Transport, storage: Storage) => Sender
  }

  export const NAME: string;

  export const VERSION: string;
  export const web3: Web3;
  export const transport: transport;
  export const contract: (web3: Web3) => ChannelContract;
  export const configuration: configuration;
  export const storage: storage;
  export const channel: channel;
  export const sender: sender;
}
