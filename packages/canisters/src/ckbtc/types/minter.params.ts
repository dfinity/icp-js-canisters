import type { QueryParams } from "@dfinity/utils";
import type { Principal } from "@icp-sdk/core/principal";
import type { CkBtcMinterDid } from "../../declarations";

export interface MinterAccount {
  owner: Principal;
  subaccount?: Uint8Array;
}

export type MinterParams = Omit<QueryParams, "certified"> &
  Partial<MinterAccount>;

/**
 * Params to get a BTC address.
 */
export type GetBTCAddressParams = MinterParams;

/**
 * Params to update ckBTC balance after a bitcoin transfer.
 */
export type UpdateBalanceParams = MinterParams;

/**
 * Params to convert ckBTC to Bitcoin.
 */
export type RetrieveBtcParams = CkBtcMinterDid.RetrieveBtcArgs &
  Omit<QueryParams, "certified">;

/**
 * Params to estimate the fee of the Bitcoin network.
 */
export type EstimateWithdrawalFeeParams = QueryParams & {
  amount: bigint | undefined;
};

/**
 * Params to retrieve the status of all BTC withdrawals for an account.
 */
export type RetrieveBtcStatusV2ByAccountParams = QueryParams & {
  account?: MinterAccount;
};

/**
 * Params to get the known utxos.
 */
export type GetKnownUtxosParams = QueryParams & MinterParams;
