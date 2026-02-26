import type { CkDogeMinterDid } from "../../declarations";

export type UpdateBalanceOk = CkDogeMinterDid.UtxoStatus[];

export type UpdateBalanceResponse =
  | { Ok: UpdateBalanceOk }
  | { Err: CkDogeMinterDid.UpdateBalanceError };

export type RetrieveDogeWithApprovalResponse =
  | { Ok: CkDogeMinterDid.RetrieveDogeOk }
  | { Err: CkDogeMinterDid.RetrieveDogeWithApprovalError };

export interface EstimateWithdrawalFee {
  minter_fee: bigint;
  dogecoin_fee: bigint;
}
