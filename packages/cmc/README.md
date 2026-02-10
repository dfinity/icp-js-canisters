# cmc-js

A library for interfacing with the cycle minting canister.

[![npm version](https://img.shields.io/npm/v/@dfinity/cmc.svg?logo=npm)](https://www.npmjs.com/package/@dfinity/cmc) [![GitHub license](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

> [!TIP]
> Still using `@dfinity/cmc`? Upgrade to [`@icp-sdk/canisters/cmc`](https://js.icp.build/canisters/latest/upgrading/v1/)!

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)

## Installation

You can use `cmc-js` by installing it in your project.

```bash
npm i @dfinity/cmc
```

The bundle needs peer dependencies, be sure that following resources are available in your project as well.

```bash
npm i @icp-sdk/core @dfinity/utils
```

## Usage

The features are available through the class `CmcCanister`. It has to be instantiated with the canister ID of the cycles minting canister. On `mainnet`, its ID is `rkp4c-7iaaa-aaaaa-aaaca-cai`.

e.g. querying the current Icp to cycles conversion rate.

```ts
import { CmcCanister } from "@dfinity/cmc";
import { createAgent } from "@dfinity/utils";

const agent = await createAgent({
  identity,
  host: HOST,
});

const { getIcpToCyclesConversionRate } = CmcCanister.create({
  agent,
  canisterId: CYCLES_MINTING_CANISTER_ID,
});

const rate = await getIcpToCyclesConversionRate();
```

## Documentation

You can find the API docs [here](https://js.icp.build/canisters/latest/api/cmc/).
