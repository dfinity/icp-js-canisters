import { isNullish, toNullable, type QueryParams } from "@dfinity/utils";
import type { Principal } from "@icp-sdk/core/principal";
import type { CkEthMinterDid } from "../../declarations";

export type Eip1559TransactionPriceParams = {
  ckErc20LedgerId?: Principal;
} & QueryParams;

export const toEip1559TransactionPriceParams = ({
  ckErc20LedgerId: ckerc20_ledger_id,
}: Eip1559TransactionPriceParams):
  | []
  | [CkEthMinterDid.Eip1559TransactionPriceArg] =>
  toNullable(isNullish(ckerc20_ledger_id) ? undefined : { ckerc20_ledger_id });
