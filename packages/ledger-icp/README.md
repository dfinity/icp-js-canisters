# ledger-icp-js

A library for interfacing with the [ICP ledger](https://internetcomputer.org/icp-tokens/) on the Internet Computer.

[![npm version](https://img.shields.io/npm/v/@dfinity/ledger-icp.svg?logo=npm)](https://www.npmjs.com/package/@dfinity/ledger-icp) [![GitHub license](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

> ℹ️ This library is meant to interface with the ICP ledger only. If you are looking to interact with Snses, ckBTC, or other ICRC tokens, use the [ledger-icrc-js](../ledger-icrc) library.

> [!TIP]
> Still using `@dfinity/ledger-icp`? Upgrade to [`@icp-sdk/canisters/ledger/icp`](https://js.icp.build/canisters/latest/upgrading/v1/)!

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Resources](#resources)

## Installation

You can use `ledger-icp-js` by installing it in your project.

```bash
npm i @dfinity/ledger-icp
```

The bundle needs peer dependencies, be sure that following resources are available in your project as well.

```bash
npm i @icp-sdk/core @dfinity/utils
```

## Usage

The features are available through the class `IcpLedgerCanister`. It has to be instantiated with a canister ID.

e.g. fetching a token metadata.

```ts
import { createAgent } from "@dfinity/utils";
import { IcpLedgerCanister } from "@dfinity/ledger-icp";

const agent = await createAgent({
  identity,
  host: HOST, // "https://icp-api.io" for mainnet
});

const { metadata } = IcpLedgerCanister.create({
  agent,
  canisterId: MY_LEDGER_CANISTER_ID,
});

const data = await metadata({});
```

## Documentation

You can find the API docs [here](https://js.icp.build/canisters/latest/api/ledger/icp/).

## Resources

- [Ledger & Tokenization Working Group Standards](https://github.com/dfinity/ICRC-1/)
- [ICP ledger](https://github.com/dfinity/ic/tree/master/rs/rosetta-api/icp_ledger)
