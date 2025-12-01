import type { CanisterOptions } from "@dfinity/utils";
import type { Principal } from "@icp-sdk/core/principal";
import type { CmcActor } from "../declarations";

export interface CMCCanisterOptions
  extends Omit<CanisterOptions<CmcActor>, "canisterId"> {
  canisterId: Principal;
}
