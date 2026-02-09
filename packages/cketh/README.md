# cketh-js

A library for interfacing with [ckETH](https://github.com/dfinity/ic/tree/master/rs/ethereum/cketh/minter) on the Internet Computer.

[![npm version](https://img.shields.io/npm/v/@dfinity/cketh.svg?logo=npm)](https://www.npmjs.com/package/@dfinity/cketh) [![GitHub license](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

> [!TIP]
> Still using `@dfinity/cketh`? Upgrade to [`@icp-sdk/canisters/cketh`](https://js.icp.build/canisters/latest/upgrading/v1/)!

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)

## Installation

You can use `cketh-js` by installing it in your project.

```bash
npm i @dfinity/cketh
```

The bundle needs peer dependencies, be sure that following resources are available in your project as well.

```bash
npm i @icp-sdk/core @dfinity/utils
```

## Usage

The features are available through the class `CkEthMinterCanister`. It has to be instantiated with a canister ID.

```ts
import { CkEthMinterCanister } from "@dfinity/cketh";
import { createAgent } from "@dfinity/utils";

const agent = await createAgent({
  identity,
  host: HOST, // "https://icp-api.io" for mainnet
});

const { getSmartContractAddress } = CkEthMinterCanister.create({
  agent,
  canisterId: MY_CKETH_MINTER_CANISTER_ID,
});

const address = await getSmartContractAddress({});
```

## Documentation

You can find the API docs [here](https://js.icp.build/canisters/latest/api/cketh/).

## Resources

- [ckETH Minter](https://github.com/dfinity/ic/tree/master/rs/ethereum/cketh/minter)
- ckETH [testnet deployment arguments](https://github.com/dfinity/ic/tree/master/rs/ethereum/cketh/testnet)
- [How to Acquire ckETH](https://medium.com/dfinity/how-to-acquire-cketh-02d863c835fc) blog post by [Jennifer Tran](https://twitter.com/JKim_Tran)
