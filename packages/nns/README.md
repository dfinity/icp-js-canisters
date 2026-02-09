# nns-js

A library for interfacing with the Internet Computer's Network Nervous System.

[![npm version](https://img.shields.io/npm/v/@dfinity/nns.svg?logo=npm)](https://www.npmjs.com/package/@dfinity/nns) [![GitHub license](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

> [!TIP]
> Still using `@dfinity/nns`? Upgrade to [`@icp-sdk/canisters/nns`](https://js.icp.build/canisters/latest/upgrading/v1/)!

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)

## Installation

You can use `nns-js` by installing it in your project.

```bash
npm i @dfinity/nns
```

The bundle needs peer dependencies, be sure that following resources are available in your project as well.

```bash
npm i @icp-sdk/core @dfinity/utils
```

## Usage

Most features are provided through the use of classes. For example, querying the list of neurons controlled by the caller with the `governance` canister:

```ts
import { NnsGovernanceCanister } from "@dfinity/nns";
import { createAgent } from "@dfinity/utils";

const agent = await createAgent({
  identity,
  host: HOST, // "https://icp-api.io" for mainnet
});

const { listNeurons } = NnsGovernanceCanister.create({
  agent,
  canisterId: MY_GOVERNANCE_CANISTER_ID,
});

const myNeurons = await listNeurons({ certified: false });
```

To execute this on a local environment, you will need to fetch the root key when initializing the agent. Additionally, you might need to adapt the port. The following snippet also demonstrates how you can inline a canister ID as well.

```typescript
import { NnsGovernanceCanister } from "@dfinity/nns";
import { Principal } from "@icp-sdk/core/principal";
import { createAgent } from "@dfinity/utils";

const agent = await createAgent({
  identity,
  host: "http://localhost:8000",
  fetchRootKey: true,
});

const { listNeurons } = NnsGovernanceCanister.create({
  agent,
  canisterId: Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai"),
});

const myNeurons = await listNeurons({ certified: false });
```

## Documentation

You can find the API docs [here](https://js.icp.build/canisters/latest/api/nns/).
