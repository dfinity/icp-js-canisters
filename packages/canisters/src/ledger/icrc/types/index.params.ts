import type { IcrcIndexNgDid } from "../../../declarations";
import type { IcrcAccount } from "./ledger.responses";

export interface GetAccountTransactionsParams {
  max_results: bigint;
  start?: IcrcIndexNgDid.BlockIndex;
  account: IcrcAccount;
}
