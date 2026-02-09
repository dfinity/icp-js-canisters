# sns-js

A library for interfacing with a Service Nervous System (SNS) project.

[![npm version](https://img.shields.io/npm/v/@dfinity/sns.svg?logo=npm)](https://www.npmjs.com/package/@dfinity/sns) [![GitHub license](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

> [!TIP]
> Still using `@dfinity/sns`? Upgrade to [`@icp-sdk/canisters/sns`](https://js.icp.build/canisters/latest/upgrading/v1/)!

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)

## Installation

You can use `sns-js` by installing it in your project.

```bash
npm i @dfinity/sns
```

The bundle needs peer dependencies, be sure that following resources are available in your project as well.

```bash
npm i @icp-sdk/core @dfinity/utils @dfinity/ledger
```

## Usage

`sns-js` can be utilized with two distinct approaches. The first approach is explorative, where you only need to provide the SNS root canister ID of your project to initialize a wrapper that handles routing the calls to the appropriate canister. This means having a single entry point for all functions. The second approach, which is more common, involves instantiating the specific canisters you require.

### Explorative way

The `explorative` approach has the advantage to simplify the code but, implies more costs as it queries the `root` canister for the list of canister IDs of the Sns project upon initialization.

```ts
import { createAgent } from "@dfinity/utils";
import { initSnsWrapper } from "@dfinity/sns";

const agent = await createAgent({
  identity,
  host: HOST, // "https://icp-api.io" for mainnet
});

const wrapper = await initSnsWrapper({
  rootOptions: {
    canisterId: rootCanisterId,
  },
  agent,
  certified,
});

const { metadata, swapState } = wrapper;
const [data, token] = await metadata({});

console.log("Sns:", data, token, swapState);
```

### Descriptive way

The descriptive approach limits the scope of the features but, is more verbose.

```ts
import { createAgent } from "@dfinity/utils";
import { SnsGovernanceCanister } from "@dfinity/sns";

const agent = await createAgent({
  identity,
  host: HOST, // "https://icp-api.io" for mainnet
});

const { metadata } = SnsGovernanceCanister.create({
  agent,
  canisterId: rootCanisterId,
});

const data = await metadata({ certified: true });

console.log("Summary data:", data);
```

## Documentation

You can find the API docs [here](https://js.icp.build/canisters/latest/api/sns/).
