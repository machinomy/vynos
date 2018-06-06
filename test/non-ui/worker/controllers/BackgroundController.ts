import * as sinon from 'sinon'
import BackgroundController from '../../../../vynos/worker/controllers/BackgroundController'
import { Buffer } from 'safe-buffer'

describe('BackroundController::_generateKeyring', () => {

  let backgroundController: BackgroundController
  let mnemonic: string
  let password: string

  beforeAll(() => {
    backgroundController = new BackgroundController()
    mnemonic = 'dance mutual spike analyst together average reject pudding hazard move fence install'
    password = '12344321'
  })

  beforeEach(() => {
  })

  it('Usual case', async () => {
    const keyring = backgroundController._generateKeyring(password, mnemonic)
    const buf = Buffer.from([0xc4, 0x62, 0x04, 0x7a, 0x0b, 0x21, 0x47, 0xf5, 0xa6, 0x62, 0x6e, 0xa2, 0x76, 0x04, 0xc8, 0xb5, 0x30, 0x60, 0x5e, 0xe2, 0x24, 0xdc, 0x1d, 0x6d, 0x61, 0x08, 0x8f, 0x94, 0xb9, 0xde, 0x6f, 0x93])
    expect(Buffer.compare(keyring.wallet.getPrivateKey(), buf)).toBe(0)
  })

  it('Empty password', async () => {
    const keyring = backgroundController._generateKeyring('', mnemonic)
    const buf = Buffer.from([0xc4, 0x62, 0x04, 0x7a, 0x0b, 0x21, 0x47, 0xf5, 0xa6, 0x62, 0x6e, 0xa2, 0x76, 0x04, 0xc8, 0xb5, 0x30, 0x60, 0x5e, 0xe2, 0x24, 0xdc, 0x1d, 0x6d, 0x61, 0x08, 0x8f, 0x94, 0xb9, 0xde, 0x6f, 0x93])
    expect(Buffer.compare(keyring.wallet.getPrivateKey(), buf)).toBe(1)
  })


})
