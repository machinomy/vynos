declare module "machinomy" {
  import Web3 from "web3";

  export interface PaymentChannel {
    state: number;
    spent: number;
    value: number;
    channelId: string;
    receiver: string;
  }

  interface MachinomyStorageChannels {
    all: () => Promise<PaymentChannel[]>
  }

  export class Storage {
    channels: MachinomyStorageChannels;
  }

  export class Paywall {}

  export class Transport {}

  export interface transport {
    build: () => Transport
    Transport: Transport
  }

  class ChannelContract {
    buildPaymentChannel (sender: string, receiver: string, channelValue: number): Promise<PaymentChannel>
  }

  interface channel {
    contract: ChannelContract
  }

  interface configuration {

  }

  export class Payment {

  }

  class ChannelsDatabase {
    all (): Promise<Array<PaymentChannel>>
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
