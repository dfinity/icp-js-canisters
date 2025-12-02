import { toNullable } from "@dfinity/utils";
import type { ActorSubclass } from "@icp-sdk/core/agent";
import { Principal } from "@icp-sdk/core/principal";
import { mock } from "vitest-mock-extended";
import type { Account } from "./candid/icrc_index";
import type {
  Allowance,
  ApproveArgs,
  GetBlocksResult,
  GetIndexPrincipalResult,
  _SERVICE as IcrcLedgerService,
  TransferArg,
  TransferFromArgs,
  icrc21_consent_message_response,
} from "./candid/icrc_ledger";
import {
  ConsentMessageError,
  ConsentMessageUnavailableError,
  GenericError,
  IcrcTransferError,
  IndexPrincipalNotSetError,
  InsufficientPaymentError,
  UnsupportedCanisterCallError,
} from "./errors/ledger.errors";
import { IcrcLedgerCanister } from "./ledger.canister";
import {
  ledgerCanisterIdMock,
  mockPrincipal,
  tokenMetadataResponseMock,
} from "./mocks/ledger.mock";
import type {
  AllowanceParams,
  ApproveParams,
  Icrc21ConsentMessageParams,
  TransferFromParams,
  TransferParams,
} from "./types/ledger.params";

describe("Ledger canister", () => {
  describe("metadata", () => {
    it("should return the token metadata", async () => {
      const service = mock<ActorSubclass<IcrcLedgerService>>();
      service.icrc1_metadata.mockResolvedValue(tokenMetadataResponseMock);

      const canister = IcrcLedgerCanister.create({
        canisterId: ledgerCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const res = await canister.metadata({});

      expect(res).toEqual(tokenMetadataResponseMock);
    });
  });

  describe("transactionFee", () => {
    it("should return the transaction fee", async () => {
      const service = mock<ActorSubclass<IcrcLedgerService>>();
      const fee = BigInt(10_000);
      service.icrc1_fee.mockResolvedValue(fee);

      const canister = IcrcLedgerCanister.create({
        canisterId: ledgerCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const res = await canister.transactionFee({});

      expect(res).toEqual(fee);
    });
  });

  describe("totalTokensSupply", () => {
    it("should return the total tokens supply", async () => {
      const service = mock<ActorSubclass<IcrcLedgerService>>();
      const totalTokens = BigInt(1000_000_000_000);
      service.icrc1_total_supply.mockResolvedValue(totalTokens);

      const canister = IcrcLedgerCanister.create({
        canisterId: ledgerCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const res = await canister.totalTokensSupply({});

      expect(res).toEqual(totalTokens);
    });
  });

  describe("transfer", () => {
    const transferParams: TransferParams = {
      to: {
        owner: Principal.fromText("aaaaa-aa"),
        subaccount: [],
      },
      amount: BigInt(100_000_000),
    };
    const transferArg: TransferArg = {
      to: {
        owner: Principal.fromText("aaaaa-aa"),
        subaccount: [],
      },
      fee: [],
      memo: [],
      from_subaccount: [],
      created_at_time: [],
      amount: BigInt(100_000_000),
    };

    it("should return the block height successfully", async () => {
      const service = mock<ActorSubclass<IcrcLedgerService>>();
      const blockHeight = BigInt(100);
      service.icrc1_transfer.mockResolvedValue({ Ok: blockHeight });

      const canister = IcrcLedgerCanister.create({
        canisterId: ledgerCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const res = await canister.transfer(transferParams);

      expect(res).toEqual(blockHeight);
      expect(service.icrc1_transfer).toHaveBeenCalledWith(transferArg);
    });

    it("should raise IcrcTransferError error", async () => {
      const service = mock<ActorSubclass<IcrcLedgerService>>();
      const errorResponse = {
        Err: {
          InsufficientFunds: {
            balance: BigInt(0),
          },
        },
      };
      service.icrc1_transfer.mockResolvedValue(errorResponse);

      const canister = IcrcLedgerCanister.create({
        canisterId: ledgerCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const call = () => canister.transfer(transferParams);

      await expect(call).rejects.toThrowError(IcrcTransferError);
    });
  });

  describe("transfer-from", () => {
    const transferParams: TransferFromParams = {
      from: {
        owner: mockPrincipal,
        subaccount: [],
      },
      to: {
        owner: Principal.fromText("aaaaa-aa"),
        subaccount: [],
      },
      amount: BigInt(100_000_000),
    };
    const transferArg: TransferFromArgs = {
      from: {
        owner: mockPrincipal,
        subaccount: [],
      },
      to: {
        owner: Principal.fromText("aaaaa-aa"),
        subaccount: [],
      },
      fee: [],
      memo: [],
      spender_subaccount: [],
      created_at_time: [],
      amount: BigInt(100_000_000),
    };

    it("should return the block height successfully", async () => {
      const service = mock<ActorSubclass<IcrcLedgerService>>();
      const blockHeight = BigInt(100);
      service.icrc2_transfer_from.mockResolvedValue({ Ok: blockHeight });

      const canister = IcrcLedgerCanister.create({
        canisterId: ledgerCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const res = await canister.transferFrom(transferParams);

      expect(res).toEqual(blockHeight);
      expect(service.icrc2_transfer_from).toHaveBeenCalledWith(transferArg);
    });

    it("should raise IcrcTransferError error", async () => {
      const service = mock<ActorSubclass<IcrcLedgerService>>();
      const errorResponse = {
        Err: {
          InsufficientFunds: {
            balance: BigInt(0),
          },
        },
      };
      service.icrc2_transfer_from.mockResolvedValue(errorResponse);

      const canister = IcrcLedgerCanister.create({
        canisterId: ledgerCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const call = () => canister.transferFrom(transferParams);

      await expect(call).rejects.toThrowError(IcrcTransferError);
    });
  });

  describe("approve", () => {
    const approveParams: ApproveParams = {
      spender: {
        owner: mockPrincipal,
        subaccount: [],
      },
      amount: BigInt(100_000_000),
      expires_at: 123n,
    };
    const approveArg: ApproveArgs = {
      expected_allowance: [],
      expires_at: [123n],
      from_subaccount: [],
      spender: {
        owner: mockPrincipal,
        subaccount: [],
      },
      fee: [],
      memo: [],
      created_at_time: [],
      amount: BigInt(100_000_000),
    };

    it("should return the block height successfully", async () => {
      const service = mock<ActorSubclass<IcrcLedgerService>>();
      const blockHeight = BigInt(100);
      service.icrc2_approve.mockResolvedValue({ Ok: blockHeight });

      const canister = IcrcLedgerCanister.create({
        canisterId: ledgerCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const res = await canister.approve(approveParams);

      expect(res).toEqual(blockHeight);
      expect(service.icrc2_approve).toHaveBeenCalledWith(approveArg);
    });

    it("should raise IcrcTransferError error", async () => {
      const service = mock<ActorSubclass<IcrcLedgerService>>();
      const errorResponse = {
        Err: {
          InsufficientFunds: {
            balance: BigInt(0),
          },
        },
      };
      service.icrc2_approve.mockResolvedValue(errorResponse);

      const canister = IcrcLedgerCanister.create({
        canisterId: ledgerCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const call = () => canister.approve(approveParams);

      await expect(call).rejects.toThrowError(IcrcTransferError);
    });
  });

  describe("allowance", () => {
    const allowance: Allowance = {
      allowance: 123n,
      expires_at: [456n],
    };

    const allowanceParams: Omit<AllowanceParams, "certified"> = {
      spender: {
        owner: mockPrincipal,
        subaccount: [],
      },
      account: {
        owner: Principal.fromText("aaaaa-aa"),
        subaccount: [],
      },
    };

    it("should return the allowance", async () => {
      const service = mock<ActorSubclass<IcrcLedgerService>>();
      service.icrc2_allowance.mockResolvedValue(allowance);

      const canister = IcrcLedgerCanister.create({
        canisterId: ledgerCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const res = await canister.allowance({
        ...allowanceParams,
        certified: true,
      });

      expect(service.icrc2_allowance).toHaveBeenCalledWith(allowanceParams);
      expect(res).toEqual(allowance);
    });
  });

  describe("consentMessage", () => {
    const consentMessageRequest: Icrc21ConsentMessageParams = {
      method: "icrc1_transfer",
      arg: new Uint8Array([1, 2, 3]),
      userPreferences: {
        metadata: {
          language: "en-US",
        },
        deriveSpec: {
          GenericDisplay: null,
        },
      },
    };

    const consentMessageResponse: icrc21_consent_message_response = {
      Ok: {
        consent_message: {
          GenericDisplayMessage: "Transfer 1 ICP to account abcd",
        },
        metadata: {
          language: "en-US",
          utc_offset_minutes: [],
        },
      },
    };

    const consentMessageFieldsDisplayResponse: icrc21_consent_message_response =
      {
        Ok: {
          consent_message: {
            FieldsDisplayMessage: {
              intent: "Send ICP",
              fields: [
                [
                  "Fees",
                  {
                    TokenAmount: {
                      decimals: 10,
                      amount: 10_000n,
                      symbol: "ICP",
                    },
                  },
                ],
              ],
            },
          },
          metadata: {
            language: "en-US",
            utc_offset_minutes: [],
          },
        },
      };

    it("should fetch consent message successfully with GenericDisplayMessage", async () => {
      const service = mock<ActorSubclass<IcrcLedgerService>>();
      service.icrc21_canister_call_consent_message.mockResolvedValue(
        consentMessageResponse,
      );

      const ledger = IcrcLedgerCanister.create({
        canisterId: ledgerCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const response = await ledger.consentMessage(consentMessageRequest);

      expect(response).toEqual(consentMessageResponse.Ok);
      expect(service.icrc21_canister_call_consent_message).toHaveBeenCalledWith(
        {
          method: consentMessageRequest.method,
          arg: consentMessageRequest.arg,
          user_preferences: {
            metadata: {
              language: "en-US",
              utc_offset_minutes: [],
            },
            device_spec: [
              {
                GenericDisplay: null,
              },
            ],
          },
        },
      );
    });

    it("should fetch consent message successfully with FieldsDisplayMessage", async () => {
      const service = mock<ActorSubclass<IcrcLedgerService>>();
      service.icrc21_canister_call_consent_message.mockResolvedValue(
        consentMessageFieldsDisplayResponse,
      );

      const ledger = IcrcLedgerCanister.create({
        certifiedServiceOverride: service,
        canisterId: ledgerCanisterIdMock,
      });

      const requestWithFieldsDisplay: Icrc21ConsentMessageParams = {
        ...consentMessageRequest,
        userPreferences: {
          metadata: {
            language: "en-US",
          },
          deriveSpec: {
            FieldsDisplay: null,
          },
        },
      };

      const response = await ledger.consentMessage(requestWithFieldsDisplay);

      expect(response).toEqual(consentMessageFieldsDisplayResponse.Ok);
      expect(service.icrc21_canister_call_consent_message).toHaveBeenCalledWith(
        {
          method: requestWithFieldsDisplay.method,
          arg: requestWithFieldsDisplay.arg,
          user_preferences: {
            metadata: {
              language: "en-US",
              utc_offset_minutes: [],
            },
            device_spec: [
              {
                FieldsDisplay: null,
              },
            ],
          },
        },
      );
    });

    it("should handle UTC offset in the request", async () => {
      const service = mock<ActorSubclass<IcrcLedgerService>>();
      service.icrc21_canister_call_consent_message.mockResolvedValue(
        consentMessageResponse,
      );

      const ledger = IcrcLedgerCanister.create({
        certifiedServiceOverride: service,
        canisterId: ledgerCanisterIdMock,
      });

      const requestWithUtcOffset: Icrc21ConsentMessageParams = {
        ...consentMessageRequest,
        userPreferences: {
          metadata: {
            language: "en-US",
            utcOffsetMinutes: 120,
          },
          deriveSpec: {
            GenericDisplay: null,
          },
        },
      };

      const response = await ledger.consentMessage(requestWithUtcOffset);

      expect(response).toEqual(consentMessageResponse.Ok);
      expect(service.icrc21_canister_call_consent_message).toHaveBeenCalledWith(
        {
          method: requestWithUtcOffset.method,
          arg: requestWithUtcOffset.arg,
          user_preferences: {
            metadata: {
              language: "en-US",
              utc_offset_minutes: [120],
            },
            device_spec: [
              {
                GenericDisplay: null,
              },
            ],
          },
        },
      );
    });

    it("should throw GenericError when the canister returns a GenericError", async () => {
      const service = mock<ActorSubclass<IcrcLedgerService>>();

      const errorDescription = "An error occurred";
      const errorResponse: icrc21_consent_message_response = {
        Err: {
          GenericError: {
            description: errorDescription,
            error_code: BigInt(500),
          },
        },
      };

      service.icrc21_canister_call_consent_message.mockResolvedValue(
        errorResponse,
      );

      const ledger = IcrcLedgerCanister.create({
        certifiedServiceOverride: service,
        canisterId: ledgerCanisterIdMock,
      });

      await expect(
        ledger.consentMessage(consentMessageRequest),
      ).rejects.toThrowError(new GenericError(errorDescription, BigInt(500)));
    });

    it("should throw InsufficientPaymentError when the canister returns an InsufficientPayment error", async () => {
      const service = mock<ActorSubclass<IcrcLedgerService>>();

      const insufficientPaymentDescription = "Payment is insufficient";
      const insufficientPaymentErrorResponse: icrc21_consent_message_response =
        {
          Err: {
            InsufficientPayment: {
              description: insufficientPaymentDescription,
            },
          },
        };

      service.icrc21_canister_call_consent_message.mockResolvedValue(
        insufficientPaymentErrorResponse,
      );

      const ledger = IcrcLedgerCanister.create({
        canisterId: ledgerCanisterIdMock,
        certifiedServiceOverride: service,
      });

      await expect(
        ledger.consentMessage(consentMessageRequest),
      ).rejects.toThrowError(
        new InsufficientPaymentError(insufficientPaymentDescription),
      );
    });

    it("should throw UnsupportedCanisterCallError when the canister returns an UnsupportedCanisterCallError error", async () => {
      const service = mock<ActorSubclass<IcrcLedgerService>>();

      const unsupportedCanisterCallDescription =
        "This canister call is not supported";
      const unsupportedCanisterCallErrorResponse: icrc21_consent_message_response =
        {
          Err: {
            UnsupportedCanisterCall: {
              description: unsupportedCanisterCallDescription,
            },
          },
        };

      service.icrc21_canister_call_consent_message.mockResolvedValue(
        unsupportedCanisterCallErrorResponse,
      );

      const ledger = IcrcLedgerCanister.create({
        canisterId: ledgerCanisterIdMock,
        certifiedServiceOverride: service,
      });

      await expect(
        ledger.consentMessage(consentMessageRequest),
      ).rejects.toThrowError(
        new UnsupportedCanisterCallError(unsupportedCanisterCallDescription),
      );
    });

    it("should throw ConsentMessageUnavailableError when the canister returns an ConsentMessageUnavailableError error", async () => {
      const service = mock<ActorSubclass<IcrcLedgerService>>();

      const consentMessageUnavailableDescription =
        "Consent message is unavailable";
      const consentMessageUnavailableErrorResponse: icrc21_consent_message_response =
        {
          Err: {
            ConsentMessageUnavailable: {
              description: consentMessageUnavailableDescription,
            },
          },
        };

      service.icrc21_canister_call_consent_message.mockResolvedValue(
        consentMessageUnavailableErrorResponse,
      );

      const ledger = IcrcLedgerCanister.create({
        canisterId: ledgerCanisterIdMock,
        certifiedServiceOverride: service,
      });

      await expect(
        ledger.consentMessage(consentMessageRequest),
      ).rejects.toThrowError(
        new ConsentMessageUnavailableError(
          consentMessageUnavailableDescription,
        ),
      );
    });

    it("should throw ConsentMessageError with correct message for an unknown error type", async () => {
      const service = mock<ActorSubclass<IcrcLedgerService>>();

      const Err = {
        UnknownErrorType: {
          description: "This is an unknown error type",
        },
      };

      const unknownErrorResponse: icrc21_consent_message_response = {
        // @ts-expect-error: we are testing this on purpose
        Err,
      };

      service.icrc21_canister_call_consent_message.mockResolvedValue(
        unknownErrorResponse,
      );

      const ledger = IcrcLedgerCanister.create({
        canisterId: ledgerCanisterIdMock,
        certifiedServiceOverride: service,
      });

      await expect(
        ledger.consentMessage(consentMessageRequest),
      ).rejects.toThrowError(
        new ConsentMessageError(`Unknown error type ${JSON.stringify(Err)}`),
      );
    });
  });

  describe("getBlocks", () => {
    it("should return the blocks of the ledger canister", async () => {
      const service = mock<ActorSubclass<IcrcLedgerService>>();
      const blocks: GetBlocksResult = {
        log_length: 1234n,
        blocks: [],
        archived_blocks: [
          {
            args: [{ start: 0n, length: 1n }],
            callback: [ledgerCanisterIdMock, "icrc3_get_blocks"],
          },
        ],
      };
      service.icrc3_get_blocks.mockResolvedValue(blocks);

      const canister = IcrcLedgerCanister.create({
        canisterId: ledgerCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const res = await canister.getBlocks({
        args: [{ start: 0n, length: 1n }],
      });

      expect(service.icrc3_get_blocks).toHaveBeenCalledOnce();
      expect(service.icrc3_get_blocks).toHaveBeenNthCalledWith(1, [
        { start: 0n, length: 1n },
      ]);

      expect(res).toEqual(blocks);
    });

    it("should accept empty options", async () => {
      const service = mock<ActorSubclass<IcrcLedgerService>>();
      const blocks: GetBlocksResult = {
        log_length: 1234n,
        blocks: [],
        archived_blocks: [],
      };
      service.icrc3_get_blocks.mockResolvedValue(blocks);

      const canister = IcrcLedgerCanister.create({
        canisterId: ledgerCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const res = await canister.getBlocks({ args: [] });

      expect(service.icrc3_get_blocks).toHaveBeenCalledOnce();
      expect(service.icrc3_get_blocks).toHaveBeenNthCalledWith(1, []);

      expect(res).toEqual(blocks);
    });
  });

  describe("getIndexPrincipal", () => {
    const indexPrincipalRequest = {};

    const mockIndexPrincipal = Principal.fromText(
      "pd4vj-oqaaa-aaaar-qahwq-cai",
    );

    const indexPrincipalResponse: GetIndexPrincipalResult = {
      Ok: mockIndexPrincipal,
    };

    it("should return the index canister principal successfully", async () => {
      const service = mock<ActorSubclass<IcrcLedgerService>>();
      service.icrc106_get_index_principal.mockResolvedValue(
        indexPrincipalResponse,
      );

      const ledger = IcrcLedgerCanister.create({
        canisterId: ledgerCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const response = await ledger.getIndexPrincipal(indexPrincipalRequest);

      expect(response).toEqual(indexPrincipalResponse.Ok);
      expect(
        service.icrc106_get_index_principal,
      ).toHaveBeenCalledExactlyOnceWith();
    });

    it("should throw GenericError when the canister returns a GenericError", async () => {
      const service = mock<ActorSubclass<IcrcLedgerService>>();

      const errorDescription = "An error occurred";
      const errorResponse: GetIndexPrincipalResult = {
        Err: {
          GenericError: {
            description: errorDescription,
            error_code: BigInt(500),
          },
        },
      };

      service.icrc106_get_index_principal.mockResolvedValue(errorResponse);

      const ledger = IcrcLedgerCanister.create({
        certifiedServiceOverride: service,
        canisterId: ledgerCanisterIdMock,
      });

      await expect(
        ledger.getIndexPrincipal(indexPrincipalRequest),
      ).rejects.toThrowError(new GenericError(errorDescription, BigInt(500)));
    });

    it("should throw IndexPrincipalNotSetError when the canister returns an IndexPrincipalNotSet error", async () => {
      const service = mock<ActorSubclass<IcrcLedgerService>>();

      const indexPrincipalNotSetErrorResponse: GetIndexPrincipalResult = {
        Err: {
          IndexPrincipalNotSet: null,
        },
      };

      service.icrc106_get_index_principal.mockResolvedValue(
        indexPrincipalNotSetErrorResponse,
      );

      const ledger = IcrcLedgerCanister.create({
        canisterId: ledgerCanisterIdMock,
        certifiedServiceOverride: service,
      });

      await expect(
        ledger.getIndexPrincipal(indexPrincipalRequest),
      ).rejects.toThrowError(
        new IndexPrincipalNotSetError(
          "Index principal is not set for this ledger canister.",
        ),
      );
    });
  });

  describe("icrc1SupportedStandards", () => {
    it("should return the list of standards", async () => {
      const service = mock<ActorSubclass<IcrcLedgerService>>();
      const standards = [
        { name: "ICRC-1", url: "https://github.com/dfinity/ICRC-1" },
      ];
      service.icrc1_supported_standards.mockResolvedValue(standards);

      const canister = IcrcLedgerCanister.create({
        canisterId: ledgerCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const res = await canister.icrc1SupportedStandards({});

      expect(res).toEqual(standards);
    });
  });

  describe("icrc10SupportedStandards", () => {
    it("should return the list of standards", async () => {
      const service = mock<ActorSubclass<IcrcLedgerService>>();
      const standards = [
        {
          name: "ICRC-10",
          url: "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-10",
        },
      ];
      service.icrc10_supported_standards.mockResolvedValue(standards);

      const canister = IcrcLedgerCanister.create({
        canisterId: ledgerCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const res = await canister.icrc10SupportedStandards({});

      expect(res).toEqual(standards);
    });
  });

  describe("getMintingAccount", () => {
    it("should return the account of the minting account", async () => {
      const service = mock<ActorSubclass<IcrcLedgerService>>();
      const account: Account = {
        owner: mockPrincipal,
        subaccount: toNullable(new Uint8Array([1, 2, 3])),
      };
      service.icrc1_minting_account.mockResolvedValue(toNullable(account));

      const canister = IcrcLedgerCanister.create({
        canisterId: ledgerCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const res = await canister.getMintingAccount({});

      expect(res).toEqual(toNullable(account));
    });

    it("should return an empty nullable if the minting account is not set", async () => {
      const service = mock<ActorSubclass<IcrcLedgerService>>();
      service.icrc1_minting_account.mockResolvedValue(toNullable());

      const canister = IcrcLedgerCanister.create({
        canisterId: ledgerCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const res = await canister.getMintingAccount({});

      expect(res).toEqual(toNullable());
    });
  });
});
