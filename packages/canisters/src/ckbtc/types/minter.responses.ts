import type {
  RetrieveBtcError,
  RetrieveBtcOk,
  RetrieveBtcStatusV2,
  RetrieveBtcWithApprovalError,
  UpdateBalanceError,
  UtxoStatus,
} from "../../declarations/ckbtc/minter";

export type UpdateBalanceOk = UtxoStatus[];

export type UpdateBalanceResponse =
  | { Ok: UpdateBalanceOk }
  | { Err: UpdateBalanceError };

export type RetrieveBtcResponse =
  | { Ok: RetrieveBtcOk }
  | { Err: RetrieveBtcError };

export type RetrieveBtcWithApprovalResponse =
  | { Ok: RetrieveBtcOk }
  | { Err: RetrieveBtcWithApprovalError };

export interface EstimateWithdrawalFee {
  minter_fee: bigint;
  bitcoin_fee: bigint;
}

export interface RetrieveBtcStatusV2WithId {
  id: bigint;
  status: RetrieveBtcStatusV2 | undefined;
}
