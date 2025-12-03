import type { CanisterOptions } from "@dfinity/utils";
import type { IcManagementService } from "../../declarations";

export type ICManagementCanisterOptions = Pick<
  CanisterOptions<IcManagementService>,
  "agent" | "serviceOverride" | "certifiedServiceOverride"
>;
