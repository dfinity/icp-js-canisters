# ckbtc-js

A library for interfacing with [ckBTC](https://github.com/dfinity/ic/tree/master/rs/bitcoin/ckbtc/minter) on the Internet Computer.

[![npm version](https://img.shields.io/npm/v/@dfinity/ckbtc.svg?logo=npm)](https://www.npmjs.com/package/@dfinity/ckbtc) [![GitHub license](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

> [!TIP]
> Still using `@dfinity/ckbtc`? Upgrade to [`@icp-sdk/canisters/ckbtc`](https://js.icp.build/canisters/latest/upgrading/v1/)!

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)

## Installation

You can use `ckbtc-js` by installing it in your project.

```bash
npm i @dfinity/ckbtc
```

The bundle needs peer dependencies, be sure that following resources are available in your project as well.

```bash
npm i @icp-sdk/core @dfinity/utils
```

## Usage

The features are available through the class `CkBtcMinterCanister`. It has to be instantiated with a canister ID.

```ts
import { CkBtcMinterCanister } from "@dfinity/ckbtc";
import { createAgent } from "@dfinity/utils";

const agent = await createAgent({
  identity,
  host: HOST, // "https://icp-api.io" for mainnet
});

const { getBtcAddress } = CkBtcMinterCanister.create({
  agent,
  canisterId: MY_CKBTC_MINTER_CANISTER_ID,
});

const btcAddress = await getBtcAddress({});
```

## Documentation

You can find the API docs [here](https://js.icp.build/canisters/latest/api/ckbtc/).

## Resources

- [Bitcoin integration](https://internetcomputer.org/docs/current/developer-docs/integrations/#bitcoin-integration)
- [ckBTC Minter](https://github.com/dfinity/ic/tree/master/rs/bitcoin/ckbtc/minter/)
