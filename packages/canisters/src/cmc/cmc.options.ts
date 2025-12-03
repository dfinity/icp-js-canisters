import type { CanisterOptions } from "@dfinity/utils";
import type { Principal } from "@icp-sdk/core/principal";
import type { CmcService } from "../declarations";

export interface CmcCanisterOptions extends Omit<
  CanisterOptions<CmcService>,
  "canisterId"
> {
  canisterId: Principal;
}
