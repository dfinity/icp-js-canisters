---
title: Quick Start
description: A quick start guide to using the @icp-sdk/canisters package.
next:
  label: ckBTC Module
---

This guide offers simple examples of how to use the `@icp-sdk/canisters` package.

### ckETH

Here's an example on how to use the ckETH module through its sub-entry:

```typescript
import { CkEthMinterCanister } from "@icp-sdk/canisters/cketh";
import { createAgent } from "@dfinity/utils";

const agent = await createAgent({
  identity,
  host: HOST,
});

const { getSmartContractAddress } = CkEthMinterCanister.create({
  agent,
  canisterId: MY_CKETH_MINTER_CANISTER_ID,
});

const address = await getSmartContractAddress({});
```

### ICP and ICRC Ledgers

Similarly, the ICP and ICRC ledgers can be used as follows, with the slight difference that their imports are nested under a common parent.

```typescript
import { IcrcLedgerCanister } from "@icp-sdk/canisters/ledger/icrc";
import { createAgent } from "@dfinity/utils";

const agent = await createAgent({
  identity,
  host: HOST,
});

const { metadata } = IcrcLedgerCanister.create({
  agent,
  canisterId: MY_LEDGER_CANISTER_ID,
});

const data = await metadata({});
```

## Next Steps

In the sidebar, navigate the **Modules** section to find the documentation for each module that the `@icp-sdk/canisters` package provides. Use the search bar to find specific items across all modules.
