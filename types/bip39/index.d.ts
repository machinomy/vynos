declare module "bip39" {
  function generateMnemonic(): string;
  function mnemonicToSeed(mnemonic: string, password: string): string;

  export = {
    generateMnemonic,
    mnemonicToSeed
  }
}
