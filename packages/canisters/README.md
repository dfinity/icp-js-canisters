# `@icp-sdk/canisters`

A modular library for interacting with canisters on the Internet Computer.

[![npm version](https://img.shields.io/npm/v/@icp-sdk/canisters.svg?logo=npm)](https://www.npmjs.com/package/@icp-sdk/canisters) [![GitHub license](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Local Development](#local-development)

## Features

- ⚙️ **Unified interface** for interacting with core Internet Computer canisters
- 🧩 **Modular structure** with independent sub-packages
- 🔄 **Always up to date** with the latest Candid declarations
- 🧪 **Battle-tested and verified on-chain** through production dapps

## Installation

You can use the library by installing it in your project.

```bash
npm i @icp-sdk/canisters
```

## Usage

The SDK re-exports modules for core Internet Computer canisters and exposes them as sub-entries. Each sub-entry corresponds to a specific canister library.

Import the desired module directly from its entry point and refer to its individual documentation for details.

| Canister(s)   | Import                             | Documentation                                                    |
| ------------- | ---------------------------------- | ---------------------------------------------------------------- |
| CKBTC         | `@icp-sdk/canisters/ckbtc`         | [Docs](https://js.icp.build/canisters/latest/api/ckbtc/)         |
| CKETH         | `@icp-sdk/canisters/cketh`         | [Docs](https://js.icp.build/canisters/latest/api/cketh/)         |
| CMC           | `@icp-sdk/canisters/cmc`           | [Docs](https://js.icp.build/canisters/latest/api/cmc/)           |
| IC Management | `@icp-sdk/canisters/ic-management` | [Docs](https://js.icp.build/canisters/latest/api/ic-management/) |
| Ledger ICP    | `@icp-sdk/canisters/ledger/icp`    | [Docs](https://js.icp.build/canisters/latest/api/ledger/icp/)    |
| Ledger ICRC   | `@icp-sdk/canisters/ledger/icrc`   | [Docs](https://js.icp.build/canisters/latest/api/ledger/icrc/)   |
| Ledger Cycles | `@icp-sdk/canisters/ledger/cycles` | [Docs](https://js.icp.build/canisters/latest/api/ledger/cycles/) |
| NNS           | `@icp-sdk/canisters/nns`           | [Docs](https://js.icp.build/canisters/latest/api/nns/)           |
| SNS           | `@icp-sdk/canisters/sns`           | [Docs](https://js.icp.build/canisters/latest/api/sns/)           |

## Examples

Here's for example how to use the ckETH module through its sub-entry:

```typescript
import { CkEthMinterCanister } from "@icp-sdk/canisters/cketh";
import { createAgent } from "@dfinity/utils";

const agent = await createAgent({
  identity,
});

const { getSmartContractAddress } = CkEthMinterCanister.create({
  agent,
});

const address = await getSmartContractAddress({});
```

Similarly, the ICP and ICRC ledgers can be used as follows, with the slight difference that their imports are nested under a common parent.

```typescript
import { IcrcLedgerCanister } from "@icp-sdk/canisters/ledger/icrc";
import { createAgent } from "@dfinity/utils";

const agent = await createAgent({
  identity,
});

const { metadata } = IcrcLedgerCanister.create({
  agent,
});

const data = await metadata({});
```

## Local Development

When developing locally, you need to configure the agent to connect to your local replica instead of mainnet. You can also specify custom canister IDs deployed on your local environment.

```typescript
import { IcrcLedgerCanister } from "@icp-sdk/canisters/ledger/icrc";
import { createAgent } from "@dfinity/utils";

const agent = await createAgent({
  identity,
  host: "http://localhost:4943",
  fetchRootKey: true,
});

const { metadata } = IcrcLedgerCanister.create({
  agent,
  canisterId: MY_CANISTER_ID,
});

const data = await metadata({});
```
