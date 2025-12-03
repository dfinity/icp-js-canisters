import type { ServiceResponse } from "@dfinity/utils";
import type { _SERVICE as IcManagementService } from "../../declarations/ic-management/ic-management";

export type CanisterStatusResponse = ServiceResponse<
  IcManagementService,
  "canister_status"
>;

export type FetchCanisterLogsResponse = ServiceResponse<
  IcManagementService,
  "fetch_canister_logs"
>;
