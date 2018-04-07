# Vynos [![Build Status](https://travis-ci.com/machinomy/vynos.svg?token=K1HKiXykkAKA6zQXxNvq&branch=master)](https://travis-ci.com/machinomy/vynos)

> In-browser micropayments wallet.


# Usage

To use Vynos one has to plug it into a web page as yet another javascript library. In future, it will be available as an NPM package.
For now, one has to put this to the web page code:

```html
<script src="https://vynos.tech/vynos.js"></script>
```

It sets a global `vynos` object, that serves as an entrypoint to Vynos. It provides the following API:

* `vynos.display(): void` - display Vynos component,
* `vynos.hide(): void` - hide Vynos component,
* `vynos.ready(): Promise<Vynos>` - get access to the wallet; more on that below.

The latter is an asynchronous method, that returns `Promise` of a wallet. This prevents a developer from
calling the wallet while it is not loaded, or waiting for loading using `while` loop.
One could call `vynos.ready()` multiple times. It initialises the wallet once. If loaded, it returns the current
instance of the wallet:

```javascript
vynos.ready().then(wallet => {
  wallet.initAccount().then(() => {
    console.log("The user has an account, and the wallet is unlocked")
  })
})
``` 

Wallet instance provides the following API:

* `wallet.initAccount(): Promise<void>` - resolved when the user unlocks her wallet; if it is already unlocked, the promise resolves immediately;
* `wallet.openChannel(receiverAccount: string, channelValue: BigNumber.BigNumber): Promise<PaymentChannel>` - open a payment channel,
* `wallet.buy(receiver: string, amount: number, gateway: string, meta: string, purchase?: PurchaseMeta): Promise<VynosBuyResponse>` - send a payment to `gateway`, open a channel if necessary,
* `wallet.listChannels(): Promise<Array<PaymentChannel>>` - list all the open channels,
* `wallet.closeChannel(channelId: string): Promise<void>` - close the channel.
* `wallet.provider` - web3 provider.

Also, web3 API could be used as well:

```javascript
vynos.ready().then(wallet => {
  wallet.initAccount().then(() => {
    let web3 = new Web3(wallet.provider)
    web3.eth.getAccounts((err, accounts) => {
      console.log(accounts) // Puts Ethereum address wrapped in an array.
    })
  })
})
``` 

# Development

## Prerequisites

You are expected to have `yarn` package manager installed globally on your machine.
For installation instructions go ts the [official web site](https://yarnpkg.com/en/docs/install).

## Install

```
git clone https://github.com/machinomy/vynos
cd vynos
yarn install --pure-lockfile
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
HARNESS_PORT=9000
BACKGROUND_PORT=9999
```

## WTF is Harness
It demonstrates Vynos work on localhost. It runs a web page (Vynos client) on localhost:8080.
Serves Vynos frame (stores privateKeys a-la MetaMaskara) from localhost:9090. Different ports
make the browser think the pages belong to different origins, thus should be secured
against each other malicious behaviour.

## Copyright Notice
Vynos use icons from icons8.com
