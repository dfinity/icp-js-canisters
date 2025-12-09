import type { CanisterOptions } from "@dfinity/utils";
import type { _SERVICE as LedgerService } from "../../../declarations/ledger-icp/ledger";

export type LedgerCanisterOptions = CanisterOptions<LedgerService>;
