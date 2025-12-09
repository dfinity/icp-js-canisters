import type { BitcoinDid, CkBtcMinterDid } from "@icp-sdk/canisters/ckbtc";

export type block_hash = BitcoinDid.block_hash;
export type block_height = BitcoinDid.block_height;
export type get_utxos_response = BitcoinDid.get_utxos_response;
export type outpoint = BitcoinDid.outpoint;
export type satoshi = BitcoinDid.satoshi;
export type utxo = BitcoinDid.utxo;

export type Account = CkBtcMinterDid.Account;
export type MinterInfo = CkBtcMinterDid.MinterInfo;
export type PendingUtxo = CkBtcMinterDid.PendingUtxo;
export type ReimbursedDeposit = CkBtcMinterDid.ReimbursedDeposit;
export type ReimbursementRequest = CkBtcMinterDid.ReimbursementRequest;
export type RetrieveBtcOk = CkBtcMinterDid.RetrieveBtcOk;
export type RetrieveBtcStatus = CkBtcMinterDid.RetrieveBtcStatus;
export type RetrieveBtcStatusV2 = CkBtcMinterDid.RetrieveBtcStatusV2;
export type Utxo = CkBtcMinterDid.Utxo;
export type UtxoStatus = CkBtcMinterDid.UtxoStatus;
export type WithdrawalAccount = CkBtcMinterDid.Account;

/**
 * @deprecated Use "@icp-sdk/canisters/ckbtc" directly instead
 */
export * from "@icp-sdk/canisters/ckbtc";

/**
 * Legacy re-export for backward compatibility.
 * @deprecated Use "@icp-sdk/canisters/ckbtc" directly instead
 */
export {
  CkBtcMinterCanister as CkBTCMinterCanister,
  type CkBtcCanisterOptions as CkBTCCanisterOptions,
} from "@icp-sdk/canisters/ckbtc";
