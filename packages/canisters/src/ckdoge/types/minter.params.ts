import type { QueryParams } from "@dfinity/utils";
import type { Principal } from "@icp-sdk/core/principal";

export interface MinterAccount {
  owner: Principal;
  subaccount?: Uint8Array;
}

export type MinterParams = Omit<QueryParams, "certified"> &
  Partial<MinterAccount>;

/**
 * Params to get a DOGE address.
 */
export type GetDogeAddressParams = MinterParams;

/**
 * Params to update ckDOGE balance after a dogecoin transfer.
 */
export type UpdateBalanceParams = MinterParams;

/**
 * Params to estimate the fee of the Dogecoin network.
 */
export type EstimateWithdrawalFeeParams = QueryParams & {
  amount: bigint | undefined;
};

/**
 * Params to get the known utxos.
 */
export type GetKnownUtxosParams = QueryParams & MinterParams;
