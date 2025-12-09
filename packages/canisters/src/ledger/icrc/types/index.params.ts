import type { TxId } from "../../../declarations/ledger-icrc/icrc_index";
import type { IcrcAccount } from "./ledger.responses";

export interface GetAccountTransactionsParams {
  max_results: bigint;
  start?: TxId;
  account: IcrcAccount;
}
