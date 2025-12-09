import type {
  CkEthMinterDid,
  CkEthOrchestratorDid,
} from "@icp-sdk/canisters/cketh";

export type Eip1559TransactionPrice = CkEthMinterDid.Eip1559TransactionPrice;
export type EthTransaction = CkEthMinterDid.EthTransaction;
export type MinterInfo = CkEthMinterDid.MinterInfo;
export type RetrieveErc20Request = CkEthMinterDid.RetrieveErc20Request;
export type RetrieveEthRequest = CkEthMinterDid.RetrieveEthRequest;
export type RetrieveEthStatus = CkEthMinterDid.RetrieveEthStatus;
export type Subaccount = CkEthMinterDid.Subaccount;
export type TxFinalizedStatus = CkEthMinterDid.TxFinalizedStatus;

export type CyclesManagement = CkEthOrchestratorDid.CyclesManagement;
export type Erc20Contract = CkEthOrchestratorDid.Erc20Contract;
export type ManagedCanisterStatus = CkEthOrchestratorDid.ManagedCanisterStatus;
export type ManagedCanisters = CkEthOrchestratorDid.ManagedCanisters;
export type OrchestratorInfo = CkEthOrchestratorDid.OrchestratorInfo;

/**
 * @deprecated Use "@icp-sdk/canisters/cketh" directly instead
 */
export * from "@icp-sdk/canisters/cketh";

/**
 * Legacy re-export for backward compatibility.
 * @deprecated Use "@icp-sdk/canisters/cketh" directly instead
 */
export {
  CkEthMinterCanister as CkETHMinterCanister,
  CkEthOrchestratorCanister as CkETHOrchestratorCanister,
  type CkEthMinterCanisterOptions as CkETHMinterCanisterOptions,
  type CkEthOrchestratorCanisterOptions as CkETHOrchestratorCanisterOptions,
} from "@icp-sdk/canisters/cketh";
