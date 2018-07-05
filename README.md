# Vynos [![Build Status](https://travis-ci.com/machinomy/vynos.svg?token=K1HKiXykkAKA6zQXxNvq&branch=master)](https://travis-ci.com/machinomy/vynos)

> In-browser ethereum micropayments wallet.

# Installation

## Standalone

To use Vynos one has to plug it into a web page as yet another javascript library.
```html
<script src="https://vynos.tech/vA.B.C/vynos.js"></script>
```

Here `vA.B.C` represents the version you use, for example: `v.0.0.3`. When included, it sets a global `vynos` object,
that serves as an entrypoint to Vynos wallet.

## Packaged

Including the script tag downloads the code into your application context, and runs that. One could use NPM package
just for that: `import vynos from 'vynos'` equivalents to the script tag above.

# Usage

`vynos` entrypoint provides the following API:

* `vynos.display(): Promise<void>` - display Vynos wallet component,
* `vynos.hide(): Promise<void>` - hide Vynos wallet component,
* `vynos.ready(): Promise<Vynos>` - get access to the wallet; more on that below.

The latter is an asynchronous method, that returns `Promise` of a wallet. This prevents a developer from
calling the wallet while it is not loaded, or waiting for loading using `while` loop.

One could call `vynos.ready()` multiple times. It initialises the wallet once. If loaded, it returns the current
instance of the wallet:

```typescript
import vynos from 'vynos'
import * as Web3 from 'web3'

vynos.ready().then(wallet => {
    let web3 = new Web3(wallet.provider)
    web3.eth.getAccounts((err, accounts) => {
        if (err) {
            throw err
        } else {
            let account = accounts[0]
            console.log(account)
        }
    })
})
``` 

Wallet instance provides the following API:

* `wallet.initAccount(): Promise<void>` - resolved when the user unlocks her wallet; if it is already unlocked, the promise resolves immediately;
* `wallet.openChannel(receiverAccount: string, channelValue: BigNumber.BigNumber): Promise<PaymentChannel>` - open a payment channel,
* `wallet.closeChannel(channelId: string): Promise<void>` - close the channel,
* `wallet.buy(receiver: string, amount: number, gateway: string, meta: string, purchaseMeta?: PurchaseMeta, channelValue?: number): Promise<VynosBuyResponse>` - send a payment to `gateway`, open a channel if necessary,
* `wallet.listChannels(): Promise<Array<PaymentChannel>>` - list all the open channels,
* `wallet.provider` - web3 provider.

## Build configuration via environment variables

`QR_TAB=true` - enable tab with QR-code (QR-encoded mnemonic) in Mnemonic dialog while creating new wallet. 

# Development

## Prerequisites

You are expected to have `yarn` package manager installed globally on your machine.
For installation instructions go ts the [official web site](https://yarnpkg.com/en/docs/install).

## Install

```
git clone https://github.com/machinomy/vynos
cd vynos
yarn install
```

## Run
```
yarn run harness
```
That command starts a web server to play with Vynos on localhost.
Open browser on `http://localhost:9000` and click on some buttons.
It triggers the building process, so you should wait a little bit staring on the page.

You could change the port via `.env` file:
```
FRAME_PORT=9090
HARNESS_PORT=9000
BACKGROUND_PORT=9001
```

## WTF is Harness
It demonstrates Vynos work on localhost. It runs a web page (Vynos client) on `localhost:9000`,
serves Vynos frame (stores private keys a-la MetaMaskara) from `localhost:9001`. Different ports
make the browser think the pages belong to different origins, thus should be secured
against each other malicious behaviour.

## Copyright Notice

Vynos use icons from icons8.com
