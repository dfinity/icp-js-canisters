import type { CanisterOptions } from "@dfinity/utils";
import type { Principal } from "@icp-sdk/core/principal";

export interface SnsCanisterOptions<T> extends Omit<
  CanisterOptions<T>,
  "canisterId"
> {
  // The canister's ID is mandatory in Sns canister classes.
  canisterId: Principal;
}
