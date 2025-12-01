import { Canister, createServices, type QueryParams } from "@dfinity/utils";
import type { Principal } from "@icp-sdk/core/principal";
import {
  type CmcActor,
  type CmcDid,
  idlFactoryCertifiedCmc,
  idlFactoryCmc,
} from "../declarations";
import { throwNotifyError } from "./cmc.errors";
import type { CMCCanisterOptions } from "./cmc.options";

export class CMCCanister extends Canister<CmcActor> {
  static create(options: CMCCanisterOptions): CMCCanister {
    const { service, certifiedService, canisterId } = createServices<CmcActor>({
      options,
      idlFactory: idlFactoryCmc,
      certifiedIdlFactory: idlFactoryCertifiedCmc,
    });

    return new CMCCanister(canisterId, service, certifiedService);
  }

  /**
   * Returns conversion rate of ICP to Cycles. It can be called as query or update.
   *
   * @param {Object} [params] - The parameters for the call.
   * @param {boolean} [params.certified] - Determines whether the response should be certified (default: non-certified)
   *
   * @returns Promise<BigInt>
   */
  public getIcpToCyclesConversionRate = async ({
    certified,
  }: QueryParams = {}): Promise<bigint> => {
    const { data } = await this.caller({
      certified,
    }).get_icp_xdr_conversion_rate();

    // TODO: validate the certificate in the response - https://dfinity.atlassian.net/browse/GIX-150
    // Example: https://github.com/dfinity/response-verification/tree/main/examples/certification/certified-counter
    return data.xdr_permyriad_per_icp;
  };

  /**
   * Notifies Cycles Minting Canister of the creation of a new canister.
   * It returns the new canister principal.
   *
   * @param {Object} request
   * @param {Principal} request.controller
   * @param {BlockIndex} request.block_index
   * @returns Promise<Principal>
   * @throws RefundedError, InvalidaTransactionError, ProcessingError, TransactionTooOldError, CMCError
   */
  public notifyCreateCanister = async (
    request: CmcDid.NotifyCreateCanisterArg,
  ): Promise<Principal> => {
    const response = await this.service.notify_create_canister(request);
    if ("Err" in response) {
      throwNotifyError(response);
    }
    if ("Ok" in response) {
      return response.Ok;
    }
    // Edge case
    throw new Error(
      `Unsupported response type in notifyCreateCanister ${JSON.stringify(
        response,
      )}`,
    );
  };

  /**
   * Notifies Cycles Minting Canister of new cycles being added to canister.
   * It returns the new Cycles of the canister.
   *
   * @param {Object} request
   * @param {Principal} request.canister_id
   * @param {BlockIndex} request.block_index
   * @returns Promise<Cycles>
   * @throws RefundedError, InvalidaTransactionError, ProcessingError, TransactionTooOldError, CMCError
   */
  public notifyTopUp = async (
    request: CmcDid.NotifyTopUpArg,
  ): Promise<CmcDid.Cycles> => {
    const response = await this.service.notify_top_up(request);
    if ("Err" in response) {
      throwNotifyError(response);
    }
    if ("Ok" in response) {
      return response.Ok;
    }
    // Edge case
    throw new Error(
      `Unsupported response type in notifyTopUp ${JSON.stringify(response)}`,
    );
  };

  /**
   * This function calls the `get_default_subnets` method of the CMC canister, which returns a list of
   * default subnets as `Principal` objects. It can be called as query or update.
   *
   * @param {Object} [params] - The query parameters for the call.
   * @param {boolean} [params.certified] - Determines whether the response should be certified
   * (default: non-certified if not specified).
   *
   * @returns {Promise<Principal[]>} - A promise that resolves to an array of `Principal` objects
   * representing the default subnets.
   */
  public getDefaultSubnets = ({ certified }: QueryParams = {}): Promise<
    Principal[]
  > => {
    const { get_default_subnets } = this.caller({ certified });
    return get_default_subnets();
  };

  /**
   * This function calls the `get_subnet_types_to_subnets` method of the CMC canister, which returns a list of subnets where canisters can be created.
   * These subnets are excluded from the random subnet selection process used by the CMC when no explicit subnet ID is provided
   * during canister creation and therefore, not provided in the results of the similar function `get_default_subnets`.
   *
   * @param {Object} [params] - The optional query parameters for the call.
   * @param {boolean} [params.certified=false] - Specifies whether the response should be certified.
   * If not provided, the response defaults to non-certified.
   *
   * @returns {Promise<SubnetTypesToSubnetsResponse>} - A promise that resolves to an object representing
   * the mapping of subnet types to subnets.
   */
  public getSubnetTypesToSubnets = ({
    certified,
  }: QueryParams = {}): Promise<CmcDid.SubnetTypesToSubnetsResponse> => {
    const { get_subnet_types_to_subnets } = this.caller({ certified });
    return get_subnet_types_to_subnets();
  };
}
