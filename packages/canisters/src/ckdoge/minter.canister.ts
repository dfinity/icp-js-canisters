import {
  Canister,
  createServices,
  toNullable,
  type QueryParams,
} from "@dfinity/utils";
import {
  idlFactoryCertifiedCkDogeMinter,
  idlFactoryCkDogeMinter,
  type CkDogeMinterDid,
  type CkDogeMinterService,
} from "../declarations";
import {
  createEstimateWithdrawalFeeError,
  createRetrieveDogeWithApprovalError,
  createUpdateBalanceError,
} from "./errors/minter.errors";
import type { CkDogeCanisterOptions } from "./types/canister.options";
import type {
  EstimateWithdrawalFeeParams,
  GetDogeAddressParams,
  GetKnownUtxosParams,
  UpdateBalanceParams,
} from "./types/minter.params";
import type {
  EstimateWithdrawalFee,
  RetrieveDogeWithApprovalResponse,
  UpdateBalanceOk,
  UpdateBalanceResponse,
} from "./types/minter.responses";

export class CkDogeMinterCanister extends Canister<CkDogeMinterService> {
  static create(options: CkDogeCanisterOptions<CkDogeMinterService>) {
    const { service, certifiedService, canisterId } =
      createServices<CkDogeMinterService>({
        options,
        idlFactory: idlFactoryCkDogeMinter,
        certifiedIdlFactory: idlFactoryCertifiedCkDogeMinter,
      });

    return new CkDogeMinterCanister(canisterId, service, certifiedService);
  }

  /**
   * Returns a DOGE address for a given account.
   *
   * Note: an update call is required by the Minter canister.
   *
   * @param {GetDogeAddressParams} params The parameters for which a DOGE address should be resolved.
   * @param {Principal} params.owner The owner for which the DOGE address should be generated. If not provided, the `caller` will be use instead.
   * @param {Uint8Array} params.subaccount An optional subaccount to compute the address.
   * @returns {Promise<string>} The DOGE address of the given account.
   */
  getDogeAddress = ({
    owner,
    subaccount,
  }: GetDogeAddressParams): Promise<string> =>
    this.caller({ certified: true }).get_doge_address({
      owner: toNullable(owner),
      subaccount: toNullable(subaccount),
    });

  /**
   * Notify the minter about the dogecoin transfer.
   *
   * Upon successful notification, new ckDOGE should be available on the targeted address.
   *
   * @param {UpdateBalanceParams} params The parameters are the address to which dogecoin where transferred.
   * @param {Principal} params.owner The owner of the address. If not provided, the `caller` will be use instead.
   * @param {Principal} params.subaccount An optional subaccount of the address.
   * @returns {Promise<UpdateBalanceOk>} The result of the balance update.
   */
  updateBalance = async ({
    owner,
    subaccount,
  }: UpdateBalanceParams): Promise<UpdateBalanceOk> => {
    const response: UpdateBalanceResponse = await this.caller({
      certified: true,
    }).update_balance({
      owner: toNullable(owner),
      subaccount: toNullable(subaccount),
    });

    if ("Err" in response) {
      throw createUpdateBalanceError(response.Err);
    }

    return response.Ok;
  };

  /**
   * Submits a request to convert ckDOGE to DOGE after making an ICRC-2 approval.
   *
   * # Note
   *
   * The DOGE retrieval process is slow. Instead of synchronously waiting for a DOGE transaction to settle, this method returns a request ([block_index]) that the caller can use to query the request status.
   *
   * # Preconditions
   *
   * The caller allowed the minter's principal to spend its funds using
   * [icrc2_approve] on the ckDOGE ledger.
   *
   * @param {string} params.address The dogecoin address.
   * @param {bigint} params.amount The ckDOGE amount.
   * @param {Uint8Array} params.fromSubaccount An optional subaccount from which
   *     the ckDOGE should be transferred.
   * @returns {Promise<RetrieveDogeOk>} The result or the operation.
   */
  retrieveDogeWithApproval = async ({
    address,
    amount,
    fromSubaccount,
  }: {
    address: string;
    amount: bigint;
    fromSubaccount?: Uint8Array;
  }): Promise<CkDogeMinterDid.RetrieveDogeOk> => {
    const response: RetrieveDogeWithApprovalResponse = await this.caller({
      certified: true,
    }).retrieve_doge_with_approval({
      address,
      amount,
      from_subaccount: toNullable(fromSubaccount),
    });

    if ("Err" in response) {
      throw createRetrieveDogeWithApprovalError(response.Err);
    }

    return response.Ok;
  };

  /**
   * Returns the status of a specific DOGE withdrawal based on the transaction ID
   * of the corresponding burn transaction.
   *
   * @param {Object} params
   * @param {bigint} params.transactionId The ID of the corresponding burn transaction.
   * @param {boolean} params.certified query or update call
   * @returns {Promise<RetrieveDogeStatus>} The status of the DOGE retrieval request.
   */
  retrieveDogeStatus = ({
    transactionId,
    certified,
  }: {
    transactionId: bigint;
    certified: boolean;
  }): Promise<CkDogeMinterDid.RetrieveDogeStatus> =>
    this.caller({
      certified,
    }).retrieve_doge_status({ block_index: transactionId });

  /**
   * Returns an estimation of the user's fee (in koinu) for a retrieve_doge request based on the current status of the Dogecoin network and the fee related to the minter.
   *
   * @param {EstimateWithdrawalFeeParams} params The parameters to estimate the fee.
   * @param {boolean} params.certified query or update call
   * @param {bigint | undefined} params.amount The optional amount for which the fee should be estimated.
   */
  estimateWithdrawalFee = async ({
    certified,
    amount,
  }: EstimateWithdrawalFeeParams): Promise<EstimateWithdrawalFee> => {
    const response = await this.caller({
      certified,
    }).estimate_withdrawal_fee({ amount: toNullable(amount) });

    if ("Err" in response) {
      throw createEstimateWithdrawalFeeError(response.Err);
    }

    return response.Ok;
  };

  /**
   * Returns internal minter parameters such as the minimal amount to retrieve DOGE, minimal number of confirmations or KYT fee.
   *
   * @param {QueryParams} params The parameters to get the minter info.
   * @param {boolean} params.certified query or update call
   */
  getMinterInfo = ({
    certified,
  }: QueryParams): Promise<CkDogeMinterDid.MinterInfo> =>
    this.caller({
      certified,
    }).get_minter_info();

  /**
   * Returns UTXOs of the given account known by the minter.
   *
   * @param {GetKnownUtxosParams} params The parameters for which the known utxos should be resolved.
   * @param {Principal} params.owner The owner of the account. Note that if not provided, the `caller` would be used by the minter instead.
   * @param {Uint8Array} params.subaccount An optional subaccount.
   * @returns {Promise<Utxo[]>} The known utxos (with no guarantee in the ordering).
   */
  getKnownUtxos = ({
    owner,
    subaccount,
    certified,
  }: GetKnownUtxosParams): Promise<CkDogeMinterDid.Utxo[]> => {
    const { get_known_utxos } = this.caller({ certified });

    return get_known_utxos({
      owner: toNullable(owner),
      subaccount: toNullable(subaccount),
    });
  };

  /**
   * Returns the state of the minter.
   *
   * @returns {Promise<CanisterStatusResponse>} Canister's data & stats.
   */
  getCanisterStatus = ({
    certified,
  }: GetKnownUtxosParams): Promise<CkDogeMinterDid.CanisterStatusResponse> =>
    this.caller({ certified }).get_canister_status();
}
