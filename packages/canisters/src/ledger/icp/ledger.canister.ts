import { Canister, createServices, type QueryParams } from "@dfinity/utils";
import type { Principal } from "@icp-sdk/core/principal";
import type {
  Icrc1BlockIndex,
  _SERVICE as LedgerService,
  Value,
  icrc21_consent_info,
} from "../../declarations/ledger-icp/ledger";
import { idlFactory as certifiedIdlFactory } from "../../declarations/ledger-icp/ledger.certified.idl";
import { idlFactory } from "../../declarations/ledger-icp/ledger.idl";
import {
  toIcrc1TransferRawRequest,
  toIcrc21ConsentMessageRawRequest,
  toIcrc2ApproveRawRequest,
  toTransferRawRequest,
} from "./canisters/ledger/ledger.request.converts";
import { MAINNET_LEDGER_CANISTER_ID } from "./constants/canister_ids";
import {
  mapIcrc1TransferError,
  mapIcrc21ConsentMessageError,
  mapIcrc2ApproveError,
  mapTransferError,
} from "./errors/ledger.errors";
import type { BlockHeight } from "./types/common";
import type { LedgerCanisterOptions } from "./types/ledger.options";
import type { AccountBalanceParams } from "./types/ledger.params";
import type {
  Icrc1TransferRequest,
  Icrc21ConsentMessageRequest,
  Icrc2ApproveRequest,
  TransferRequest,
} from "./types/ledger_converters";
import { paramToAccountIdentifier } from "./utils/params.utils";

export class LedgerCanister extends Canister<LedgerService> {
  public static create(options: LedgerCanisterOptions = {}) {
    const canisterId: Principal =
      options.canisterId ?? MAINNET_LEDGER_CANISTER_ID;

    const { service, certifiedService } = createServices<LedgerService>({
      options: {
        ...options,
        canisterId,
      },
      idlFactory,
      certifiedIdlFactory,
    });

    return new LedgerCanister(canisterId, service, certifiedService);
  }

  /**
   * Returns the balance of the specified account identifier.
   *
   * If `certified` is true, the request is fetched as an update call, otherwise
   * it is fetched using a query call.
   *
   * @param {AccountBalanceParams} params The parameters to get the balance of an account.
   * @param {AccountIdentifierParam} params.accountIdentifier The account identifier provided either as hex string or as an AccountIdentifier.
   * @param {boolean} params.certified query or update call.
   * @returns {Promise<bigint>} The balance of the given account.
   * @throws {@link Error}
   */
  public accountBalance = async ({
    accountIdentifier: accountIdentifierParam,
    certified = true,
  }: AccountBalanceParams): Promise<bigint> => {
    const accountIdentifier = paramToAccountIdentifier(accountIdentifierParam);

    const service = certified ? this.certifiedService : this.service;
    const tokens = await service.account_balance({
      account: accountIdentifier.toUint8Array(),
    });
    return tokens.e8s;
  };

  /**
   * Fetches the ledger metadata.
   *
   * @param {QueryParams} params - The parameters used to fetch the metadata, notably query or certified call.
   * @returns {Promise<Array<[string, Value]>>} The metadata of the ICP ledger. A promise that resolves to an array of metadata entries, where each entry is a tuple consisting of a string and a value.
   */
  metadata = (params: QueryParams): Promise<Array<[string, Value]>> => {
    const { icrc1_metadata } = this.caller(params);
    return icrc1_metadata();
  };

  /**
   * Returns the transaction fee of the ICP ledger canister.
   *
   * @param {QueryParams} [params={certified: false}] - Optional query parameters for the request, defaulting to `{ certified: false }` for backwards compatibility reason.
   * @returns {Promise<bigint>} A promise that resolves to the transaction fee as a bigint.
   */
  public transactionFee = async (
    params: QueryParams = { certified: false },
  ): Promise<bigint> => {
    const { transfer_fee } = this.caller(params);

    const {
      transfer_fee: { e8s },
    } = await transfer_fee({});

    return e8s;
  };

  /**
   * Transfer ICP from the caller to the destination `accountIdentifier`.
   * Returns the index of the block containing the tx if it was successful.
   *
   * @throws {@link TransferError}
   */
  public transfer = async (request: TransferRequest): Promise<BlockHeight> => {
    const rawRequest = toTransferRawRequest(request);
    const response = await this.certifiedService.transfer(rawRequest);
    if ("Err" in response) {
      throw mapTransferError(response.Err);
    }
    return response.Ok;
  };

  // WARNING: When using the ICRC-1 interface of the ICP ledger, there is no
  // relationship between the memo and the icrc1Memo of a transaction. The
  // ICRC-1 interface simply cannot set the memo field and the non-ICRC-1
  // interface cannot set the icrc1Memo field, even though the icrc1Memo field
  // is called just "memo" in canister method params.
  /**
   * Transfer ICP from the caller to the destination `Account`.
   * Returns the index of the block containing the tx if it was successful.
   *
   * @throws {@link TransferError}
   */
  public icrc1Transfer = async (
    request: Icrc1TransferRequest,
  ): Promise<BlockHeight> => {
    const rawRequest = toIcrc1TransferRawRequest(request);
    const response = await this.certifiedService.icrc1_transfer(rawRequest);
    if ("Err" in response) {
      throw mapIcrc1TransferError(response.Err);
    }
    return response.Ok;
  };

  /**
   * This method entitles the `spender` to transfer token `amount` on behalf of the caller from account `{ owner = caller; subaccount = from_subaccount }`.
   *
   * Reference: https://github.com/dfinity/ICRC-1/blob/main/standards/ICRC-2/README.md#icrc2_approve
   *
   * @param {Icrc2ApproveRequest} params - The parameters to approve.
   * @throws {ApproveError} If the approval fails.
   * @returns {Promise<Icrc1BlockIndex>} The block index of the approved transaction.
   */
  icrc2Approve = async (
    params: Icrc2ApproveRequest,
  ): Promise<Icrc1BlockIndex> => {
    const { icrc2_approve } = this.caller({ certified: true });

    const response = await icrc2_approve(toIcrc2ApproveRawRequest(params));

    if ("Err" in response) {
      throw mapIcrc2ApproveError(response.Err);
    }

    return response.Ok;
  };

  /**
   * Fetches the consent message for a specified canister call, intended to provide a human-readable message that helps users make informed decisions.
   *
   * @link: https://github.com/dfinity/wg-identity-authentication/blob/main/topics/ICRC-21/icrc_21_consent_msg.md
   *
   * @param {Icrc21ConsentMessageRequest} params - The request parameters containing the method name, arguments, and consent preferences (e.g., language).
   * @returns {Promise<icrc21_consent_info>} - A promise that resolves to the consent message response, which includes the consent message in the specified language and other related information.
   *
   * @throws {InsufficientPaymentError} - This error is reserved for future use, in case payment extensions are introduced. For example, if consent messages, which are currently free, begin to require payments.
   * @throws {UnsupportedCanisterCallError} - If the specified canister call is not supported.
   * @throws {ConsentMessageUnavailableError} - If there is no consent message available.
   * @throws {GenericError} - For any other generic errors.
   */
  icrc21ConsentMessage = async (
    params: Icrc21ConsentMessageRequest,
  ): Promise<icrc21_consent_info> => {
    const { icrc21_canister_call_consent_message } = this.caller({
      certified: true,
    });

    const response = await icrc21_canister_call_consent_message(
      toIcrc21ConsentMessageRawRequest(params),
    );

    if ("Err" in response) {
      throw mapIcrc21ConsentMessageError(response.Err);
    }

    return response.Ok;
  };
}
