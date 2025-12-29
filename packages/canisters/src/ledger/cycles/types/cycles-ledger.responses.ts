import type { CyclesLedgerDid } from "../../../declarations";

export type WithdrawResult =
  | { Ok: CyclesLedgerDid.BlockIndex }
  | { Err: CyclesLedgerDid.WithdrawError };
