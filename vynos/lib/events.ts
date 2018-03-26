import {WalletBuyArguments} from "./Vynos";

export function txApproved(id: string): string {
  return `tx:approved:${id}`
}

export function txRejected(id: string): string {
  return `tx:rejected:${id}`
}

export function buyProcessEvent(): string {
  return `event:buyProcessEvent`
}


// export function buyProcessEvent(buyArgs: WalletBuyArguments): string {
//   return `event:buyProcessEvent:${buyArgs.receiver}:${buyArgs.amount}:${buyArgs.channelValue}:${buyArgs.meta}`
// }


