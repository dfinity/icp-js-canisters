import {
  Canister,
  createServices,
  fromDefinedNullable,
  fromNullable,
  type QueryParams,
} from "@dfinity/utils";
import {
  idlFactoryCertifiedSnsSwap,
  idlFactorySnsSwap,
  type SnsSwapDid,
  type SnsSwapService,
} from "../declarations";
import { toNewSaleTicketRequest } from "./converters/swap.converters";
import { UnsupportedMethodError } from "./errors/common.errors";
import {
  SnsSwapGetOpenTicketError,
  SnsSwapNewTicketError,
} from "./errors/swap.errors";
import type { SnsCanisterOptions } from "./types/canister.options";
import type { NewSaleTicketParams } from "./types/swap.params";
import { isMethodNotSupportedError } from "./utils/error.utils";

export class SnsSwapCanister extends Canister<SnsSwapService> {
  static create(options: SnsCanisterOptions<SnsSwapService>) {
    const { service, certifiedService, canisterId } =
      createServices<SnsSwapService>({
        options,
        idlFactory: idlFactorySnsSwap,
        certifiedIdlFactory: idlFactoryCertifiedSnsSwap,
      });

    return new SnsSwapCanister(canisterId, service, certifiedService);
  }

  /**
   * Get the state of the swap
   */
  state = (params: QueryParams): Promise<SnsSwapDid.GetStateResponse> =>
    this.caller(params).get_state({});

  /**
   * Notify of the payment failure to remove the ticket
   */
  notifyPaymentFailure = async (): Promise<SnsSwapDid.Ticket | undefined> => {
    const { ticket } = await this.caller({
      certified: true,
    }).notify_payment_failure({});
    return fromNullable(ticket);
  };

  /**
   * Notify of the user participating in the swap
   */
  notifyParticipation = async (
    params: SnsSwapDid.RefreshBuyerTokensRequest,
  ): Promise<SnsSwapDid.RefreshBuyerTokensResponse> =>
    await this.caller({ certified: true }).refresh_buyer_tokens(params);

  /**
   * Get user commitment
   */
  getUserCommitment = async (
    params: SnsSwapDid.GetBuyerStateRequest & QueryParams,
  ): Promise<SnsSwapDid.BuyerState | undefined> => {
    const { buyer_state } = await this.caller({
      certified: params.certified,
    }).get_buyer_state({ principal_id: params.principal_id });
    return fromNullable(buyer_state);
  };

  /**
   * Get sale buyers state
   */
  getDerivedState = ({
    certified,
  }: QueryParams): Promise<SnsSwapDid.GetDerivedStateResponse> =>
    this.caller({ certified }).get_derived_state({});

  /**
   * Get sale parameters
   */
  getSaleParameters = ({
    certified,
  }: QueryParams): Promise<SnsSwapDid.GetSaleParametersResponse> =>
    this.caller({ certified }).get_sale_parameters({});

  /**
   * Return a sale ticket if created and not yet removed (payment flow)
   */
  getOpenTicket = async (
    params: QueryParams,
  ): Promise<SnsSwapDid.Ticket | undefined> => {
    const { result: response } = await this.caller({
      certified: params.certified,
    }).get_open_ticket({});
    const result = fromDefinedNullable(response);

    if ("Ok" in result) {
      return fromNullable(result.Ok.ticket);
    }

    const errorType = fromDefinedNullable(result?.Err?.error_type);
    throw new SnsSwapGetOpenTicketError(errorType);
  };

  /**
   * Create a sale ticket (payment flow)
   */
  newSaleTicket = async (
    params: NewSaleTicketParams,
  ): Promise<SnsSwapDid.Ticket> => {
    const request = toNewSaleTicketRequest(params);
    const { result: response } = await this.caller({
      certified: true,
    }).new_sale_ticket(request);

    const result = fromDefinedNullable(response);

    if ("Ok" in result) {
      return fromDefinedNullable(result.Ok.ticket);
    }

    const errorData = result.Err;
    const error = new SnsSwapNewTicketError({
      errorType: errorData.error_type,
      invalidUserAmount: fromNullable(errorData.invalid_user_amount ?? []),
      existingTicket: fromNullable(errorData.existing_ticket ?? []),
    });

    throw error;
  };

  /**
   * Get sale lifecycle state
   */
  getLifecycle = (
    params: QueryParams,
  ): Promise<SnsSwapDid.GetLifecycleResponse> =>
    this.caller(params).get_lifecycle({});

  /**
   * Get sale lifecycle state
   */
  getFinalizationStatus = async (
    params: QueryParams,
  ): Promise<SnsSwapDid.GetAutoFinalizationStatusResponse> => {
    try {
      return await this.caller(params).get_auto_finalization_status({});
    } catch (error) {
      // Throw a custom error if the method is not supported by the canister
      if (isMethodNotSupportedError(error)) {
        throw new UnsupportedMethodError("getFinalizationStatus");
      }
      throw error;
    }
  };
}
