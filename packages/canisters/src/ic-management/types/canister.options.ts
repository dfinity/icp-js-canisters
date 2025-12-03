import type { CanisterOptions } from "@dfinity/utils";
import type { IcManagementService } from "../../declarations";

export type IcManagementCanisterOptions = Pick<
  CanisterOptions<IcManagementService>,
  "agent" | "serviceOverride" | "certifiedServiceOverride"
>;
