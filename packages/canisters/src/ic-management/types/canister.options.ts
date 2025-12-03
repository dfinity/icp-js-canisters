import type { CanisterOptions } from "@dfinity/utils";
import type { _SERVICE as IcManagementService } from "../../declarations/ic-management/ic-management";

export type ICManagementCanisterOptions = Pick<
  CanisterOptions<IcManagementService>,
  "agent" | "serviceOverride" | "certifiedServiceOverride"
>;
