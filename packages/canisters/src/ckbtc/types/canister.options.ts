import type { CanisterOptions } from "@dfinity/utils";
import type { Principal } from "@icp-sdk/core/principal";

export interface CkBtcCanisterOptions<T> extends Omit<
  CanisterOptions<T>,
  "canisterId"
> {
  // The canister's ID is mandatory to instantiate a ckBTC related canister.
  canisterId: Principal;
}
