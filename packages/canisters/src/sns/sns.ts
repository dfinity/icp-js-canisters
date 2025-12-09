import { IcrcIndexCanister, IcrcLedgerCanister } from "@dfinity/ledger-icrc";
import {
  assertNonNullish,
  fromNullable,
  type QueryParams,
} from "@dfinity/utils";
import type { Agent } from "@icp-sdk/core/agent";
import type { Principal } from "@icp-sdk/core/principal";
import type {
  SnsRootDid,
  SnsRootService,
} from "../declarations";
import { SnsGovernanceCanister } from "./governance.canister";
import { SnsRootCanister } from "./root.canister";
import { SnsWrapper } from "./sns.wrapper";
import { SnsSwapCanister } from "./swap.canister";
import type { SnsCanisterOptions } from "./types/canister.options";

/**
 * Options to discover and initialize all canisters of a Sns.
 */
export interface InitSnsCanistersOptions extends QueryParams {
  /** An agent that can be used to override the default agent. Useful to target another environment that mainnet. */
  agent?: Agent;
  /** The options that will be used to instantiate the actors of the root canister of the particular Sns. */
  rootOptions: Omit<SnsCanisterOptions<SnsRootService>, "agent">;
}

export interface InitSnsWrapper {
  (options: InitSnsCanistersOptions): Promise<SnsWrapper>;
}

/**
 * Lookup for the canister ids of a Sns and initialize the wrapper to access its features.
 */
export const initSnsWrapper: InitSnsWrapper = async ({
  agent,
  rootOptions,
  certified = true,
}: InitSnsCanistersOptions): Promise<SnsWrapper> => {
  const rootCanister: SnsRootCanister = SnsRootCanister.create({
    ...rootOptions,
    agent,
  });

  const {
    ledger,
    swap,
    governance,
    index,
  }: SnsRootDid.ListSnsCanistersResponse = await rootCanister.listSnsCanisters({
    certified,
  });

  const governanceCanisterId: Principal | undefined = fromNullable(governance);
  const ledgerCanisterId: Principal | undefined = fromNullable(ledger);
  const swapCanisterId: Principal | undefined = fromNullable(swap);
  const indexCanisterId: Principal | undefined = fromNullable(index);

  assertNonNullish(governanceCanisterId);
  assertNonNullish(ledgerCanisterId);
  assertNonNullish(swapCanisterId);
  assertNonNullish(indexCanisterId);

  return new SnsWrapper({
    root: rootCanister,
    governance: SnsGovernanceCanister.create({
      canisterId: governanceCanisterId,
      agent,
    }),
    ledger: IcrcLedgerCanister.create({ canisterId: ledgerCanisterId, agent }),
    swap: SnsSwapCanister.create({ canisterId: swapCanisterId, agent }),
    index: IcrcIndexCanister.create({ canisterId: indexCanisterId, agent }),
    certified,
  });
};
