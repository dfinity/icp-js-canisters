import type { ServiceResponse } from "@dfinity/utils";
import type { IcManagementService } from "../../declarations";

export type CanisterStatusResponse = ServiceResponse<
  IcManagementService,
  "canister_status"
>;

export type FetchCanisterLogsResponse = ServiceResponse<
  IcManagementService,
  "fetch_canister_logs"
>;
