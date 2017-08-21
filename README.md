# Ynos

> Micropayments for web.

# Prerequisites

You are expected to have `yarn` package manager installed globally on your machine.
For installation instructions go to the [official web site](https://yarnpkg.com/en/docs/install).

# Install

```
git clone https://github.com/SpankChain/ynos ynos
cd ynos
yarn install
```

Rename example.env to .env and set some environment variables:
```
FRAME_PORT=80
HARNESS_PORT=8081
CONTRACT_ADDRESS=0x69caef6931141601ef781357c33639
RPC_URL=http://localhost:4566
```

# Run
```
yarn run harness
```
That command starts a web server to play with Ynos on localhost.
Open browser on `http://localhost:8081` and click on some buttons.

# WTF is Harness
It demonstrates Ynos work on localhost. It runs a web page (Ynos client) on localhost:8080.
Serves Ynos frame (stores privateKeys a-la MetaMaskara) from localhost:9090. Different ports
make the browser think the pages belong to different origins, thus should be secured
against each other malicious behaviour.