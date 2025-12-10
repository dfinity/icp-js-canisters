import type { CanisterOptions } from "@dfinity/utils";
import type { ActorSubclass } from "@icp-sdk/core/agent";
import type { NnsGovernanceService } from "../../declarations";

export interface NnsGovernanceCanisterOptions extends CanisterOptions<NnsGovernanceService> {
  // Ledger IC App needs requests built with Protobuf.
  // This flag ensures that the methods use Protobuf.
  hardwareWallet?: boolean;
  oldListNeuronsServiceOverride?: ActorSubclass<NnsGovernanceService>;
}
