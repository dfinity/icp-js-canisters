# Changelog

## v88

### Overview

| Library                  | Version | Status              |
| ------------------------ | ------- | ------------------- |
| `@icp-sdk/canisters`     | v3.0.0  | Breaking Changes ⚠️ |
| `@dfinity/ckbtc`         | v7.0.0  | Enhanced 🔧️         |
| `@dfinity/cketh`         | v7.0.0  | Enhanced 🔧️         |
| `@dfinity/cmc`           | v9.0.0  | Enhanced 🔧️         |
| `@dfinity/ic-management` | v10.0.0 | Enhanced 🔧️         |
| `@dfinity/ledger-icp`    | v9.0.0  | Enhanced 🔧️         |
| `@dfinity/ledger-icrc`   | v7.0.0  | Breaking Changes ⚠️ |
| `@dfinity/nns`           | v12.0.0 | Enhanced 🔧️         |
| `@dfinity/nns-proto`     | v2.0.4  | Unchanged️           |
| `@dfinity/sns`           | v7.0.0  | Enhanced 🔧️         |
| `@dfinity/utils`         | v4.0.2  | Maintained ⚙        |
| `@dfinity/zod-schemas`   | v3.0.2  | Maintained ⚙        |

### Breaking Changes

- The types for declarations of the canisters generated to describe the interfaces on the Internet Computer (Candid) are now re-exported through namespaces.

For example, the `Tokens` type of the `IcrcCanister` is available within the related namespace `IcrcLedgerDid`.

```typescript
import {
  type IcrcLedgerDid,
  IcrcLedgerCanister,
} from "@icp-sdk/canisters/ledger/icrc";

const { balance } = IcrcLedgerCanister.create({
  agent,
  canisterId,
});

const data: IcrcLedgerDid.Tokens = await balance({ owner });
```

- The following canisters have been renamed for consistency and readability:

| Old                         | New 🆕                      |
| --------------------------- | --------------------------- |
| `CkBTCMinterCanister`       | `CkBtcMinterCanister`       |
| `CkETHMinterCanister`       | `CkEthMinterCanister`       |
| `CkETHOrchestratorCanister` | `CkEthOrchestratorCanister` |
| `CMCCanister`               | `CmcCanister`               |
| `ICManagementCanister`      | `IcManagementCanister`      |
| `LedgerCanister`            | `IcpLedgerCanister`         |
| `IndexCanister`             | `IcpIndexCanister`          |
| `GenesisTokenCanister`      | `NnsGenesisTokenCanister`   |
| `GovernanceCanister`        | `NnsGovernanceCanister`     |
| `GovernanceTestCanister`    | `NnsGovernanceTestCanister` |

- The deprecated implementation of the ICRC Index canister has been deleted, and its common implementation becomes the new standard.

In other words, `IcrcIndexNgCanister` becomes `IcrcIndexCanister`.

| Old                   | New 🆕              |
| --------------------- | ------------------- |
| `IcrcIndexCanister`   | ---                 |
| `IcrcIndexNgCanister` | `IcrcIndexCanister` |

### Features

- New class `IcrcNftLedgerCanister` to interface with ICRC-7 standards.
- Add method `collectionMetadata` in class `IcrcNftLedgerCanister` to fetch a collection's metadata.

## v87

### Overview

| Library                  | Version | Status     |
| ------------------------ | ------- | ---------- |
| `@icp-sdk/canisters`     | v2.0.1  | Unchanged️  |
| `@dfinity/ckbtc`         | v6.0.1  | Unchanged️  |
| `@dfinity/cketh`         | v6.0.1  | Unchanged️  |
| `@dfinity/cmc`           | v8.0.1  | Unchanged️  |
| `@dfinity/ic-management` | v9.0.1  | Unchanged️  |
| `@dfinity/ledger-icp`    | v8.0.1  | Unchanged️  |
| `@dfinity/ledger-icrc`   | v6.0.1  | Unchanged️  |
| `@dfinity/nns`           | v11.1.4 | Patched ⚙️ |
| `@dfinity/nns-proto`     | v2.0.4  | Unchanged️  |
| `@dfinity/sns`           | v6.0.1  | Unchanged️  |
| `@dfinity/utils`         | v4.0.1  | Unchanged️  |
| `@dfinity/zod-schemas`   | v3.0.1  | Unchanged️  |

### Fix

- Updated `@dfinity/nns` peer dependency to `@dfinity/ledger-icp >=7` to resolve installation conflicts with `@icp-sdk/canisters@1.1.1`.

### Overview

| Library                  | Version | Status       |
| ------------------------ | ------- | ------------ |
| `@icp-sdk/canisters`     | v2.0.1  | Maintained ⚙ |
| `@dfinity/ckbtc`         | v6.0.1  | Maintained ⚙ |
| `@dfinity/cketh`         | v6.0.1  | Maintained ⚙ |
| `@dfinity/cmc`           | v8.0.1  | Maintained ⚙ |
| `@dfinity/ic-management` | v9.0.1  | Maintained ⚙ |
| `@dfinity/ledger-icp`    | v8.0.1  | Maintained ⚙ |
| `@dfinity/ledger-icrc`   | v6.0.1  | Maintained ⚙ |
| `@dfinity/nns`           | v11.1.3 | Maintained ⚙ |
| `@dfinity/nns-proto`     | v2.0.4  | Unchanged️    |
| `@dfinity/sns`           | v6.0.1  | Maintained ⚙ |
| `@dfinity/utils`         | v4.0.1  | Unchanged️    |
| `@dfinity/zod-schemas`   | v3.0.1  | Unchanged️    |

### Chore

- Update docs links to https://js.icp.build/canisters
- Display a tip in the README of the ("legacy") libraries to promote usage of `@icp-sdk/canisters`.
- Remove generated TypeScript docs from the README, as they now appear in the online documentation.

## v85

### Overview

| Library                  | Version | Status              |
| ------------------------ | ------- | ------------------- |
| `@icp-sdk/canisters`     | v2.0.0  | Breaking Changes ⚠️ |
| `@dfinity/ckbtc`         | v6.0.0  | Breaking Changes ⚠️ |
| `@dfinity/cketh`         | v6.0.0  | Breaking Changes ⚠️ |
| `@dfinity/cmc`           | v8.0.0  | Breaking Changes ⚠️ |
| `@dfinity/ic-management` | v9.0.0  | Breaking Changes ⚠️ |
| `@dfinity/ledger-icp`    | v8.0.0  | Breaking Changes ⚠️ |
| `@dfinity/ledger-icrc`   | v6.0.0  | Breaking Changes ⚠️ |
| `@dfinity/nns`           | v11.1.2 | Maintained ⚙        |
| `@dfinity/nns-proto`     | v2.0.4  | Maintained ⚙        |
| `@dfinity/sns`           | v6.0.0  | Breaking Changes ⚠️ |
| `@dfinity/utils`         | v4.0.1  | Maintained ⚙        |
| `@dfinity/zod-schemas`   | v3.0.1  | Maintained ⚙        |

### Breaking Changes

- Various Candid-inherited types are no longer expressed as unions and resolves to a single type. For example: `Uint8Array` instead of `Uint8Array | number[]`.
- The `canisterStatus` function interface was modified to introduce support for query calls.

### Features

- Update to the latest Candid files.
- Expose type `TransferSnsTreasuryFunds` for SNS.

### Chore

- Set up a new package and pipeline to generate documentation using `typedoc`.
- Updated the repo URL to `icp-js-canisters` in `package.json`.

## v84

### Overview

| Library                  | Version | Status       |
| ------------------------ | ------- | ------------ |
| `@icp-sdk/canisters`     | v1.1.1  | Maintained ⚙ |
| `@dfinity/ckbtc`         | v5.0.1  | Unchanged️    |
| `@dfinity/cketh`         | v5.0.1  | Unchanged️    |
| `@dfinity/cmc`           | v7.0.1  | Unchanged️    |
| `@dfinity/ic-management` | v8.0.2  | Maintained ⚙ |
| `@dfinity/ledger-icp`    | v7.0.1  | Unchanged️    |
| `@dfinity/ledger-icrc`   | v5.0.1  | Unchanged️    |
| `@dfinity/nns`           | v11.1.1 | Maintained ⚙ |
| `@dfinity/nns-proto`     | v2.0.3  | Unchanged️    |
| `@dfinity/sns`           | v5.0.0  | Unchanged️    |
| `@dfinity/utils`         | v4.0.0  | Unchanged️    |
| `@dfinity/zod-schemas`   | v3.0.0  | Unchanged️    |

### Fix

- The IC management `canister_status` function is defined to support queries according latest DID files, but `@dfinity/ic-management` does not yet implement them. The service has therefore been pinned to use only update calls, as it always did previously.

### Features

- The `ICManagementCanister` implementation has been extended to support both query and update factories. All functions now use the latter, except for `fetch_canister_logs`, which correctly requires a query call. This aligns with the existing behavior.

### Test

- Update mocks data for `@dfinity/nns` according latest DID definitions.

## v83

### Overview

| Library                  | Version | Status                    |
| ------------------------ | ------- | ------------------------- |
| `@icp-sdk/canisters`     | v1.1.0  | Bundled with peer deps ⚠️ |
| `@dfinity/ckbtc`         | v5.0.1  | Maintained ⚙              |
| `@dfinity/cketh`         | v5.0.1  | Maintained ⚙              |
| `@dfinity/cmc`           | v7.0.1  | Maintained ⚙              |
| `@dfinity/ic-management` | v8.0.1  | Maintained ⚙              |
| `@dfinity/ledger-icp`    | v7.0.1  | Maintained ⚙              |
| `@dfinity/ledger-icrc`   | v5.0.1  | Maintained ⚙              |
| `@dfinity/nns`           | v11.1.0 | Enhanced 🔧️               |
| `@dfinity/nns-proto`     | v2.0.3  | Unchanged️                 |
| `@dfinity/sns`           | v5.0.0  | Maintained ⚙              |
| `@dfinity/utils`         | v4.0.0  | Unchanged️                 |
| `@dfinity/zod-schemas`   | v3.0.0  | Unchanged️                 |

### Features

- Re-export libraries as **peer dependencies** in `@icp-sdk/canisters` instead of bundling source code. This structural change is required to resolve inter-dependency issues.
- Add new governance `nnsFunctions`.
- Update to the latest Candid files.

### Fix

- Resolve type incompatibility when using functions from `@icp-sdk/canisters/nns` that require the ICP ledger canister as a parameter.

## v82

### Overview

| Library                  | Version | Status              |
| ------------------------ | ------- | ------------------- |
| `@icp-sdk/canisters`     | v1.0.0  | New 🚀              |
| `@dfinity/ckbtc`         | v5.0.0  | Breaking Changes ⚠️ |
| `@dfinity/cketh`         | v5.0.0  | Breaking Changes ⚠️ |
| `@dfinity/cmc`           | v7.0.0  | Breaking Changes ⚠️ |
| `@dfinity/ic-management` | v8.0.0  | Breaking Changes ⚠️ |
| `@dfinity/ledger-icp`    | v7.0.0  | Breaking Changes ⚠️ |
| `@dfinity/ledger-icrc`   | v5.0.0  | Breaking Changes ⚠️ |
| `@dfinity/nns`           | v11.0.0 | Breaking Changes ⚠️ |
| `@dfinity/nns-proto`     | v2.0.3  | Maintained ⚙        |
| `@dfinity/sns`           | v5.0.0  | Breaking Changes ⚠️ |
| `@dfinity/utils`         | v4.0.0  | Breaking Changes ⚠️ |
| `@dfinity/zod-schemas`   | v3.0.0  | Breaking Changes ⚠️ |

### Breaking Changes

- Peer dependencies have been migrated to `@icp-sdk/core` instead of the `@dfinity/*` scoped libraries for agent, identity, and candid.
- Node.js bundles are now shipped as `ESM`.
- `Candid` types must be consumed through their exposed entry points and can no longer be imported via absolute paths (which, in any case, was never an official way to consume them).

> [!NOTE]
> Although this release introduces structural breaking changes, **no functional changes** are expected.  
> A strict "no-changes" freeze was maintained to prepare this release.

### Features

- Released `@icp-sdk/canisters`, a new modular entry-point library for interacting with core Internet Computer canisters.
- Exposed `ReimbursedDeposit` and `ReimbursementRequest` in `ckbtc`.
- Exposed `SnsAccount`, `SnsDisburseMaturityInProgress`, and `SnsNeuronPermission` in `sns`.

### Fix

- Corrected the `Subaccount` type reference, which was previously incorrectly scoped to the ledger ICRC library instead of its own definition in the ckETH minter.

### Refactoring

- Internal structure refactored to support ESM for Node.js; bundles are now emitted at the root of each `dist` folder.
- `candid` folders were moved from package roots to their respective `src` folders.

### Build

- Added `exports` fields to each `package.json`.
- Migrated DID codegen tooling from `didc` to `@icp-sdk/binden`, required for generating interfaces that use the new `@icp-sdk` imports.

### Chore

- Removed modified boilerplate from license files.

## v81

### Overview

| Library                  | Version | Status       |
| ------------------------ | ------- | ------------ |
| `@dfinity/ckbtc`         | v4.0.6  | Maintained ⚙ |
| `@dfinity/cketh`         | v4.0.6  | Maintained ⚙ |
| `@dfinity/cmc`           | v6.0.6  | Maintained ⚙ |
| `@dfinity/ic-management` | v7.1.3  | Maintained ⚙ |
| `@dfinity/ledger-icp`    | v6.1.2  | Maintained ⚙ |
| `@dfinity/ledger-icrc`   | v4.1.2  | Maintained ⚙ |
| `@dfinity/nns`           | v10.4.0 | Enhanced 🔧️  |
| `@dfinity/nns-proto`     | v2.0.2  | Unchanged️    |
| `@dfinity/sns`           | v4.1.2  | Maintained ⚙ |
| `@dfinity/utils`         | v3.2.0  | Unchanged️    |
| `@dfinity/zod-schemas`   | v2.1.0  | Unchanged️    |

### Features

- Map `committed_topics` in the `RegisterKnownNeuron` proposal action type of `nns-js`.
- Update latest Candid files.

## v80

### Overview

| Library                  | Version | Status       |
| ------------------------ | ------- | ------------ |
| `@dfinity/ckbtc`         | v4.0.5  | Maintained ⚙ |
| `@dfinity/cketh`         | v4.0.5  | Maintained ⚙ |
| `@dfinity/cmc`           | v6.0.5  | Maintained ⚙ |
| `@dfinity/ic-management` | v7.1.2  | Maintained ⚙ |
| `@dfinity/ledger-icp`    | v6.1.1  | Maintained ⚙ |
| `@dfinity/ledger-icrc`   | v4.1.1  | Maintained ⚙ |
| `@dfinity/nns`           | v10.3.1 | Maintained ⚙ |
| `@dfinity/nns-proto`     | v2.0.2  | Unchanged️    |
| `@dfinity/sns`           | v4.1.1  | Maintained ⚙ |
| `@dfinity/utils`         | v3.2.0  | Unchanged️    |
| `@dfinity/zod-schemas`   | v2.1.0  | Unchanged️    |

### Features

- Update latest Candid files.

### Chore

- Adapt script that generates DID files to support governance patches.

## v79

### Overview

| Library                  | Version | Status      |
| ------------------------ | ------- | ----------- |
| `@dfinity/ckbtc`         | v4.0.4  | Unchanged️   |
| `@dfinity/cketh`         | v4.0.4  | Unchanged️   |
| `@dfinity/cmc`           | v6.0.4  | Unchanged️   |
| `@dfinity/ic-management` | v7.1.1  | Unchanged️   |
| `@dfinity/ledger-icp`    | v6.1.0  | Unchanged️   |
| `@dfinity/ledger-icrc`   | v4.1.0  | Enhanced 🔧️ |
| `@dfinity/nns`           | v10.3.0 | Enhanced 🔧️ |
| `@dfinity/nns-proto`     | v2.0.2  | Unchanged️   |
| `@dfinity/sns`           | v4.1.0  | Unchanged️   |
| `@dfinity/utils`         | v3.2.0  | Unchanged️   |
| `@dfinity/zod-schemas`   | v2.1.0  | Unchanged️   |

### Features

- Support the parameter `toAccount` in the function to disburse maturity in the NNS package.
- Add the `getMintingAccount` method in the `IcrcLedgerCanister` class.
- Create util to convert a Candid `Account` object into an `IcrcAccount` type, and vice versa.

## v78

### Overview

| Library                  | Version | Status       |
| ------------------------ | ------- | ------------ |
| `@dfinity/ckbtc`         | v4.0.4  | Maintained ⚙ |
| `@dfinity/cketh`         | v4.0.4  | Maintained ⚙ |
| `@dfinity/cmc`           | v6.0.4  | Maintained ⚙ |
| `@dfinity/ic-management` | v7.1.1  | Maintained ⚙ |
| `@dfinity/ledger-icp`    | v6.1.0  | Enhanced 🔧️  |
| `@dfinity/ledger-icrc`   | v4.0.4  | Maintained ⚙ |
| `@dfinity/nns`           | v10.2.0 | Enhanced 🔧️  |
| `@dfinity/nns-proto`     | v2.0.2  | Unchanged️    |
| `@dfinity/sns`           | v4.1.0  | Enhanced 🔧️  |
| `@dfinity/utils`         | v3.2.0  | Unchanged️    |
| `@dfinity/zod-schemas`   | v2.1.0  | Unchanged️    |

### Features

- Replace remaining usage of `Buffer` in `@dfinity/ledger-icp` in the `AccountIdentifier.fromHex` conversion.
- Replace remaining usage of `Buffer` in `@dfinity/nns` in `accountIdentifierFromBytes`.
- Add support for several SNS action types.
- Use new utility `assertNever` in `@dfinity/sns`.
- Update latest Candid files.

## v77

### Overview

| Library                  | Version | Status       |
| ------------------------ | ------- | ------------ |
| `@dfinity/ckbtc`         | v4.0.3  | Maintained ⚙ |
| `@dfinity/cketh`         | v4.0.3  | Maintained ⚙ |
| `@dfinity/cmc`           | v6.0.3  | Maintained ⚙ |
| `@dfinity/ic-management` | v7.1.0  | Enhanced 🔧️  |
| `@dfinity/ledger-icp`    | v6.0.2  | Maintained ⚙ |
| `@dfinity/ledger-icrc`   | v4.0.3  | Maintained ⚙ |
| `@dfinity/nns`           | v10.1.1 | Maintained ⚙ |
| `@dfinity/nns-proto`     | v2.0.2  | Unchanged️    |
| `@dfinity/sns`           | v4.0.4  | Maintained ⚙ |
| `@dfinity/utils`         | v3.2.0  | Enhanced 🔧️  |
| `@dfinity/zod-schemas`   | v2.1.0  | Unchanged️    |

### Features

- Support functions required for downloading and uploading snapshots offline.
- Add a new utility `assertNever` to `@dfinity/utils` to help detect when a new variant is added to a union but not yet handled in the logic.

### Chore

- Upgrade `didc` to `v0.5.2` that converts Candid files into JS and TS.
- Update the library's Candid types as generated by the latest `didc` version.

## v76

### Overview

| Library                  | Version | Status       |
| ------------------------ | ------- | ------------ |
| `@dfinity/ckbtc`         | v4.0.2  | Maintained ⚙ |
| `@dfinity/cketh`         | v4.0.2  | Maintained ⚙ |
| `@dfinity/cmc`           | v6.0.2  | Maintained ⚙ |
| `@dfinity/ic-management` | v7.0.3  | Maintained ⚙ |
| `@dfinity/ledger-icp`    | v6.0.1  | Maintained ⚙ |
| `@dfinity/ledger-icrc`   | v4.0.2  | Maintained ⚙ |
| `@dfinity/nns`           | v10.1.0 | Enhanced 🔧️  |
| `@dfinity/nns-proto`     | v2.0.2  | Unchanged️    |
| `@dfinity/sns`           | v4.0.3  | Maintained ⚙ |
| `@dfinity/utils`         | v3.1.0  | Unchanged️    |
| `@dfinity/zod-schemas`   | v2.1.0  | Unchanged️    |

### Features

- Updated `@dfinity/nns` to support a new action type, `DeregisterKnownNeuron`.
- Updated `@dfinity/nns` to include a new `links` field in the `RegisterKnownNeuron` action.
- Updated `@dfinity/nns` to add support for the `memo` field in the `Split` command.

### Refactoring

- Remove unused mocks and extract snapshot interfaces in `@dfinity/ic-management`.

## v75

### Overview

| Library                  | Version | Status       |
| ------------------------ | ------- | ------------ |
| `@dfinity/ckbtc`         | v4.0.1  | Unchanged️    |
| `@dfinity/cketh`         | v4.0.1  | Unchanged️    |
| `@dfinity/cmc`           | v6.0.1  | Unchanged️    |
| `@dfinity/ic-management` | v7.0.2  | Maintained ⚙ |
| `@dfinity/ledger-icp`    | v6.0.0  | Unchanged️️    |
| `@dfinity/ledger-icrc`   | v4.0.1  | Maintained ⚙ |
| `@dfinity/nns`           | v10.0.1 | Unchanged️️    |
| `@dfinity/nns-proto`     | v2.0.2  | Unchanged️    |
| `@dfinity/sns`           | v4.0.2  | Maintained ⚙ |
| `@dfinity/utils`         | v3.1.0  | Enhanced 🔧️  |
| `@dfinity/zod-schemas`   | v2.1.0  | Unchanged️    |

### Features

- Expose Ledger canister response types: `Status` as `IcrcNgStatus`.
- Expose Ledger canister response types: `ICRC3Value` as `Icrc3Value`, `Allowance` as `IcrcAllowance`, `GetBlocksArgs` as `IcrcGetBlocksArgs`, `GetBlocksResult` as `IcrcGetBlocksResult`, `Timestamp` as `IcrcTimestamp`.
- Improve `Principal` detection in `jsonReplacer`.

## v74

### Overview

| Library                  | Version | Status              |
| ------------------------ | ------- | ------------------- |
| `@dfinity/ckbtc`         | v4.0.1  | Maintained ⚙        |
| `@dfinity/cketh`         | v4.0.1  | Maintained ⚙        |
| `@dfinity/cmc`           | v6.0.1  | Maintained ⚙        |
| `@dfinity/ic-management` | v7.0.1  | Maintained ⚙        |
| `@dfinity/ledger-icp`    | v6.0.0  | Breaking Changes ⚠️ |
| `@dfinity/ledger-icrc`   | v4.0.0  | Breaking Changes ⚠️ |
| `@dfinity/nns`           | v10.0.1 | Maintained ⚙        |
| `@dfinity/nns-proto`     | v2.0.2  | Unchanged️           |
| `@dfinity/sns`           | v4.0.1  | Maintained ⚙        |
| `@dfinity/utils`         | v3.0.1  | Maintained ⚙        |
| `@dfinity/zod-schemas`   | v2.1.0  | Unchanged️           |

### Breaking Changes

- ICRC-21 `LineDisplay` has been deprecated and replaced with `FieldsDisplay` (see [related changes](https://github.com/dfinity/wg-identity-authentication/pull/229)). Consequently, the interfaces of `@dfinity/ledger-icp` and `@ledger-icrc` have been updated in a non–backwards-compatible way.

### Features

- Removed usage of `Buffer` in `@dfinity/nns`.
- Updated Candid file definitions to the latest version (except in `@dfinity/ic-management`).

### Build

- Updated AgentJS libraries to `v3.2.4` for development.

## v73

### Overview

| Library                  | Version | Status      |
| ------------------------ | ------- | ----------- |
| `@dfinity/ckbtc`         | v4.0.0  | Enhanced 🔧️ |
| `@dfinity/cketh`         | v4.0.0  | Enhanced 🔧️ |
| `@dfinity/cmc`           | v6.0.0  | Enhanced 🔧️ |
| `@dfinity/ic-management` | v7.0.0  | Enhanced 🔧️ |
| `@dfinity/ledger-icp`    | v5.0.0  | Enhanced 🔧️ |
| `@dfinity/ledger-icrc`   | v3.0.0  | Enhanced 🔧️ |
| `@dfinity/nns`           | v10.0.0 | Enhanced 🔧️ |
| `@dfinity/nns-proto`     | v2.0.2  | Unchanged️   |
| `@dfinity/sns`           | v4.0.0  | Enhanced 🔧️ |
| `@dfinity/utils`         | v3.0.0  | Enhanced 🔧️ |
| `@dfinity/zod-schemas`   | v2.1.0  | Enhanced 🔧️️ |

### Build

- Migrate to AgentJS v3. For upgrade guidelines, check out its [release notes](https://js.icp.build/core/release-notes/v300/).
- Accept any version of `@dfinity/principal` for `zod-schemas`.

> [!NOTE]
> The libraries are published using major versioning to highlight the update to this important peer dependency.
> However, there are no other changes in this release, so no functional changes should be expected.

## v72

### Overview

| Library                  | Version | Status        |
| ------------------------ | ------- | ------------- |
| `@dfinity/ckbtc`         | v3.2.0  | Enhanced 🔧️   |
| `@dfinity/cketh`         | v3.4.12 | Maintained ⚙️ |
| `@dfinity/cmc`           | v5.0.8  | Maintained ⚙️ |
| `@dfinity/ic-management` | v6.2.2  | Maintained ⚙️ |
| `@dfinity/ledger-icp`    | v4.1.0  | Enhanced 🔧️   |
| `@dfinity/ledger-icrc`   | v2.10.0 | Enhanced 🔧️   |
| `@dfinity/nns`           | v9.1.0  | Enhanced 🔧️   |
| `@dfinity/nns-proto`     | v2.0.2  | Unchanged️     |
| `@dfinity/sns`           | v3.8.0  | Enhanced 🔧️   |
| `@dfinity/utils`         | v2.14.0 | Enhanced 🔧️   |
| `@dfinity/zod-schemas`   | v2.0.0  | Unchanged️     |

### Features

- New utility `uint8ArraysEqual` to compare two Uint8Arrays for byte-level equality.
- Replace usage of `Buffer` with `Uint8Array` in `checkAccountId` of `@dfinity/ledger-icp`.
- Expose the `icrc1_supported_standards` and `icrc10_supported_standards` methods in the `IcrcLedgerCanister` class.

### Build

- Bump `@noble/hashes` to v1.8.0 in ckBTC, NNS, and SNS JS libraries and update sha256 import for `@noble/hashes/sha2`.
- Bump `base58-js` to v3.0.3 in ckBTC JS library and remove custom type declarations.

## v71

### Overview

| Library                  | Version | Status              |
| ------------------------ | ------- | ------------------- |
| `@dfinity/ckbtc`         | v3.1.14 | Maintained ⚙️       |
| `@dfinity/cketh`         | v3.4.11 | Maintained ⚙️       |
| `@dfinity/cmc`           | v5.0.7  | Maintained ⚙️       |
| `@dfinity/ic-management` | v6.2.1  | Maintained ⚙️       |
| `@dfinity/ledger-icp`    | v4.0.0  | Breaking Changes ⚠️ |
| `@dfinity/ledger-icrc`   | v2.9.1  | Maintained ⚙️       |
| `@dfinity/nns`           | v9.0.0  | Breaking Changes ⚠️ |
| `@dfinity/nns-proto`     | v2.0.2  | Unchanged️           |
| `@dfinity/sns`           | v3.7.1  | Maintained ⚙️       |
| `@dfinity/utils`         | v2.13.2 | Maintained ⚙️       |
| `@dfinity/zod-schemas`   | v2.0.0  | Breaking Changes ⚠️ |

### Breaking Changes

- Move `accountIdentifierToBytes`, `accountIdentifierFromBytes` and `principalToAccountIdentifier` from `@dfinity/ledger-icp` to `@dfinity/nns`.
- Rename `getLastestRewardEvent` to `getLatestRewardEvent` in `@dfinity/nns`.
- Migrate `@dfinity/zod-schemas` to Zod library v4.

### Features

- Updated `@dfinity/nns` to add support to a new type of action `RegisterExtension`.
- Updated `@dfinity/nns` to add support for setting following for multiple topics (`setFollowing`).
- Updated `@dfinity/nns` to add support for get network metrics (`getMetrics`).
- Replace usage of `randombytes` library with the API `crypto.getRandomValues` in `@dfinity/nns`.
- Updated `@dfinity/nns` to expose `total_potential_voting_power` in `list_proposal`.
- Expose method `icrc106_get_index_principal` in class `IcrcLedgerCanister`.

### Build

- Add explicit dependency requirement on `buffer` to `@dfinity/nns`.

### Chore

- Migrate from `Jest` to `Vitest`.

## v70

### Overview

| Library                  | Version | Status              |
| ------------------------ | ------- | ------------------- |
| `@dfinity/ckbtc`         | v3.1.13 | Maintained ⚙️       |
| `@dfinity/cketh`         | v3.4.10 | Maintained ⚙️       |
| `@dfinity/cmc`           | v5.0.6  | Maintained ⚙️       |
| `@dfinity/ic-management` | v6.2.0  | Enhanced 🔧️         |
| `@dfinity/ledger-icp`    | v3.0.0  | Breaking Changes ⚠️ |
| `@dfinity/ledger-icrc`   | v2.9.0  | Enhanced 🔧️         |
| `@dfinity/nns`           | v8.5.0  | Enhanced 🔧️         |
| `@dfinity/nns-proto`     | v2.0.2  | Unchanged️           |
| `@dfinity/sns`           | v3.7.0  | Enhanced 🔧️         |
| `@dfinity/utils`         | v2.13.1 | Maintained ⚙️       |
| `@dfinity/zod-schemas`   | v1.0.0  | Breaking Changes ⚠️ |

### Breaking Changes

- Assert checksum when parsing ICP `AccountIdentifier` from hex. (\*).
- Assert length equals 32 bytes when parsing ICP `AccountIdentifier` from hex. (\*)
- Modify the ICP `SubAccount.fromBytes` to throw an error instead of returning one when the input length is invalid. (\*\*)
- Migrate `@dfinity/zod-schemas` to `zod/v4`.

(\*) This fix is not a breaking change per se, but applications that previously accepted invalid account identifiers will now fail.
Since that behavior was **incorrect**, we decided to proceed with the change anyway. If this impacts you, feel free to reach out!

(\*\*) Returning an error was likely a historical artifact. For consistency, we decided to align this behavior with other similar functions.

### Features

- Expose method `listSubaccounts` in class `IcrcIndexCanister`.
- Extend the `transform` function to support `provisional_create_canister_with_cycles` when used with PocketIC.
- Add validation to `decodeIcrcAccount` to reject account strings with more than one `.` separator.

## v69

### Overview

| Library                  | Version | Status        |
| ------------------------ | ------- | ------------- |
| `@dfinity/ckbtc`         | v3.1.12 | Maintained ⚙️ |
| `@dfinity/cketh`         | v3.4.9  | Maintained ⚙️ |
| `@dfinity/cmc`           | v5.0.5  | Maintained ⚙️ |
| `@dfinity/ic-management` | v6.1.1  | Maintained ⚙️ |
| `@dfinity/ledger-icp`    | v2.6.13 | Maintained ⚙️ |
| `@dfinity/ledger-icrc`   | v2.8.1  | Maintained ⚙️ |
| `@dfinity/nns`           | v8.4.1  | Maintained ⚙️ |
| `@dfinity/nns-proto`     | v2.0.2  | Unchanged️     |
| `@dfinity/sns`           | v3.6.0  | Enhanced 🔧️   |
| `@dfinity/utils`         | v2.13.0 | Enhanced 🔧️   |
| `@dfinity/zod-schemas`   | v0.0.2  | Unchanged️     |

### Features

- Updated `@dfinity/sns` to add support for filtering SNS proposals by topics.
- Removed (unused) `topic_followee_index` in NNS Governance Candid type.
- Added `hashObject` and `hashText` utilities to generate a SHA-256 hash from the given object.

### Chore

- Upgraded GitHub actions runners to `ubuntu-24.04`.

## v68

### Overview

| Library                  | Version | Status        |
| ------------------------ | ------- | ------------- |
| `@dfinity/ckbtc`         | v3.1.11 | Maintained ⚙️ |
| `@dfinity/cketh`         | v3.4.8  | Maintained ⚙️ |
| `@dfinity/cmc`           | v5.0.4  | Maintained ⚙️ |
| `@dfinity/ic-management` | v6.1.0  | Enhanced 🔧️   |
| `@dfinity/ledger-icp`    | v2.6.12 | Maintained ⚙️ |
| `@dfinity/ledger-icrc`   | v2.8.0  | Enhanced 🔧️   |
| `@dfinity/nns`           | v8.4.0  | Enhanced 🔧️   |
| `@dfinity/nns-proto`     | v2.0.2  | Unchanged️     |
| `@dfinity/sns`           | v3.5.0  | Enhanced 🔧️   |
| `@dfinity/utils`         | v2.12.0 | Enhanced 🔧️   |
| `@dfinity/zod-schemas`   | v0.0.2  | Unchanged️     |

### Features

- Add utility `isIcpAccountIdentifier` to check if a string is a valid ICP account identifier.
- Utility `notEmptyString` to use a type predicate, ensuring that the input is a string type when it returns true.
- Support `disburseMaturity` in `@dfinity/nns`.
- Update `@dfinity/ic-management` to support optional new setting `wasm_memory_threshold` and return the new `memory_metrics`.
- Add `neuronMinimumDissolveDelayToVoteSeconds` to nns `VotingPowerEconomics`.
- Expose method `status` in class `IcrcIndexCanister`.
- Expose method `icrc3_get_blocks` in class `IcrcLedgerCanister`.
- Add `setFollowing` to sns governance canister.
- New service util `queryAndUpdate` that aids in executing a request and handling the results, for both type of calls.
- Added type predicate to narrow value to `undefined`, `null`, or empty string in type guards in util `isEmptyString`.

## 2025.03.10-1330Z

### Overview

| Library                  | Version | Status        |
| ------------------------ | ------- | ------------- |
| `@dfinity/ckbtc`         | v3.1.10 | Maintained ⚙️ |
| `@dfinity/cketh`         | v3.4.7  | Maintained ⚙️ |
| `@dfinity/cmc`           | v5.0.3  | Maintained ⚙️ |
| `@dfinity/ic-management` | v6.0.6  | Maintained ⚙️ |
| `@dfinity/ledger-icp`    | v2.6.11 | Maintained ⚙️ |
| `@dfinity/ledger-icrc`   | v2.7.6  | Maintained ⚙️ |
| `@dfinity/nns`           | v8.3.2  | Maintained ⚙️ |
| `@dfinity/nns-proto`     | v2.0.2  | Unchanged️     |
| `@dfinity/sns`           | v3.4.0  | Enhanced 🔧️   |
| `@dfinity/utils`         | v2.11.0 | Enhanced 🔧️   |
| `@dfinity/zod-schemas`   | v0.0.2  | Unchanged️     |

### Features

- Add utility `toBigIntNanoSeconds` to convert `Date` object to timestamp in nanoseconds `bigint`.
- Add support to a new type of action `SetTopicsForCustomProposals` in sns.
- Update Candid files for `@dfinity/sns`.

## 2025.02.21-1530Z

### Overview

| Library                  | Version | Status        |
| ------------------------ | ------- | ------------- |
| `@dfinity/ckbtc`         | v3.1.8  | Maintained ⚙️ |
| `@dfinity/cketh`         | v3.4.5  | Maintained ⚙️ |
| `@dfinity/cmc`           | v5.0.1  | Maintained ⚙️ |
| `@dfinity/ic-management` | v6.0.5  | Unchanged️     |
| `@dfinity/ledger-icp`    | v2.6.9  | Maintained ⚙️ |
| `@dfinity/ledger-icrc`   | v2.7.4  | Maintained ⚙️ |
| `@dfinity/nns`           | v8.3.0  | Maintained ⚙️ |
| `@dfinity/nns-proto`     | v2.0.2  | Unchanged️     |
| `@dfinity/sns`           | v3.3.0  | Enhanced 🔧️   |
| `@dfinity/utils`         | v2.10.1 | Unchanged️     |
| `@dfinity/zod-schemas`   | v0.0.2  | Unchanged️     |

### Features

- Support `topic` and `list_topics` in `@dfinity/sns`.

## 2025.02.19-1030Z

### Overview

| Library                  | Version | Status        |
| ------------------------ | ------- | ------------- |
| `@dfinity/ckbtc`         | v3.1.8  | Maintained ⚙️ |
| `@dfinity/cketh`         | v3.4.5  | Maintained ⚙️ |
| `@dfinity/cmc`           | v5.0.1  | Maintained ⚙️ |
| `@dfinity/ic-management` | v6.0.5  | Maintained ⚙️ |
| `@dfinity/ledger-icp`    | v2.6.9  | Maintained ⚙️ |
| `@dfinity/ledger-icrc`   | v2.7.4  | Maintained ⚙️ |
| `@dfinity/nns`           | v8.3.0  | Enhanced 🔧️   |
| `@dfinity/nns-proto`     | v2.0.2  | Unchanged️     |
| `@dfinity/sns`           | v3.2.10 | Maintained ⚙️ |
| `@dfinity/utils`         | v2.10.1 | Patched ⚙️    |
| `@dfinity/zod-schemas`   | v0.0.2  | Unchanged️     |

### Features

- Make methods of `AgentManager` usable after deconstruction.
- Implement pagination for the `list_neurons` endpoint.
- Update all Candid files to their latest versions.

### Build

- Bump `esbuild` to `v0.25.0`.

### Chore

- Add the `zod-schemas` library to the list of `next` versions.

### Docs

- Review JSDoc types for `Icrc2ApproveRequest`.

## 2025.01.30-0730Z

### Overview

| Library                  | Version | Status              |
| ------------------------ | ------- | ------------------- |
| `@dfinity/ckbtc`         | v3.1.7  | Maintained ⚙️       |
| `@dfinity/cketh`         | v3.4.4  | Maintained ⚙️       |
| `@dfinity/cmc`           | v5.0.0  | Breaking Changes ⚠️ |
| `@dfinity/ic-management` | v6.0.4  | Maintained ⚙️       |
| `@dfinity/ledger-icp`    | v2.6.8  | Maintained ⚙️       |
| `@dfinity/ledger-icrc`   | v2.7.3  | Maintained ⚙️       |
| `@dfinity/nns`           | v8.2.2  | Maintained ⚙️       |
| `@dfinity/nns-proto`     | v2.0.2  | Maintained ⚙️       |
| `@dfinity/sns`           | v3.2.9  | Maintained ⚙️       |
| `@dfinity/utils`         | v2.10.0 | Enhanced 🔧️         |
| `@dfinity/zod-schemas`   | v0.0.2  | Unchanged️           |

### Breaking Changes

- Default `getIcpToCyclesConversionRate` to an update call while providing a `certified` parameter for queries.

### Features

- Support `NervousSystemParameters.automatically_advance_target_version` in `@dfinity/sns`.
- Add converters to encode or decode base64 string into Uint8Array.
- Support `neuron_subaccounts` in `list_neurons` from `@dfinity/nns`.

## 2025.01.20-1800Z

### Overview

The current status of the libraries at the time of the release is as follows:

| Library                  | Version | Status        |
| ------------------------ | ------- | ------------- |
| `@dfinity/ckbtc`         | v3.1.6  | Maintained ⚙️ |
| `@dfinity/cketh`         | v3.4.3  | Maintained ⚙️ |
| `@dfinity/cmc`           | v4.1.1  | Maintained ⚙️ |
| `@dfinity/ic-management` | v6.0.3  | Maintained ⚙️ |
| `@dfinity/ledger-icp`    | v2.6.7  | Maintained ⚙️ |
| `@dfinity/ledger-icrc`   | v2.7.2  | Maintained ⚙️ |
| `@dfinity/nns`           | v8.2.1  | Maintained ⚙️ |
| `@dfinity/nns-proto`     | v2.0.1  | Unchanged️     |
| `@dfinity/sns`           | v3.2.8  | Maintained ⚙️ |
| `@dfinity/utils`         | v2.9.0  | Enhanced 🔧️   |
| `@dfinity/zod-schemas`   | v0.0.2  | Maintained ⚙️ |

## Features

- Support `CanisterSettings.wasm_memory_threshold` in `@dfinity/nns`.
- Support `UpgradeSnsControlledCanister.chunked_canister_wasm` in `@dfinity/sns`.
- Add utility `fromNullishNullable` extracts the value from a nullish Candid-style variant representation.

## 2025.01.20-1030Z

### Overview

The current status of the libraries at the time of the release is as follows:

| Library                  | Version | Status        |
| ------------------------ | ------- | ------------- |
| `@dfinity/ckbtc`         | v3.1.5  | Unchanged️     |
| `@dfinity/cketh`         | v3.4.2  | Unchanged️     |
| `@dfinity/cmc`           | v4.1.0  | Unchanged️     |
| `@dfinity/ic-management` | v6.0.2  | Unchanged️     |
| `@dfinity/ledger-icp`    | v2.6.6  | Maintained ⚙️ |
| `@dfinity/ledger-icrc`   | v2.7.1  | Maintained ⚙️ |
| `@dfinity/nns`           | v8.2.0  | Enhanced 🔧️   |
| `@dfinity/nns-proto`     | v2.0.1  | Unchanged️     |
| `@dfinity/sns`           | v3.2.7  | Maintained ⚙️ |
| `@dfinity/utils`         | v2.8.0  | Unchanged️     |
| `@dfinity/zod-schemas`   | v0.0.1  | New 🚀        |

### Features

- Expose types `IcrcApproveError` and `IcrcTransferFromError` in `@dfinity/ledger-icrc`.
- Expose few additional did types in `@dfinity/ledger-icp`.
- Introduce a new zod-schemas library to provide a collection of reusable Zod schemas and validators for common data patterns in ICP applications.
- Api get network economics parameters.
- Update `old_list_neurons_service.certified.idl.js`.

### Fix

- Typo in renamed exposed type `IcrcTransferVariatError`.

## 2024.12.23-1215Z

### Overview

The current status of the libraries at the time of the release is as follows:

| Library                  | Version | Status        |
| ------------------------ | ------- | ------------- |
| `@dfinity/ckbtc`         | v3.1.5  | Maintained ⚙️ |
| `@dfinity/cketh`         | v3.4.2  | Maintained ⚙️ |
| `@dfinity/cmc`           | v4.1.0  | Enhanced 🔧️   |
| `@dfinity/ic-management` | v6.0.2  | Maintained ⚙️ |
| `@dfinity/ledger-icp`    | v2.6.5  | Maintained ⚙️ |
| `@dfinity/ledger-icrc`   | v2.7.0  | Enhanced 🔧️   |
| `@dfinity/nns`           | v8.1.0  | Enhanced 🔧️   |
| `@dfinity/nns-proto`     | v2.0.1  | Unchanged️     |
| `@dfinity/sns`           | v3.2.6  | Maintained ⚙️ |
| `@dfinity/utils`         | v2.8.0  | Enhanced 🔧️   |

### Features

- Support `RefreshVotingPower` in `@dfinity/nns`.
- Remove optional field `last_deposit_with_subaccount_scraped_block_number` from ckETH minter information.
- Add optional field `deposit_with_subaccount_helper_contract_address` and `last_deposit_with_subaccount_scraped_block_number` in ckETH minter information.
- Expose a few additional types related to snapshots in `ic-management`.
- Add support for `get_subnet_types_to_subnets` to `@dfinity/cmc`.
- Support `VotingPowerEconomics`, `potential_voting_power` and `deciding_voting_power` in `@dfinity/nns`.
- Add utility `isEmptyString` (the opposite of existing `notEmptyString`).
- Add utility `mapTokenMetadata` in `@dfinity/ledger-icrc` to map the token metadata information from a ledger response into a structured record.

## 2024.11.27-1230Z

### Overview

The current status of the libraries at the time of the release is as follows:

| Library                  | Version | Status        |
| ------------------------ | ------- | ------------- |
| `@dfinity/ckbtc`         | v3.1.4  | Maintained ⚙️ |
| `@dfinity/cketh`         | v3.4.1  | Maintained ⚙️ |
| `@dfinity/cmc`           | v4.0.2  | Maintained ⚙️ |
| `@dfinity/ic-management` | v6.0.1  | Patched 🩹    |
| `@dfinity/ledger-icp`    | v2.6.4  | Maintained ⚙️ |
| `@dfinity/ledger-icrc`   | v2.6.4  | Unchanged️     |
| `@dfinity/nns`           | v8.0.1  | Maintained ⚙️ |
| `@dfinity/nns-proto`     | v2.0.1  | Unchanged️     |
| `@dfinity/sns`           | v3.2.5  | Maintained ⚙️ |
| `@dfinity/utils`         | v2.7.1  | Maintained ⚙️ |

### Features

- Added definition for `AdvanceSnsTargetVersion` to the SNS governance DID `Action` declarations.

### Fix

- The IC management function `install_chunked_code` failed on mainnet because the `target_canister` was not mapped as `effective_canister_id`, as defined by the IC specification.

### Chore

- Enable eslint for tests.
- Allow linter to permit underscore prefixes.

## 2024.11.22-1600Z

### Overview

The current status of the libraries at the time of the release is as follows:

| Library                  | Version | Status              |
| ------------------------ | ------- | ------------------- |
| `@dfinity/ckbtc`         | v3.1.3  | Unchanged️           |
| `@dfinity/cketh`         | v3.4.0  | Unchanged️           |
| `@dfinity/cmc`           | v4.0.1  | Unchanged️           |
| `@dfinity/ic-management` | v6.0.0  | Breaking Changes ⚠️ |
| `@dfinity/ledger-icp`    | v2.6.3  | Unchanged️           |
| `@dfinity/ledger-icrc`   | v2.6.3  | Unchanged️           |
| `@dfinity/nns`           | v8.0.0  | Unchanged️           |
| `@dfinity/nns-proto`     | v2.0.1  | Unchanged️           |
| `@dfinity/sns`           | v3.2.4  | Unchanged️           |
| `@dfinity/utils`         | v2.7.0  | Unchanged️           |

## Breaking changes

- Inherits canister installation code arguments from Candid.

## 2024.11.21-1600Z

### Overview

The current status of the libraries at the time of the release is as follows:

| Library                  | Version | Status              |
| ------------------------ | ------- | ------------------- |
| `@dfinity/ckbtc`         | v3.1.3  | Maintained ⚙️       |
| `@dfinity/cketh`         | v3.4.0  | Enhanced 🔧️         |
| `@dfinity/cmc`           | v4.0.1  | Maintained ⚙️       |
| `@dfinity/ic-management` | v5.3.0  | Enhanced 🔧️         |
| `@dfinity/ledger-icp`    | v2.6.3  | Maintained ⚙️       |
| `@dfinity/ledger-icrc`   | v2.6.3  | Maintained ⚙️       |
| `@dfinity/nns`           | v8.0.0  | Breaking Changes ⚠️ |
| `@dfinity/nns-proto`     | v2.0.1  | Unchanged️           |
| `@dfinity/sns`           | v3.2.4  | Maintained ⚙️       |
| `@dfinity/utils`         | v2.7.0  | Enhanced 🔧️         |

## Breaking changes

- Remove `stakeNeuronIcrc1`.

### Features

- Added `memoToNeuronSubaccount` and `memoToNeuronAccountIdentifier`.
- Support new neuron field `voting_power_refreshed_timestamp_seconds`.
- Add support for fetching the canister logs in `@dfinity@ic-management`.
- Add support for snapshot features in `@dfinity@ic-management`.
- Add `nowInBigIntNanoSeconds` to `@dfinity/utils`, a trivial function that is actually used across all our dapps.

### Build

- Update the dev dependencies of the `ic-js` workspace.

## 2024.10.29-1130Z

### Overview

The current status of the libraries at the time of the release is as follows:

| Library                  | Version | Status              |
| ------------------------ | ------- | ------------------- |
| `@dfinity/ckbtc`         | v3.1.2  | Maintained ⚙️       |
| `@dfinity/cketh`         | v3.3.3  | Maintained ⚙️       |
| `@dfinity/cmc`           | v4.0.0  | Breaking Changes ⚠️ |
| `@dfinity/ic-management` | v5.2.3  | Maintained ⚙️       |
| `@dfinity/ledger-icp`    | v2.6.2  | Maintained ⚙️       |
| `@dfinity/ledger-icrc`   | v2.6.2  | Maintained ⚙️       |
| `@dfinity/nns`           | v7.0.2  | Maintained ⚙️       |
| `@dfinity/nns-proto`     | v2.0.1  | Unchanged️           |
| `@dfinity/sns`           | v3.2.3  | Maintained ⚙️       |
| `@dfinity/utils`         | v2.6.0  | Enhanced 🔧️         |

### Breaking Changes

- For consistency, the `CMCCanister.create` function now requires the `canisterId` option to be provided exclusively as
  a `Principal`.

### Features

- Add support for `get_default_subnets` to `@dfinity/cmc`.
- Add class `AgentManager` in `@dfinity/utils` which caches `HttpAgent` instances for different identities.

### Docs

- Rename DFINITY LLC to DFINITY Stiftung in licences.

## 2024.10.09-1140Z

### Overview

The current status of the libraries at the time of the release is as follows:

| Library                  | Version | Status        |
| ------------------------ | ------- | ------------- |
| `@dfinity/ckbtc`         | v3.1.1  | Maintained ⚙️ |
| `@dfinity/cketh`         | v3.3.2  | Maintained ⚙️ |
| `@dfinity/cmc`           | v3.2.2  | Maintained ⚙️ |
| `@dfinity/ic-management` | v5.2.2  | Maintained ⚙️ |
| `@dfinity/ledger-icp`    | v2.6.1  | Maintained ⚙️ |
| `@dfinity/ledger-icrc`   | v2.6.1  | Maintained ⚙️ |
| `@dfinity/nns`           | v7.0.1  | Maintained ⚙️ |
| `@dfinity/nns-proto`     | v2.0.1  | Unchanged️     |
| `@dfinity/sns`           | v3.2.2  | Maintained ⚙️ |
| `@dfinity/utils`         | v2.5.2  | Maintained ⚙️ |

### Build

- Downgrade Agent-js to `^2.0.0` to let consumers pick the compatible version they wish to use.

## 2024.09.30-1100Z

### Overview

The current status of the libraries at the time of the release is as follows:

| Library                  | Version | Status              |
| ------------------------ | ------- | ------------------- |
| `@dfinity/ckbtc`         | v3.1.0  | Enhanced 🔧️         |
| `@dfinity/cketh`         | v3.3.1  | Maintained ⚙️       |
| `@dfinity/cmc`           | v3.2.1  | Maintained ⚙️       |
| `@dfinity/ic-management` | v5.2.1  | Maintained ⚙️       |
| `@dfinity/ledger-icp`    | v2.6.0  | Enhanced 🔧️         |
| `@dfinity/ledger-icrc`   | v2.6.0  | Enhanced 🔧️         |
| `@dfinity/nns`           | v7.0.0  | Breaking Changes ⚠️ |
| `@dfinity/nns-proto`     | v2.0.1  | Unchanged️           |
| `@dfinity/sns`           | v3.2.1  | Maintained ⚙️       |
| `@dfinity/utils`         | v2.5.1  | Maintained ⚙️       |

### Breaking changes

- Removed deprecated `OpenSnsTokenSwap`, `SetSnsTokenSwapOpenTimeWindow`, and `SetDefaultFollowees` from
  `ProposalActionRequest`.

### Features

- Add support for `icrc21_canister_call_consent_message` to `@dfinity/ledger-icp` and `@dfinity/ledger-icrc`.
- Add support for `"regtest"` in `BitcoinNetwork`.
- Expose `ledger-converters` utility modules in `@dfinity/ledger-icp` and `@dfinity/ledger-icrc`.

### Build

- Incorporate Agent-js patch `v2.1.2`.

## 2024.09.02-0830Z

### Overview

The current status of the libraries at the time of the release is as follows:

| Library                  | Version | Status              |
| ------------------------ | ------- | ------------------- |
| `@dfinity/ckbtc`         | v3.0.0  | Breaking Changes ⚠️ |
| `@dfinity/cketh`         | v3.3.0  | Maintained ⚙️       |
| `@dfinity/cmc`           | v3.2.0  | Maintained ⚙️       |
| `@dfinity/ic-management` | v5.2.0  | Maintained ⚙️       |
| `@dfinity/ledger-icp`    | v2.5.0  | Maintained ⚙️       |
| `@dfinity/ledger-icrc`   | v2.5.0  | Maintained ⚙️       |
| `@dfinity/nns`           | v6.0.0  | Breaking Changes ⚠️ |
| `@dfinity/nns-proto`     | v2.0.1  | Maintained ⚙️️       |
| `@dfinity/sns`           | v3.2.0  | Maintained ⚙️       |
| `@dfinity/utils`         | v2.5.0  | Maintained ⚙️       |

### Breaking changes

- Rename values of enum Topic and NnsFunction to match the backend values.
- Use different request/response types for NNS Governance proposals, and different fields for `InstallCode` proposals.
- The `getUtxos` parameter `filter.min_confirmations` has been renamed to `filter.minConfirmations` for consistency with
  the general naming conventions used in `@dfinity/ckbtc`.
- Only queries to `getUtxos` of the Bitcoin canister can be executed by external users — i.e., update calls can only be
  performed by the canister. This is why `getUtxos` now only supports non-certified calls and has been renamed to
  `getUtxosQuery`.

### Features

- Provide a new utility to convert Candid `Nat` to `BigInt`. This utility is useful for interpreting the fees provided
  by the SNS Aggregator.
- Support conversion of `InstallCode`, `StopOrStartCanister` and `UpdateCanisterSettings` actions, `SetVisibility`
  neuron operation, and `Neuron::visibility` attribute.
- Add function `getBalanceQuery` to `BitcoinCanister` object of package `@dfinity/ckbtc`, that implements the
  `bitcoin_get_balance_query` method of the IC Bitcoin API.

### Build

- Upgrade `agent-js` dependencies to `v2.0.0`.

## 2024.07.22-0645Z

### Overview

The current status of the libraries at the time of the release is as follows:

| Library                  | Version | Status        |
| ------------------------ | ------- | ------------- |
| `@dfinity/ckbtc`         | v2.5.0  | Maintained ⚙️ |
| `@dfinity/cketh`         | v3.2.0  | Enhanced 🔧️   |
| `@dfinity/cmc`           | v3.1.0  | Maintained ⚙️ |
| `@dfinity/ic-management` | v5.1.0  | Enhanced 🔧️   |
| `@dfinity/ledger-icp`    | v2.4.0  | Maintained ⚙️ |
| `@dfinity/ledger-icrc`   | v2.4.0  | Maintained ⚙️ |
| `@dfinity/nns`           | v5.2.0  | Enhanced 🔧️   |
| `@dfinity/nns-proto`     | v2.0.1  | Maintained ⚙️️ |
| `@dfinity/sns`           | v3.1.0  | Maintained ⚙️ |
| `@dfinity/utils`         | v2.4.0  | Maintained ⚙️ |

### Features

- Add support for `wasm_memory_limit` in the canister settings.
- Add optional `includeEmptyNeurons` parameter to `listNeurons`.
- Extend `eip1559TransactionPrice` for Erc20.
- Add "Protocol Canister Management" and "Service Nervous System Management" topics support.
- Add `asNonNullish` function, like `assertNonNullish` but returns the value.

### Fix

- `updateNeuron` to not change the neuron subaccount.
- `list_neurons` to use old `ListNeurons` type for hardware wallet compatibility.

### Build

- Upgrade `agent-js` dependencies to `v1.4.0`.

## 2024.06.11-1630Z

### Overview

The current status of the libraries at the time of the release is as follows:

| Library                  | Version | Status        |
| ------------------------ | ------- | ------------- |
| `@dfinity/ckbtc`         | v2.4.1  | Maintained ⚙️ |
| `@dfinity/cketh`         | v3.1.1  | Maintained ⚙️ |
| `@dfinity/cmc`           | v3.0.7  | Maintained ⚙️ |
| `@dfinity/ic-management` | v5.0.1  | Maintained ⚙️ |
| `@dfinity/ledger-icp`    | v2.3.1  | Maintained ⚙️ |
| `@dfinity/ledger-icrc`   | v2.3.3  | Maintained ⚙️ |
| `@dfinity/nns`           | v5.1.2  | Maintained ⚙️ |
| `@dfinity/nns-proto`     | v2.0.1  | Maintained ⚙️️ |
| `@dfinity/sns`           | v3.0.6  | Maintained ⚙️ |
| `@dfinity/utils`         | v2.3.1  | Maintained ⚙️ |

### Features

- Update ckETH Candid definition.

### Build

- Bump braces.

## 2024.06.05-0835Z

### Overview

The current status of the libraries at the time of the release is as follows:

| Library                  | Version | Status              |
| ------------------------ | ------- | ------------------- |
| `@dfinity/ckbtc`         | v2.4.0  | Enhanced 🔧         |
| `@dfinity/cketh`         | v3.1.0  | Enhanced 🔧         |
| `@dfinity/cmc`           | v3.0.6  | Maintained ⚙️       |
| `@dfinity/ic-management` | v5.0.0  | Breaking Changes ⚠️ |
| `@dfinity/ledger-icp`    | v2.3.0  | Enhanced 🔧         |
| `@dfinity/ledger-icrc`   | v2.3.2  | Maintained ⚙️       |
| `@dfinity/nns`           | v5.1.1  | Maintained ⚙️       |
| `@dfinity/nns-proto`     | v2.0.0  | Unchanged️           |
| `@dfinity/sns`           | v3.0.5  | Maintained ⚙️       |
| `@dfinity/utils`         | v2.3.0  | Enhanced 🔧         |

### Breaking changes

- `bitcoinGetUtxos` and `bitcoinGetUtxosQuery` have been removed from the `@dfinity/ic-management` library. Instead, use
  `getUtxos` from the new Bitcoin canister exposed in `@dfinity/ckbtc` to access similar data.

### Features

- Support for `getUtxos` endpoint in the new Bitcoin canister from `@dfinity/ckbtc`.
- Canister status response extended with query statistics.
- Add `metadata` function to ledger ICP.
- Add optional parameters to ICP ledger `transactionFee`.
- Add support for `icrc2_approve` on the ICP ledger canister in `@dfinity/ledger-icp`.

## 2024.05.14-0630Z

### Overview

The current status of the libraries at the time of the release is as follows:

| Library                  | Version | Status              |
| ------------------------ | ------- | ------------------- |
| `@dfinity/ckbtc`         | v2.3.3  | Maintained ⚙️       |
| `@dfinity/cketh`         | v3.0.1  | Maintained ⚙️       |
| `@dfinity/cmc`           | v3.0.5  | Maintained ⚙️       |
| `@dfinity/ic-management` | v4.0.0  | Breaking Changes ⚠️ |
| `@dfinity/ledger-icp`    | v2.2.4  | Maintained ⚙️       |
| `@dfinity/ledger-icrc`   | v2.3.1  | Maintained ⚙️       |
| `@dfinity/nns`           | v5.1.0  | Enhanced 🔧         |
| `@dfinity/nns-proto`     | v2.0.0  | Breaking Changes ⚠️ |
| `@dfinity/sns`           | v3.0.4  | Maintained ⚙️       |
| `@dfinity/utils`         | v2.3.0  | Enhanced 🔧         |

### Breaking changes

- `@dfinity/ic-management` function `canisterInfo` removed because users cannot call this method (
  see [documentation](https://internetcomputer.org/docs/current/references/ic-interface-spec#ic-canister-info)).
- `@dfinity/nns-proto` was updated with the most recent proto types, some of which were not backwards compatible.
- The size of the nns-proto-js library has noticeably increased, as it now exposes all types instead of just a manually
  picked subset.

### Features

- Update Candid definition in ckBTC, ckETH, CMC, ICP and ICRC Ledgers, Nns and Sns.
- Add "Subnet Rental" to the list of `NnsFunction` and to topic support.

### Fix

- Fixed `TokenAmountV2.fromNumber` for tokens with fewer than 8 decimals.

### Build

- Upgrade `agent-js` dependencies to `v1.3.0` and revert the default retry times value to 10, given that the issue is
  fixed.

## 2024.04.29-0930Z

### Overview

The current status of the libraries at the time of the release is as follows:

| Library                  | Version | Status              |
| ------------------------ | ------- | ------------------- |
| `@dfinity/ckbtc`         | v2.3.2  | Maintained ⚙️       |
| `@dfinity/cketh`         | v3.0.0  | Breaking Changes ⚠️ |
| `@dfinity/cmc`           | v3.0.4  | Maintained ⚙️       |
| `@dfinity/ic-management` | v3.2.0  | Enhanced 🔧         |
| `@dfinity/ledger-icp`    | v2.2.3  | Maintained ⚙️       |
| `@dfinity/ledger-icrc`   | v2.3.0  | Enhanced 🔧         |
| `@dfinity/nns`           | v5.0.0  | Breaking Changes ⚠️ |
| `@dfinity/nns-proto`     | v1.0.2  | Unchanged️           |
| `@dfinity/sns`           | v3.0.3  | Maintained ⚙️       |
| `@dfinity/utils`         | v2.2.0  | Enhanced 🔧         |

### Breaking changes

- Protocol buffers for hardware wallet transactions are no longer supported. Internet Computer Ledger app 2.4.9 or later
  is now required.
- GovernanceCanister.listNeurons no longer throws an error when called with `certified: false` for hardware wallet
  transactions.
- Potential errors thrown by `withdrawEth` provide now unparsed details.

### Features

- ICP transactions, as provided by the Index canister, have been extended to include their block timestamp information.
- When no fee is specified when making an ICP transaction, use the mandatory fee of 10000 e8s (0.0001 ICP) instead of
  fetching the fee from the network.
- Remove hardware wallet specific code paths from `@dfinity/ledger-icp`.
- Remove hardware wallet specific options from LedgerCanister.
- Remove dependency on `@dfinity/nns-proto` from `@dfinity/ledger-icp`.
- Remove hardware wallet specific code and `@dfinity/nns-proto` dependency from `@dfinity/nns`.
- Add support for `withdrawErc20`.
- Additional fields related to ERC20 have been added to ckETH `minterInfo`.
- Expose the function `ledger_id` for Index canister in the `ledger-icrc` library.
- Set number of retries to 10 (as opposed to default 3) in `createAgent` utility to make the agent more resilient
  against watermark check failures.

### Build

- Upgrade `agent-js` dependencies to `v1.2.1`. Note that it is advised to set the number of retries of the agent to 10
  to prevent the potential issue
  `Timestamp failed to pass the watermark after retrying the configured 3 times. We cannot guarantee the integrity of the response since it could be a replay attack.` (
  see thread on
  the [forum](https://forum.dfinity.org/t/timestamp-failed-to-pass-the-watermark-after-retrying-the-configured-3-times/29180/3?u=peterparker)).
- Upgrade `didc` to `0.3.7` that converts candid files into JS and TS.

## 2024.03.25-1430Z

### Overview

The current status of the libraries at the time of the release is as follows:

| Library                  | Version | Status     |
| ------------------------ | ------- | ---------- |
| `@dfinity/ckbtc`         | v2.3.1  | Unchanged️️  |
| `@dfinity/cketh`         | v2.0.1  | Unchanged️  |
| `@dfinity/cmc`           | v3.0.3  | Unchanged️  |
| `@dfinity/ic-management` | v3.1.1  | Patched 🩹 |
| `@dfinity/ledger-icp`    | v2.2.2  | Unchanged️️  |
| `@dfinity/ledger-icrc`   | v2.2.1  | Unchanged️️  |
| `@dfinity/nns`           | v4.0.2  | Unchanged️  |
| `@dfinity/nns-proto`     | v1.0.2  | Unchanged️  |
| `@dfinity/sns`           | v3.0.2  | Unchanged️️  |
| `@dfinity/utils`         | v2.1.3  | Unchanged️  |

### Fix

- Incorrect import path to utils in ic-management: `@dfinity/utils/src`.

## 2024.03.25-1345Z

### Overview

The current status of the libraries at the time of the release is as follows:

| Library                  | Version | Status        |
| ------------------------ | ------- | ------------- |
| `@dfinity/ckbtc`         | v2.3.1  | Maintained ⚙️ |
| `@dfinity/cketh`         | v2.0.1  | Maintained ⚙️ |
| `@dfinity/cmc`           | v3.0.3  | Maintained ⚙️ |
| `@dfinity/ic-management` | v3.1.0  | Enhanced 🔧   |
| `@dfinity/ledger-icp`    | v2.2.2  | Maintained ⚙️ |
| `@dfinity/ledger-icrc`   | v2.2.0  | Maintained ⚙️ |
| `@dfinity/nns`           | v4.0.2  | Maintained ⚙️ |
| `@dfinity/nns-proto`     | v1.0.2  | Maintained ⚙️ |
| `@dfinity/sns`           | v3.0.2  | Maintained ⚙️ |
| `@dfinity/utils`         | v2.1.3  | Maintained ⚙️ |

### Features

- Support for the installation of large canisters with chunked code of the Wasm module in `@dfinity/ic-management`.
- Update most recent did files for ledgers (new optional field for initialization) and ckETH (new optional field in
  event).
- Expose Utxo types in `@dfinity/ckbtc`.

### Build

- Bump dev dependencies including esbuild and TypeScript.

### Documentation

- Bump `tsdoc-markdown` to parse optional result into READMEs.

## 2024.03.05-1100Z

### Overview

The current status of the libraries at the time of the release is as follows:

| Library                  | Version | Status              |
| ------------------------ | ------- | ------------------- |
| `@dfinity/ckbtc`         | v2.3.0  | Enhanced 🔧️         |
| `@dfinity/cketh`         | v2.0.0  | Breaking Changes ⚠️ |
| `@dfinity/cmc`           | v3.0.2  | Unchanged️           |
| `@dfinity/ic-management` | v3.0.0  | Breaking Changes ⚠️ |
| `@dfinity/ledger-icp`    | v2.2.1  | Unchanged️           |
| `@dfinity/ledger-icrc`   | v2.1.3  | Enhanced 🔧         |
| `@dfinity/nns`           | v4.0.1  | Unchanged️           |
| `@dfinity/nns-proto`     | v1.0.1  | Unchanged️           |
| `@dfinity/sns`           | v3.0.1  | Maintained ⚙        |
| `@dfinity/utils`         | v2.1.2  | Unchanged️           |

### Breaking Changes

- Fix typo in `ic-management` interfaces (`senderCanisterVerion` -> `senderCanisterVersion`).
- ckETH `eip1559TransactionPrice` expect a parameters which can optionally be set to execute a query (new) or update
  call.

### Features

- Support for new ckETH endpoint `get_minter_info` which returns internal minter parameters such as the minimal
  withdrawal amount, the last observed block number, etc.
- Add support for `bitcoin_get_utxos` and `bitcoin_get_utxos_query` features to `@dfinity/ic-management` library.
- Support for new ckBTC endpoint `get_known_utxos` which returns UTXOs of the given account known by the minter.
- New `IndexNgCanister` in `@dfinity/ledger-icrc`, which can be used to interact with the newer version of the ICRC
  Index canister, notably exposing `getTransactions` as a `query` function.

## 2024.02.21-0835Z

### Overview

The current status of the libraries at the time of the release is as follows:

| Library                  | Version | Status              |
| ------------------------ | ------- | ------------------- |
| `@dfinity/ckbtc`         | v2.2.1  | Maintained ⚙️       |
| `@dfinity/cketh`         | v1.0.2  | Maintained ⚙️       |
| `@dfinity/cmc`           | v3.0.2  | Maintained ⚙️       |
| `@dfinity/ic-management` | v2.2.2  | Maintained ⚙️       |
| `@dfinity/ledger-icp`    | v2.2.1  | Maintained ⚙️       |
| `@dfinity/ledger-icrc`   | v2.1.3  | Maintained ⚙️       |
| `@dfinity/nns`           | v4.0.1  | Maintained ⚙️       |
| `@dfinity/nns-proto`     | v1.0.1  | Unchanged️           |
| `@dfinity/sns`           | v3.0.0  | Breaking Changes ⚠️ |
| `@dfinity/utils`         | v2.1.2  | Maintained ⚙️       |

### Breaking changes

- Update `listProposals` return type in sns governance canister.

### Build

- Bump agent-js `v1.0.1` to hook on their semantic versioning, adopt last improvements and rollout
  a [security patch](https://github.com/dfinity/agent-js/security/advisories/GHSA-c9vv-fhgv-cjc3)

## 2024.02.14-1600Z

### Overview

The current status of the libraries at the time of the release is as follows:

| Library                  | Version | Status              |
| ------------------------ | ------- | ------------------- |
| `@dfinity/ckbtc`         | v2.2.0  | Enhanced 🔧         |
| `@dfinity/cketh`         | v1.0.1  | Maintained ⚙️       |
| `@dfinity/cmc`           | v3.0.1  | Maintained ⚙️       |
| `@dfinity/ic-management` | v2.2.1  | Maintained ⚙️       |
| `@dfinity/ledger-icp`    | v2.2.0  | Enhanced 🔧         |
| `@dfinity/ledger-icrc`   | v2.1.2  | Maintained ⚙️       |
| `@dfinity/nns`           | v4.0.0  | Breaking Changes ⚠️ |
| `@dfinity/nns-proto`     | v1.0.1  | Unchanged️           |
| `@dfinity/sns`           | v2.1.2  | Maintained ⚙️       |
| `@dfinity/utils`         | v2.1.1  | Maintained ⚙️       |

### Breaking changes

- Replace duplicate string type `AccountIdentifier` in `@dfinity/nns` with `AccountIdentifierHex` of
  `@dfinity/ledger-icp`.

### Features

- Extend ckBTC `retrieveBtcStatusV2ByAccount` with optional `account` parameter.
- Remove unused Uint8Array type `SubAccount` in `@dfinity/nns`.
- Modify the `@dfinity/ledger-icp` package's `SubAccount.formID` function to support more than 256 subaccounts, enabling
  it to handle larger numbers.

### Build

- Bump all dev dependencies of the ic-js workspace.

## 2024.01.30-1600Z

### Overview

The current status of the libraries at the time of the release is as follows:

| Library                  | Version | Status              |
| ------------------------ | ------- | ------------------- |
| `@dfinity/ckbtc`         | v2.1.1  | Patched 🩹          |
| `@dfinity/cketh`         | v1.0.0  | Launched 🚀         |
| `@dfinity/cmc`           | v3.0.0  | Breaking Changes ⚠️ |
| `@dfinity/ic-management` | v2.2.0  | Enhanced 🔧         |
| `@dfinity/ledger-icp`    | v2.1.2  | Patched 🩹          |
| `@dfinity/ledger-icrc`   | v2.1.1  | Maintained ⚙️       |
| `@dfinity/nns`           | v3.1.1  | Maintained ⚙️       |
| `@dfinity/nns-proto`     | v1.0.1  | Maintained ⚙️       |
| `@dfinity/sns`           | v2.1.1  | Patched 🩹          |
| `@dfinity/utils`         | v2.1.0  | Enhanced 🔧         |

### Breaking changes

- Upgrade candid files for cmc canister with new fields `subnet_selection` and `settings`.

### Features

- Add support for converting ckETH to ETH through the `withdrawEth` function and integrate useful features such as
  `eip1559TransactionPrice`, `encodePrincipalToEthAddress`, and `retrieve_eth_status`.
- Upgrade candid files for `ic-management` canister and support new field `reserved_cycles_limit`.
- Add "API Boundary Node Management" topic support.
- Add optional field `logo` to `Token` type.
- Update `sns-js` candid files with new fields in sns canisters.
- Add public method `toE8s` to `TokenAmountV2`.

### Fix

- Various certified Candid IDL functions had their names trimmed of the keyword "query".

### Build

- Fixed script to generate certified IDL factory files to respect the keyword "query" when used in functions' names.

## 2024.01.09-1115Z

### Overview

The current status of the libraries at the time of the release is as follows:

| Library                  | Version | Status     |
| ------------------------ | ------- | ---------- |
| `@dfinity/ckbtc`         | v2.1.0  | Unchanged  |
| `@dfinity/cketh`         | v0.0.1  | Unchanged  |
| `@dfinity/cmc`           | v2.1.0  | Unchanged  |
| `@dfinity/ic-management` | v2.1.0  | Unchanged  |
| `@dfinity/ledger-icp`    | v2.1.1  | Patched 🤕 |
| `@dfinity/ledger-icrc`   | v2.1.0  | Unchanged  |
| `@dfinity/nns`           | v3.1.0  | Unchanged  |
| `@dfinity/nns-proto`     | v1.0.0  | Unchanged  |
| `@dfinity/sns`           | v2.1.0  | Unchanged  |
| `@dfinity/utils`         | v2.0.0  | Unchanged️  |

### Fix

- When `@dfinity/ledger-icp` is bundled with Rollup v4, it leads to an incompatibility issue with iOS 15.

## 2024.01.03-1115Z

### Overview

The current status of the libraries at the time of the release is as follows:

| Library                  | Version | Status    |
| ------------------------ | ------- | --------- |
| `@dfinity/ckbtc`         | v2.1.0  | Unchanged |
| `@dfinity/cketh`         | v0.0.1  | New 🚀    |
| `@dfinity/cmc`           | v2.1.0  | Unchanged |
| `@dfinity/ic-management` | v2.1.0  | Unchanged |
| `@dfinity/ledger-icp`    | v2.1.0  | Unchanged |
| `@dfinity/ledger-icrc`   | v2.1.0  | Unchanged |
| `@dfinity/nns`           | v3.1.0  | Unchanged |
| `@dfinity/nns-proto`     | v1.0.0  | Unchanged |
| `@dfinity/sns`           | v2.1.0  | Unchanged |
| `@dfinity/utils`         | v2.0.0  | Unchanged️ |

### Features

- Introduces an early first version of `@dfinity/cketh`, which is meant to provide functions for interfacing with ckETH.
  The library doesn't do much at the moment, but we're releasing it to integrate it into our pipelines, and features
  will be added iteratively as required.

## 2023.12.20-1000Z

### Overview

The current status of the libraries at the time of the release is as follows:

| Library                  | Version | Status              |
| ------------------------ | ------- | ------------------- |
| `@dfinity/ckbtc`         | v2.1.0  | Enhanced 🔧         |
| `@dfinity/cmc`           | v2.1.0  | Enhanced 🔧         |
| `@dfinity/ic-management` | v2.1.0  | Enhanced 🔧         |
| `@dfinity/ledger-icp`    | v2.1.0  | Enhanced 🔧         |
| `@dfinity/ledger-icrc`   | v2.1.0  | Enhanced 🔧         |
| `@dfinity/nns`           | v3.1.0  | Enhanced 🔧         |
| `@dfinity/nns-proto`     | v1.0.0  | Unchanged           |
| `@dfinity/sns`           | v2.1.0  | Enhanced 🔧         |
| `@dfinity/utils`         | v2.0.0  | Breaking Changes ⚠️ |

### Breaking changes

- `decimals` mandatory field in `Token`.
- `TokenAmount` rejects tokens with `decimals !== 8`.

### Features

- Substitute `?` fields with `Option` fields in the converters related to NNS proposals.
- Add retrieveBtcStatus to ckbtc minter canister.
- Add retrieveBtcStatusV2ByAccount to ckbtc minter canister.
- Make uint8ArrayToHexString also accept `number[]` as input.
- Add a new type TokenAmountV2 which supports `decimals !== 8`.
- Fix issue when converting token amount from small numbers with `TokenAmountV2`.
- Bump agent-js to v0.20.2 in a non-breaking manner by introducing `verifyQuerySignatures` as an opt-in feature (for the
  time being).
- Replace `https://ic0.app` by `https://icp-api.io` as the default host for the default anonymous agent provided by
  `defaultAgent`.

### Fix

- Utilize ICP Index `accountBalance` and `getTransactions` with account identifier hex directly, eliminating the need
  for conversion with Buffer and resolving usage in non-polyfilled environments.

### Operations

- Add a cron job to periodically update IC candid files and typescript bindings.

## 2023.11.21-1400Z

### Overview

The current status of the libraries at the time of the release is as follows:

| Library                  | Version | Status      |
| ------------------------ | ------- | ----------- |
| `@dfinity/ckbtc`         | v2.0.0  | Enhanced 🔧 |
| `@dfinity/cmc`           | v2.0.0  | Enhanced 🔧 |
| `@dfinity/ic-management` | v2.0.0  | Enhanced 🔧 |
| `@dfinity/ledger-icp`    | v2.0.0  | Enhanced 🔧 |
| `@dfinity/ledger-icrc`   | v2.0.0  | Enhanced 🔧 |
| `@dfinity/nns`           | v3.0.0  | Enhanced 🔧 |
| `@dfinity/nns-proto`     | v1.0.0  | Unchanged   |
| `@dfinity/sns`           | v2.0.0  | Enhanced 🔧 |
| `@dfinity/utils`         | v1.1.0  | Unchanged   |

### Features

- Include timestamp and tags in the candid provenance record.
- Update ckbtc candid to ic commit `4de99bc27be74048f80d13200f3c75cf2a43438c`.
- Include pending UTXOs in MinterNoNewUtxosError.
- Upgrade `didc` to `0.3.5` that converts candid files into JS and TS.

## 2023.10.15-0600Z

### Overview

The current status of the libraries at the time of the release is as follows:

| Library                  | Version | Status      |
| ------------------------ | ------- | ----------- |
| `@dfinity/ckbtc`         | v1.1.0  | Enhanced 🔧 |
| `@dfinity/cmc`           | v1.0.0  | Unchanged   |
| `@dfinity/ic-management` | v1.0.0  | Unchanged   |
| `@dfinity/ledger-icp`    | v1.1.0  | Enhanced 🔧 |
| `@dfinity/ledger-icrc`   | v1.0.1  | Patched 🩹  |
| `@dfinity/nns`           | v2.1.0  | Enhanced 🔧 |
| `@dfinity/nns-proto`     | v1.0.0  | Unchanged   |
| `@dfinity/sns`           | v1.0.2  | Patched 🩹  |
| `@dfinity/utils`         | v1.1.0  | Enhanced 🔧 |

### Features

- add support for ICP Index canister to library `@dfinity/ledger-icp`. New `IndexCanister` functions: `accountBalance`
  and `getTransactions`
- expose few types - notably `BlockHeight` - for library `@dfinity/ledger-icp`
- support new fields from swap canister response types: `min_direct_participation_icp_e8s`,
  `max_direct_participation_icp_e8s` and `neurons_fund_participation`
- support new fields in the `CreateServiceNervousSystem` proposal action: `maximum_direct_participation_icp`,
  `minimum_direct_participation_icp` and `neurons_fund_participation`
- support new filter field `omit_large_fields` in `list_proposals`
- add support for `retrieve_btc_with_approval` in `@dfinity/ckbtc`
- new utility to convert seconds to a human-readable duration
- update `@dfinity/ledger-icrc` did files
- update `@dfinity/sns` did files

## 2023.10.02-1515Z

### Overview

The current status of the libraries at the time of the release is as follows:

| Library                  | Version | Status              |
| ------------------------ | ------- | ------------------- |
| `@dfinity/ckbtc`         | v1.0.1  | Patched             |
| `@dfinity/cmc`           | v1.0.0  | Unchanged           |
| `@dfinity/ic-management` | v1.0.0  | Unchanged           |
| `@dfinity/ledger`        | v1.0.0  | Deprecated ❌       |
| `@dfinity/ledger-icp`    | v1.0.0  | New 🚀              |
| `@dfinity/ledger-icrc`   | v1.0.0  | New 🚀              |
| `@dfinity/nns`           | v2.0.0  | Breaking Changes ⚠️ |
| `@dfinity/nns-proto`     | v1.0.0  | Unchanged           |
| `@dfinity/sns`           | v1.0.0  | Patched             |
| `@dfinity/utils`         | v1.0.0  | Unchanged           |

### Release

- ckbtc `v1.0.1`
- ledger-icp `v1.0.0`
- ledger-icrc `v1.0.0`
- nns `v2.0.0`
- sns `v1.0.1`

### Breaking Changes ⚠️

- **ICP** ledger-related features have been relocated from `@dfinity/nns` to a new dedicated library called
  `@dfinity/ledger-icp`
- **ICRC** ledger-related features have been moved as well. The library `@dfinity/ledger` has been deprecated, renamed,
  and replaced by `@dfinity/ledger-icrc`
- remove the `ICP` class, which was deprecated a long time ago, from `@dfinity/nns`. Instead, utilize the token parsers
  from `@dfinity/utils`

### Build

- `@dfinity/sns` inherits the changes and now requires `@dfinity/ledger-icrc` as a peer dependency
- `@dfinity/nns` inherits the changes and now requires `@dfinity/ledger-icp` as a peer dependency

### Chore

- minter params `Subaccount` declared as `Uint8Array` instead of inheriting a type

## 1.0.0 (2023-10-02)

### Release

- nns `v1.0.0`
- sns `v1.0.0`
- cmc `v1.0.0`
- ledger `v1.0.0`
- ckBTC `v1.0.0`
- ic-management `v1.0.0`
- utils `v1.0.0`
- nns-proto `v1.0.0`

### Features

- add support for `icrc2_transfer_from`, `icrc2_approve` and `icrc2_allowance` in `@dfinity/ledger`
- update index did definitions in ledger which provides more information in the transactions
- add support for icrc1_transfer on the ICP ledger canister in `@dfinity/nns`

### Build

- bump did files in Cmc
- starting from this version, we commit to adhering to [semantic versioning](https://semver.org/) for any libraries
  published in ic-js

## 0.18.4 (2023-09-05)

### Release

- nns `v0.16.7`
- sns `v0.0.22`
- cmc `v0.0.18`
- ledger `v0.0.15`
- ckBTC `v0.0.11`
- ic-management `v0.0.8`
- utils `v0.0.22`
- nns-proto `v0.0.8`

### Features

- replaces the `js-sha256` library with `@noble/hashes`

## 0.18.3 (2023-09-04)

### Release

- nns `v0.16.6`
- sns `v0.0.21`
- cmc `v0.0.17`
- ledger `v0.0.14`
- ckBTC `v0.0.10`
- ic-management `v0.0.7`
- utils `v0.0.21`
- nns-proto `v0.0.7`

### Fix

- bump agent-js `v0.19.2` to fix evaluation of subdomain when `host` is not specified

### Build

- remove unused dependencies in `@dfinity/ic-management`

## 0.18.2 (2023-08-24)

### Release

- nns `v0.16.5`
- sns `v0.0.20`
- cmc `v0.0.16`
- ledger `v0.0.13`
- ckBTC `v0.0.9`
- ic-management `v0.0.6`
- utils `v0.0.20`
- nns-proto `v0.0.6`

### Features

- Reviver and replacer to interpret `BigInt`, `Principal`, and `Uint8Array` in `JSON.stringify|parse`
- Add Sns disburse maturity function

### Build

- bump agent-js `v0.19.1`

## 0.18.1 (2023-08-07)

### Release

- nns `v0.16.4`
- sns `v0.0.19`
- cmc `v0.0.15`
- ledger `v0.0.12`
- ckBTC `v0.0.8`
- ic-management `v0.0.5`
- utils `v0.0.19`
- nns-proto `v0.0.5`

### Features

- update `nns/governance.did` and `sns_wasm.did` for 1-proposal
- update `ic.did` for `@dfinity/ic-management`
- update `icrc1_ledger.did`

### Build

- bump agent-js `v0.18.1`

### Docs

- add mention that ICRC-22 is currently a draft

## 0.18.0 (2023-07-03)

### Release

- nns `v0.16.3`
- sns `v0.0.18`
- cmc `v0.0.14`
- ledger `v0.0.11`
- ckBTC `v0.0.7`
- ic-management `v0.0.4`
- utils `v0.0.18`
- nns-proto `v0.0.4`

### Breaking Changes

- move `convertStringToE8s` and `TokenAmount` from Nns package to `@dfinity/utils`
- retire `TokenAmount.toProto()`

### Features

- add a new utils function `decodePayment` to the `@dfinity/ledger` library. Useful to decode payment through QR code
  that contains target address and amount
- add provisional create canister with cycles method
- `CreateServiceNervousSystem` <-> `RawCreateServiceNervousSystem` transformations for Nns proposal
- decode payment code (early support and not yet specified. see ICRC-22)

### Build

- bump `semver`

## 0.17.2 (2023-06-21)

### Release

- ic-management `v0.0.3`

### Build

No particular changes. Resolve a version conflicts in npmjs.

## 0.17.1 (2023-06-21)

### Release

- nns `v0.16.2`
- sns `v0.0.17`
- cmc `v0.0.13`
- ledger `v0.0.10`
- ckBTC `v0.0.6`
- ic-management `v0.0.2`
- utils `v0.0.17`
- nns-proto `v0.0.3`

### Fix

- redo `global` polyfill for the browser
- expose more types in new library `ic-management-js`

### Build

- fix `ic-management-js` next dependencies and version

### Docs

- various improvements in READMEs

## 0.17.0 (2023-06-20)

### Release

- nns `v0.16.1`
- sns `v0.0.16`
- cmc `v0.0.12`
- ledger `v0.0.9`
- ckBTC `v0.0.5`
- ic-management `v0.0.1`
- utils `v0.0.16`
- nns-proto `v0.0.2`

### Breaking Changes

- ckBTC `getDepositFee` has been deprecated. Instead, use the new feature `getMinterInfo`

### Features

- introducing `@dfinity/ic-management` — a new library for interfacing with IC management canister
- add `getMinterInfo` for ckBTC which returns internal minter parameters such as the minimal amount to retrieve BTC,
  minimal number of confirmations or KYT fee
- add fee to nns stake neuron method
- expose Sns index canister id in wrapper
- add `simulateMergeNeurons` to Nns governance

### Refactor

- use `isNullish` and `fromNullable` utils in Nns `governance.canister.ts`

### Build

- remove `global` polyfill for the browser and add `worker` conditions to bundle
- improve docs generation in the CI
- update Candid types in Nns

### Docs

- improve Sns README
- generate README docs for BTC utils

## 0.16.0 (2023-05-24)

### Release

- nns `v0.16.0`
- sns `v0.0.15`
- cmc `v0.0.11`
- ledger `v0.0.8`
- ckBTC `v0.0.4`
- utils `v0.0.15`
- nns-proto `v0.0.1`

### Breaking Changes

- the protobuf dependencies of `@dfinity/nns` have been extracted to a new peer dependency called `@dfinity/nns-proto`.
  In the NNS-dapp, we manually chunk the libraries. This change enables the dapp to load the required code of the
  hardware wallet only when necessary.

### Features

- update `sns-js` and `nns-js` candid definitions
- add `BitcoinSetConfig` to enum `NnsFunction`
- expose some more Sns types

### Build

- publish provenance to npm
- do not run size checker on main branch

### Docs

- fix sample in `nns-js` README

## 0.15.1 (2023-04-18)

### Release

- nns `v0.15.1`
- sns `v0.0.14`
- cmc `v0.0.10`
- ledger `v0.0.7`
- ckBTC `v0.0.3`
- utils `v0.0.14`

### Fix

- correct absolute `utils` import in `ledger` library

## 0.15.0 (2023-04-18)

### Release

- nns `v0.15.0`
- sns `v0.0.13`
- cmc `v0.0.9`
- ledger `v0.0.6`
- ckBTC `v0.0.2`
- utils `v0.0.13`

### Features

- new utils moved from NNS-dapp: `isNullish`, `nonNullish`, `notEmptyString` and `debounce`
- added ckBTC `updateBalance`, `getWithdrawalAccount`, `retrieveBtc`, `estimateWithdrawalFee` and `getDepositFee`
  functions
- parse and validate bitcoin address
- review textual encoding for ICRC-1 account as in [dfinity/ICRC-1#98](https://github.com/dfinity/ICRC-1/pull/98)
- add SNS action converters
- get latest reward event NNS Governance
- extend nnsFuncton enum with UpdateElectedReplicaVersions
- add total tokens supply endpoint
- new utils to convert hex to/from uint8array, crc and base32

### Build

- bump agent-js `v0.15.4`
- bump all dev dependencies
- hook size limit plugin to check the size of the libraries with the CI

## 0.14.0 (2023-02-07)

### Release

- nns `v0.14.0`
- sns `v0.0.12`
- cmc `v0.0.8`
- ledger `v0.0.5`
- ckBTC `v0.0.1`
- utils `v0.0.12`

### Breaking changes

- `index` canister moved from `@dfinity/sns` to `@dfinity/ledger`
- related classes and types renamed from `Sns...` to `Icrc...`

### Features

- new `@dfinity/ckbtc` library for interfacing with ckBTC on the Internet Computer
- export a constant for the Icrc1 metadata logo
- move and expose `assertPercentageNumber` to lib `@dfinity/utils`
- register Sns vote

### Build

- fix `utils` as peer dependency for `cmc`
- fix `sns` using `nns` dependencies
- bump all dev dependencies
- bump Nns dependencies
- dependabot patch for json5 v1.0.2

## 0.13.0 (2023-01-28)

### Release

- nns `v0.13.0`
- sns `v0.0.11`
- cmc `v0.0.7`
- ledger `v0.0.4`
- utils `v0.0.11`

### Features

- add fee as param in SNS Stake neuron
- extend `NnsFunction` enum with `InsertSnsWasmUpgradePathEntries`

### Fix

- encode ICRC-1 accounts

## 0.12.1 (2023-01-24)

### Release

- nns `v0.12.1`
- sns `v0.0.10`
- cmc `v0.0.6`
- ledger `v0.0.3`
- utils `v0.0.10`

### Fix

- `utils` was wrongly referenced as a dependency instead of peer-dependency in last release of `cmc`

## 0.12.0 (2023-01-24)

### Release

- nns `v0.12.0`
- sns `v0.0.9`
- cmc `v0.0.5`
- ledger `v0.0.1`
- utils `v0.0.8`

### Breaking Changes

Introducing `@dfinity/ledger` — A library for interfacing with ICRC ledgers on the Internet Computer.

An ICRC-1 ledger is not only used in Sns projects but, in ckBTC too. It can also be integrated in various other scenario
need by developers on the IC.

That's why we are launching this new library and why we refactored Sns ledger related features to create this new
library.

De facto, `@dfinity/ledger` becomes a peer dependency of `@dfinity/sns`.

### Features

- enable merge neurons for HW controlled neurons

## 0.11.0 (2023-01-23)

### Release

- nns `v0.11.0`
- sns `v0.0.8`
- cmc `v0.0.4`
- utils `v0.0.7`

### Features

- new Sns features: increase stake neuron, split neuron, list and get proposals
- add support for the param `to_account` when disbursing Sns neuron
- add `createAt` param for Nns ledger transfers
- more Sns voting permissions

### Build

- bump `agent-js` peer dependencies to `v0.15.1`
- bump Nns (`crc` and `google-protobuf`) dependencies
- bump dev dependencies

## 0.10.0 (2022-12-06)

### Release

- nns `v0.10.0`
- sns `v0.0.7`
- cmc `v0.0.3`
- utils `v0.0.6`

### Features

- various neuron features for Sns - e.g. stake neuron, list and set followees, set dissolve delay, stake maturity etc.
- array utilities `bigIntToUint8Array` and `numberToUint8Array`
- semantic version comparator `smallerVersion`

### Fix

- rounding conversion from `number` to `Token`

## 0.9.0 (2022-10-31)

### Release

- nns `v0.9.0`
- sns `v0.0.6`
- cmc `v0.0.2`
- utils `v0.0.5`

### Breaking changes

- `token` param in `TokenAmount` factory methods is mandatory instead of using ICPToken as default.
- `TokenAmount.fromNumber` does not return `FromStringToTokenError`, only `TokenAmount`.

### Features

- new NNS governance features: `stakeMaturity` and `autoStakeMaturity`
- various additional new NNS functions and proposal types
- new SNS `index` canister
- new SNS ledger and wrapper feature: `transfer` and `transactionFee`
- SNS did files updated with most recent commit in IC repo
- support join community fund for neurons controlled by Hardware Wallet.

### Build

- bump dev dependencies
- bump `agent-js` peer dependencies v0.14.0

### Docs

- refreshed [HACKING.md](/HACKING.md)

## 0.8.0 (2022-09-26)

### Release

- nns `v0.8.1`
- sns `v0.0.5`
- cmc `v0.0.1`
- utils `v0.0.4`

### Breaking changes

- the development dependency `didc` has been bumped which leads to some types having to be converted from `number[]` to
  `Uint8Array`
- new fields `stakedMaturityE8sEquivalent` and `autoStakeMaturity` in `Neuron`

### Features

- new library `@dfinity/cmc`
- new nns governance commands and actions: `ChangeAutoStakeMaturity`, `SetSnsTokenSwapOpenTimeWindow` and
  `OpenSnsTokenSwap`
- some new utilities added to transform arrays from various format to `Uint8Array`
- new Sns utilities to encode and decode accounts to and from strings
- `disburse` Sns neurons
- `createAgent` and `principalToSubAccount` added to utils

## 0.7.0 (2022-09-19)

### Release

- nns `v0.7.0`
- sns `v0.0.3`
- utils `v0.0.2`

### Breaking changes

- `agent-js` dependencies set as `peerDependencies`
- Sns canisters' classes renamed with prefix `Sns`
- enums renamed with Pascal case for consistency reason

### Features

- new library `@dfinity/utils`
- more Sns related features: `notifyParticipation`, `getUserCommitment`, some Sns neurons related features and
  governance `metadata`
- new nns governance features: `setDissolveDelay` and `setNodeProviderAccount`
- new generic interface `Token` and class `TokenAmount`
- class `ICP` set as deprecated

### Build

- bump agent-js `v0.13.1`
- publish `next` instead of `nightly-build` working versions
- add manual trigger to GitHub Actions for npm publish

## 0.6.0 (2022-07-20)

### Release

- nns `v0.6.0`
- sns `v0.0.2`

### Breaking Changes

- `nns` library `esm` canisters chunks renamed with suffix `.canister`

### Features

- new library `@dfinity/sns`
- add `SetSnsTokenSwapOpenTimeWindow` proposal action support to request and response converters
- add new property in Neuron type: `spawn_at_timestamp_seconds`
- use the governance canister id of the class in converters. This allows to also have proper conversion on testnets.
- add `leaveCommunityFund` functionality to governance canister in `@dfinity/nns`.
- map `deadline_timestamp_seconds` to proposal object
- new NNS proposal topic `SnsDecentralizationSale`

### Fix

- fix how the neuron account was converted to a `string` for `proto`.

### Build

- bump dependencies including agent-js v0.12.0
- rename repo from `nns-js` to `ic-js`
- transform repo into a mono-repo for packages `nns`, `sns` and in the future more libraries

## 0.5.0 (2022-06-23)

### Breaking

- Change "fromSubAccountId: string" param to "fromSubAccount: number[]"

### Features

- Remove payload, payloadBytes and nnsFunctionName fields from proposal of type ExecuteNnsFunction action (moved to
  nns-dapp)
- Use Candid interface by default for ledger canister and proto for hardware wallet
- New function transactionFee to query the current transaction fee

## 0.4.3 (2022-06-01)

### Features

- update most recent candid payloads

### Build

- bump agent-js `v0.11.3` with `setBigUint64` for iOS < v15

## 0.4.1 - 0.4.2 (2022-05-23)

### Features

- new methods `disburse`, `mergeMaturity` and `spawnNeuron`
- expose account utilities
- expose account identifier utilities
- update most recent candid payloads
- remove principal toJSON workaround
- Hardware wallet compatibility with protobuf
- add support for `GenesisTokenCanister::claim_neurons`

### Build

- bump dependencies

## 0.4.0 (2022-04-22)

### Breaking Changes

- Replace `notVotedNeurons` with `votableNeurons` [#77]
- Serialize Principal rather than a byte array in JSON.
- Allow neurons with zero stake to pass through the filter.

### Features

- New methods splitNeuron, mergeNeurons, addHotkey and removeHotkey in Governance Service.
- Add options `memo` and `fee` to ledger `transfer` function for hardware wallet compatibility.
- Add `votableNeurons(..)` utility function.
- Update dependencies and stop using now deprecated functions.

## 0.3.0 (2022-04-07)

### Breaking Changes

- variant return types dropped - i.e. functions now return effective result and throw errors in case of issues [#59]
- governance function `getNeurons` to `listNeurons` renamed [#55]
- governance functions `getNeurons` and `listNeurons` change signature [#69]
- Drop `isCurrentUserController` property from `Neuron` type [#69]
- remove some converters that were not use internally [#62]

### Features

- governance new functions:
  - `getProposal`
  - `stakeNeuron`
  - `registerVote`
  - `increaseDissolveDelay`
  - `getNeuron`
  - `setFollowees`
- ledger `transfer` enhanced with support for subaccount
- new utils to filter voted neurons and proposals
- export `common` types

### Build

- nns-dapp canister types removed
- nightly build job

### Tests

- add test for protobuf files
