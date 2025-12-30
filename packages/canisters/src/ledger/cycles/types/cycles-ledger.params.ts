import type { CyclesLedgerDid } from "../../../declarations";

export type WithdrawParams = {
  fromSubaccount?: Uint8Array;
  createdAtTime?: bigint;
} & Omit<CyclesLedgerDid.WithdrawArgs, "from_subaccount" | "created_at_time">;
