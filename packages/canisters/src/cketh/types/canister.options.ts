import type { CanisterOptions } from "@dfinity/utils";
import type { Principal } from "@icp-sdk/core/principal";

export interface CkEthMinterCanisterOptions<T> extends Omit<
  CanisterOptions<T>,
  "canisterId"
> {
  // The canister's ID is mandatory to instantiate an ckETH minter.
  canisterId: Principal;
}

export type CkEthOrchestratorCanisterOptions<T> = CkEthMinterCanisterOptions<T>;
