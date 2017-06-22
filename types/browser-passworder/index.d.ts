declare module "browser-passworder" {
  function encrypt(password: string, privateKey: Buffer): Promise<string>;
  function decrypt(password: string, encrypted: string): Promise<Buffer>

  export = {
    encrypt,
    decrypt
  }
}
