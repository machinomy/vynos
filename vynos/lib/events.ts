export function txApproved(id: string): string {
  return `tx:approved:${id}`
}

export function txRejected(id: string): string {
  return `tx:rejected:${id}`
}

