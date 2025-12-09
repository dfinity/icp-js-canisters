import type { CkBtcMinterDid } from "../../declarations";

export type UpdateBalanceOk = CkBtcMinterDid.UtxoStatus[];

export type UpdateBalanceResponse =
  | { Ok: UpdateBalanceOk }
  | { Err: CkBtcMinterDid.UpdateBalanceError };

export type RetrieveBtcResponse =
  | { Ok: CkBtcMinterDid.RetrieveBtcOk }
  | { Err: CkBtcMinterDid.RetrieveBtcError };

export type RetrieveBtcWithApprovalResponse =
  | { Ok: CkBtcMinterDid.RetrieveBtcOk }
  | { Err: CkBtcMinterDid.RetrieveBtcWithApprovalError };

export interface EstimateWithdrawalFee {
  minter_fee: bigint;
  bitcoin_fee: bigint;
}

export interface RetrieveBtcStatusV2WithId {
  id: bigint;
  status: CkBtcMinterDid.RetrieveBtcStatusV2 | undefined;
}
