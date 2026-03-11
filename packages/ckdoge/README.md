# ckdoge-js

A library for interfacing with [ckDOGE](https://github.com/dfinity/ic/tree/master/rs/dogecoin/ckdoge/minter) on the Internet Computer.

[![npm version](https://img.shields.io/npm/v/@dfinity/ckdoge.svg?logo=npm)](https://www.npmjs.com/package/@dfinity/ckdoge) [![GitHub license](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)

## Installation

You can use `ckdoge-js` by installing it in your project.

```bash
npm i @dfinity/ckdoge
```

The bundle needs peer dependencies, be sure that following resources are available in your project as well.

```bash
npm i @icp-sdk/core @dfinity/utils
```

## Usage

The features are available through the class `CkDogeMinterCanister`. It has to be instantiated with a canister ID.

```ts
import { CkDogeMinterCanister } from "@dfinity/ckdoge";
import { createAgent } from "@dfinity/utils";

const agent = await createAgent({
  identity,
  host: HOST,
});

const { getDogeAddress } = CkDogeMinterCanister.create({
  agent,
  canisterId: MY_CKDOGE_MINTER_CANISTER_ID,
});

const dogeAddress = await getDogeAddress({});
```

## Documentation

You can find the API docs [here](https://js.icp.build/canisters/latest/api/ckdoge/).

## Resources

- [ckDOGE Minter](https://github.com/dfinity/ic/tree/master/rs/dogecoin/ckdoge/minter/)
