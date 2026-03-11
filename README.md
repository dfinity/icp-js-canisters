# 📦 `@icp-sdk/canisters`

A modular library for interacting with canisters on the Internet Computer.

[![Internet Computer portal](https://img.shields.io/badge/Internet-Computer-grey?logo=internet%20computer)](https://internetcomputer.org)
[![Checks Status](https://img.shields.io/github/actions/workflow/status/dfinity/icp-js-canisters/checks.yml?logo=github&label=Build%20and%20checks)](https://github.com/dfinity/icp-js-canisters/actions/workflows/checks.yml)
[![GitHub Latest Release)](https://img.shields.io/github/v/release/dfinity/icp-js-canisters?logo=github&label=Last%20release)](https://github.com/dfinity/icp-js-canisters/releases)

## Introduction

This repository provides an SDK designed to make it easy to interact with Internet Computer canisters when developing frontend applications or Node.js scripts in TypeScript or JavaScript.

### ✅ Recommended

- [`@icp-sdk/canisters`](/packages/canisters): a **modular entry-point library** exposing various submodules for interacting with well-known Internet Computer canisters and services.

### 🧩 Legacy single-entry packages

The following libraries are exposed by the modular subpath-only library above, but remain available and are released in parallel for backward compatibility:

- [`@dfinity/nns`](/packages/nns): interfacing with the **governance** canisters of the Network Nervous System (NNS)
- [`@dfinity/sns`](/packages/sns): interacting with a Service Nervous System (SNS) project
- [`@dfinity/cmc`](/packages/cmc): interfacing with the **CMC** canister of the IC
- [`@dfinity/ledger-icp`](/packages/ledger-icp): interfacing with the **ICP** ledger
- [`@dfinity/ledger-icrc`](/packages/ledger-icrc): interacting with **ICRC**-compatible ledgers
- [`@dfinity/ckbtc`](/packages/ckbtc): interfacing with **ckBTC**
- [`@dfinity/ckdoge`](/packages/ckdoge): interfacing with **ckDOGE**
- [`@dfinity/cketh`](/packages/cketh): interfacing with **ckETH**
- [`@dfinity/ic-management`](/packages/ic-management): interfacing with the **IC management canister**

### 🧰 Utilities

This repo also provides various tools that are used internally by the SDK packages but also prove to be extremely useful when developing projects.

- [`@dfinity/utils`](/packages/utils): a collection of utilities and constants
- [`@dfinity/zod-schemas`](/packages/zod-schemas): reusable Zod schemas and validators for common data patterns in ICP applications

> [!NOTE]  
> `@dfinity/utils` is a peer dependency of the libraries exposed by `@icp-sdk/canisters` but is not itself re-exported by this library.

### 🗃️ Deprecated

While not deprecated on npm, the following library is no longer actively developed:

- [`@dfinity/nns-proto`](/packages/nns-proto): protobuf sources formerly used by `nns-js` to support hardware wallets.

## Installation

Install the recommended modular library from [npm](https://www.npmjs.com):

```bash
npm i @icp-sdk/canisters
```

Or, if you prefer to install individual packages:

```bash
npm i @dfinity/utils
npm i @dfinity/ledger-icp
npm i @dfinity/ledger-icrc
npm i @dfinity/nns
npm i @dfinity/sns
npm i @dfinity/cmc
npm i @dfinity/ckbtc
```

To ensure proper tree-shaking and avoid code duplication, all packages reference [`@icp-sdk/core`](https://github.com/dfinity/icp-js-core) and [`@dfinity/utils`](/packages/utils) as peer dependencies.

Make sure these are installed in your project:

```bash
npm i @icp-sdk/core @dfinity/utils
```

## Links

Here are some useful links:

- See the [HACKING](/HACKING.md) document for some information about local development
- [CHANGELOG](/CHANGELOG.md) or [Releases](https://github.com/dfinity/ic-js/releases) for version history
- [ADMIN](/ADMIN.md) for notes on repository administration
