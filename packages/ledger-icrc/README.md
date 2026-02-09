# ledger-icrc-js

A library for interfacing with [ICRC ledger](https://github.com/dfinity/ic/tree/master/rs/rosetta-api/icrc1) on the Internet Computer.

[![npm version](https://img.shields.io/npm/v/@dfinity/ledger-icrc.svg?logo=npm)](https://www.npmjs.com/package/@dfinity/ledger-icrc) [![GitHub license](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

> [!TIP]
> Still using `@dfinity/ledger-icrc`? Upgrade to [`@icp-sdk/canisters/ledger/icrc`](https://js.icp.build/canisters/latest/upgrading/v1/)!

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Resources](#resources)

## Installation

You can use `ledger-icrc-js` by installing it in your project.

```bash
npm i @dfinity/ledger-icrc
```

The bundle needs peer dependencies, be sure that following resources are available in your project as well.

```bash
npm i @icp-sdk/core @dfinity/utils
```

## Usage

The features are available through the class `IcrcLedgerCanister`. It has to be instantiated with a canister ID.

e.g. fetching a token metadata.

```ts
import { IcrcLedgerCanister } from "@dfinity/ledger-icrc";
import { createAgent } from "@dfinity/utils";

const agent = await createAgent({
  identity,
  host: HOST, // "https://icp-api.io" for mainnet
});

const { metadata } = IcrcLedgerCanister.create({
  agent,
  canisterId: MY_LEDGER_CANISTER_ID,
});

const data = await metadata({});
```

## Documentation

You can find the API docs [here](https://js.icp.build/canisters/latest/api/ledger/icrc/).

## Resources

- [Ledger & Tokenization Working Group Standards](https://github.com/dfinity/ICRC-1/)
- [ICRC-1 Ledger](https://github.com/dfinity/ic/tree/master/rs/rosetta-api/icrc1)
