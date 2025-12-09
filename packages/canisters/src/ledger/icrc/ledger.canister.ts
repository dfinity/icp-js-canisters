import {
  createServices,
  type Nullable,
  type QueryParams,
} from "@dfinity/utils";
import type { Principal } from "@icp-sdk/core/principal";
import {
  type IcrcLedgerDid,
  type IcrcLedgerService,
  idlFactoryCertifiedIcrcLedger,
  idlFactoryIcrcLedger,
} from "../../declarations";
import { IcrcCanister } from "./canister";
import {
  toApproveArgs,
  toIcrc21ConsentMessageArgs,
  toTransferArg,
  toTransferFromArgs,
} from "./converters/ledger.converters";
import {
  IcrcTransferError,
  mapIcrc106GetIndexPrincipalError,
  mapIcrc21ConsentMessageError,
} from "./errors/ledger.errors";
import type { IcrcLedgerCanisterOptions } from "./types/canister.options";
import type {
  AllowanceParams,
  ApproveParams,
  GetBlocksParams,
  Icrc21ConsentMessageParams,
  TransferFromParams,
  TransferParams,
} from "./types/ledger.params";
import type { IcrcTokenMetadataResponse } from "./types/ledger.responses";

export class IcrcLedgerCanister extends IcrcCanister<IcrcLedgerService> {
  static create(options: IcrcLedgerCanisterOptions<IcrcLedgerService>) {
    const { service, certifiedService, canisterId } =
      createServices<IcrcLedgerService>({
        options,
        idlFactory: idlFactoryIcrcLedger,
        certifiedIdlFactory: idlFactoryCertifiedIcrcLedger,
      });

    return new IcrcLedgerCanister(canisterId, service, certifiedService);
  }

  /**
   * The token metadata (name, symbol, etc.).
   */
  metadata = (params: QueryParams): Promise<IcrcTokenMetadataResponse> =>
    this.caller(params).icrc1_metadata();

  /**
   * The ledger transaction fees.
   *
   * @returns {Tokens} The ledger transaction fees in Tokens
   */
  transactionFee = (params: QueryParams): Promise<IcrcLedgerDid.Tokens> =>
    this.caller(params).icrc1_fee();

  /**
   * Transfers tokens from the sender to the given account.
   *
   * @param {TransferArg} params The parameters to transfer tokens.
   *
   * @throws {IcrcTransferError} If the transfer fails.
   */
  transfer = async (
    params: TransferParams,
  ): Promise<IcrcLedgerDid.BlockIndex> => {
    const response = await this.caller({ certified: true }).icrc1_transfer(
      toTransferArg(params),
    );
    if ("Err" in response) {
      throw new IcrcTransferError({
        errorType: response.Err,
        msg: "Failed to transfer",
      });
    }
    return response.Ok;
  };

  /**
   * Returns the total supply of tokens.
   */
  totalTokensSupply = (params: QueryParams): Promise<IcrcLedgerDid.Tokens> =>
    this.caller(params).icrc1_total_supply();

  /**
   * Transfers a token amount from the `from` account to the `to` account using the allowance of the spender's account (`SpenderAccount = { owner = caller; subaccount = spender_subaccount }`). The ledger draws the fees from the `from` account.
   *
   * Reference: https://github.com/dfinity/ICRC-1/blob/main/standards/ICRC-2/README.md#icrc2_transfer_from
   *
   * @param {TransferFromParams} params The parameters to transfer tokens from to.
   *
   * @throws {IcrcTransferError} If the transfer from fails.
   */
  transferFrom = async (
    params: TransferFromParams,
  ): Promise<IcrcLedgerDid.BlockIndex> => {
    const response = await this.caller({ certified: true }).icrc2_transfer_from(
      toTransferFromArgs(params),
    );
    if ("Err" in response) {
      throw new IcrcTransferError({
        errorType: response.Err,
        msg: "Failed to transfer from",
      });
    }
    return response.Ok;
  };

  /**
   * This method entitles the `spender` to transfer token `amount` on behalf of the caller from account `{ owner = caller; subaccount = from_subaccount }`.
   *
   * Reference: https://github.com/dfinity/ICRC-1/blob/main/standards/ICRC-2/README.md#icrc2_approve
   *
   * @param {ApproveParams} params The parameters to approve.
   *
   * @throws {IcrcTransferError} If the approval fails.
   */
  approve = async (
    params: ApproveParams,
  ): Promise<IcrcLedgerDid.BlockIndex> => {
    const response = await this.caller({ certified: true }).icrc2_approve(
      toApproveArgs(params),
    );
    if ("Err" in response) {
      throw new IcrcTransferError({
        errorType: response.Err,
        msg: "Failed to entitle the spender to transfer the amount",
      });
    }
    return response.Ok;
  };

  /**
   * Returns the token allowance that the `spender` account can transfer from the specified `account`, and the expiration time for that allowance, if any.
   *
   * Reference: https://github.com/dfinity/ICRC-1/blob/main/standards/ICRC-2/README.md#icrc2_allowance
   *
   * @param {AllowanceParams} params The parameters to call the allowance.
   *
   * @returns {Allowance} The token allowance. If there is no active approval, the ledger MUST return `{ allowance = 0; expires_at = null }`.
   */
  allowance = (params: AllowanceParams): Promise<IcrcLedgerDid.Allowance> => {
    const { certified, ...rest } = params;
    return this.caller({ certified }).icrc2_allowance({ ...rest });
  };

  /**
   * Fetches the consent message for a specified canister call, intended to provide a human-readable message that helps users make informed decisions.
   *
   * @link: https://github.com/dfinity/wg-identity-authentication/blob/main/topics/ICRC-21/icrc_21_consent_msg.md
   *
   * @param {Icrc21ConsentMessageParams} params - The request parameters containing the method name, arguments, and consent preferences (e.g., language).
   * @returns {Promise<icrc21_consent_info>} - A promise that resolves to the consent message response, which includes the consent message in the specified language and other related information.
   *
   * @throws {InsufficientPaymentError} - This error is reserved for future use, in case payment extensions are introduced. For example, if consent messages, which are currently free, begin to require payments.
   * @throws {UnsupportedCanisterCallError} - If the specified canister call is not supported.
   * @throws {ConsentMessageUnavailableError} - If there is no consent message available.
   * @throws {GenericError} - For any other generic errors.
   */
  consentMessage = async (
    params: Icrc21ConsentMessageParams,
  ): Promise<IcrcLedgerDid.icrc21_consent_info> => {
    const { icrc21_canister_call_consent_message } = this.caller({
      certified: true,
    });

    const response = await icrc21_canister_call_consent_message(
      toIcrc21ConsentMessageArgs(params),
    );

    if ("Err" in response) {
      throw mapIcrc21ConsentMessageError(response.Err);
    }

    return response.Ok;
  };

  /**
   * Fetches the blocks information from the ledger canister,
   *
   * @param {GetBlocksParams} params The parameters to get the blocks.
   * @returns {Promise<GetBlocksResult>} The list of blocks.
   */
  getBlocks = (
    params: GetBlocksParams,
  ): Promise<IcrcLedgerDid.GetBlocksResult> =>
    this.caller({ certified: params.certified }).icrc3_get_blocks(params.args);

  /**
   * Returns the principal of the index canister for the ledger, if one was defined as such.
   *
   * @link: https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-106/ICRC-106.md
   *
   * @returns {Promise<Principal>} The principal of the index canister.
   *
   * @throws {GenericError} - For any errors that occur while fetching the index principal.
   * @throws {IndexPrincipalNotSetError} - If the index principal was not set for the ledger canister.
   */
  getIndexPrincipal = async (params: QueryParams): Promise<Principal> => {
    const { icrc106_get_index_principal } = this.caller(params);

    const response = await icrc106_get_index_principal();

    if ("Err" in response) {
      throw mapIcrc106GetIndexPrincipalError(response.Err);
    }

    return response.Ok;
  };

  /**
   * Returns the list of standards this ledger supports by using icrc1_supported_standards.
   *
   * @link: https://github.com/dfinity/ICRC-1/blob/main/standards/ICRC-1/README.md#icrc1_supported_standards
   *
   * @returns {Promise<StandardRecord[]>} The list of standards.
   */
  icrc1SupportedStandards = (
    params: QueryParams,
  ): Promise<IcrcLedgerDid.StandardRecord[]> =>
    this.caller(params).icrc1_supported_standards();

  /**
   * Returns the list of standards this ledger supports by using icrc10_supported_standards.
   *
   * @link: https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-10/ICRC-10.md#icrc10_supported_standards
   *
   * @returns {Promise<{ url: string; name: string }[]>} The list of standards.
   */
  icrc10SupportedStandards = (
    params: QueryParams,
  ): Promise<{ url: string; name: string }[]> =>
    this.caller(params).icrc10_supported_standards();

  /**
   * Returns the minting account of the Ledger canister.
   *
   * @link: https://github.com/dfinity/ICRC-1/blob/main/standards/ICRC-1/README.md#icrc1_minting_account
   *
   * @returns {Promise<Nullable<Account>>} The minting account as a Nullable object.
   */
  getMintingAccount = (
    params: QueryParams,
  ): Promise<Nullable<IcrcLedgerDid.Account>> =>
    this.caller(params).icrc1_minting_account();
}
