# Ynos

[![Greenkeeper badge](https://badges.greenkeeper.io/machinomy/ynos.svg?token=1870817fee6b27d4542983529eaf1a72e3ac464a614640d2f9477d63c3d79862&ts=1501285253808)](https://greenkeeper.io/)

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

# Run
```
yarn run harness
```
That command starts a web server to play with Ynos on localhost.
Open browser on `http://localhost:9999` and click on some buttons.

# WTF is Harness
It demonstrates Ynos work on localhost. It runs a web page (Ynos client) on localhost:9999.
Serves Ynos frame (stores privateKeys a-la MetaMaskara) from localhost:9090. Different ports
make the browser think the pages belong to different origins, thus should be secured
against each other malicious behaviour.
