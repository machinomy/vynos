declare module "bip39" {
  export function generateMnemonic(): string
  export function mnemonicToSeed(mnemonic: string): string
  export function validateMnemonic(mnemonic: string): boolean
}
