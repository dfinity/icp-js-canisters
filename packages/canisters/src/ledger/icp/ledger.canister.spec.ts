import { arrayOfNumberToUint8Array } from "@dfinity/utils";
import type { ActorSubclass } from "@icp-sdk/core/agent";
import { Principal } from "@icp-sdk/core/principal";
import { mock } from "vitest-mock-extended";
import type { IcpLedgerDid, IcpLedgerService } from "../../declarations";
import { TRANSACTION_FEE } from "./constants/constants";
import {
  AllowanceChangedError,
  BadFeeError,
  ConsentMessageError,
  ConsentMessageUnavailableError,
  CreatedInFutureError,
  DuplicateError,
  ExpiredError,
  GenericError,
  InsufficientFundsError,
  InsufficientPaymentError,
  TemporarilyUnavailableError,
  TooOldError,
  TxCreatedInFutureError,
  TxDuplicateError,
  TxTooOldError,
  UnsupportedCanisterCallError,
} from "./errors/ledger.errors";
import { LedgerCanister } from "./ledger.canister";
import { mockAccountIdentifier, mockPrincipal } from "./mocks/ledger.mock";
import { mockConsentMessageRequest } from "./mocks/ledger.request.mock";
import type {
  Icrc21ConsentMessageRequest,
  Icrc2ApproveRequest,
} from "./types/ledger_converters";

describe("LedgerCanister", () => {
  describe("accountBalance", () => {
    describe("no hardware wallet", () => {
      const tokens = {
        e8s: BigInt(30_000_000),
      };

      it("returns account balance with query call", async () => {
        const service = mock<ActorSubclass<IcpLedgerService>>();
        service.account_balance.mockResolvedValue(tokens);
        const ledger = LedgerCanister.create({
          serviceOverride: service,
        });

        const balance = await ledger.accountBalance({
          accountIdentifier: mockAccountIdentifier,
          certified: false,
        });

        expect(balance).toEqual(tokens.e8s);
        expect(service.account_balance).toHaveBeenCalled();
      });

      it("returns account balance with update call", async () => {
        const service = mock<ActorSubclass<IcpLedgerService>>();
        service.account_balance.mockResolvedValue(tokens);
        const ledger = LedgerCanister.create({
          certifiedServiceOverride: service,
        });

        const balance = await ledger.accountBalance({
          accountIdentifier: mockAccountIdentifier,
          certified: true,
        });

        expect(balance).toEqual(tokens.e8s);
        expect(service.account_balance).toHaveBeenCalled();
      });

      it("returns account balance with account identifier as hex", async () => {
        const service = mock<ActorSubclass<IcpLedgerService>>();
        service.account_balance.mockResolvedValue(tokens);
        const ledger = LedgerCanister.create({
          serviceOverride: service,
        });

        const balance = await ledger.accountBalance({
          accountIdentifier: mockAccountIdentifier.toHex(),
          certified: false,
        });

        expect(balance).toEqual(tokens.e8s);
        expect(service.account_balance).toHaveBeenCalled();
      });
    });

    describe("metadata", () => {
      it("should return the token metadata", async () => {
        const tokeMetadataResponseMock: Array<[string, IcpLedgerDid.Value]> = [
          ["icrc1:decimals", { Nat: BigInt(8) }],
          ["icrc1:name", { Text: "Beta Test" }],
          ["icrc1:symbol", { Text: "ICP" }],
          ["icrc1:fee", { Nat: BigInt(1000) }],
        ];

        const service = mock<ActorSubclass<IcpLedgerService>>();
        service.icrc1_metadata.mockResolvedValue(tokeMetadataResponseMock);

        const canister = LedgerCanister.create({
          certifiedServiceOverride: service,
        });

        const res = await canister.metadata({});

        expect(res).toEqual(tokeMetadataResponseMock);
      });
    });

    describe("transactionFee", () => {
      it("returns the transaction fee in e8s", async () => {
        const fee = BigInt(10_000);
        const service = mock<ActorSubclass<IcpLedgerService>>();
        service.transfer_fee.mockResolvedValue({
          transfer_fee: {
            e8s: fee,
          },
        });
        const ledger = LedgerCanister.create({
          serviceOverride: service,
        });

        const expectedFee = await ledger.transactionFee();

        expect(service.transfer_fee).toHaveBeenCalled();
        expect(expectedFee).toBe(fee);
      });
    });
  });

  describe("transfer", () => {
    describe("no hardware wallet", () => {
      const to = mockAccountIdentifier;
      const amount = BigInt(100000);

      it("uses default transaction fee if not present", async () => {
        const service = mock<ActorSubclass<IcpLedgerService>>();
        service.transfer.mockResolvedValue({
          Ok: BigInt(1234),
        });
        const ledger = LedgerCanister.create({
          certifiedServiceOverride: service,
          serviceOverride: service,
        });
        await ledger.transfer({
          to,
          amount,
        });

        expect(service.transfer_fee).not.toHaveBeenCalled();
        expect(service.transfer).toHaveBeenCalledExactlyOnceWith({
          amount: { e8s: amount },
          created_at_time: [],
          fee: { e8s: TRANSACTION_FEE },
          from_subaccount: [],
          memo: 0n,
          to: to.toUint8Array(),
        });
      });

      it("calls transfer certified service with data", async () => {
        const service = mock<ActorSubclass<IcpLedgerService>>();
        service.transfer.mockResolvedValue({
          Ok: BigInt(1234),
        });
        const fee = BigInt(10_000);
        const memo = BigInt(3456);
        const ledger = LedgerCanister.create({
          certifiedServiceOverride: service,
        });
        await ledger.transfer({
          to,
          amount,
          fee,
          memo,
        });

        expect(service.transfer).toHaveBeenCalledWith({
          to: to.toUint8Array(),
          fee: {
            e8s: fee,
          },
          amount: {
            e8s: amount,
          },
          memo,
          created_at_time: [],
          from_subaccount: [],
        });
      });

      it("sets a default memo if not passed", async () => {
        const service = mock<ActorSubclass<IcpLedgerService>>();
        service.transfer.mockResolvedValue({
          Ok: BigInt(1234),
        });
        const fee = BigInt(10_000);
        const defaultMemo = BigInt(0);
        const ledger = LedgerCanister.create({
          certifiedServiceOverride: service,
        });
        await ledger.transfer({
          to,
          amount,
          fee,
        });

        expect(service.transfer).toHaveBeenCalledWith({
          to: to.toUint8Array(),
          fee: {
            e8s: fee,
          },
          amount: {
            e8s: amount,
          },
          memo: defaultMemo,
          created_at_time: [],
          from_subaccount: [],
        });
      });

      it("handles createdAt parameter", async () => {
        const service = mock<ActorSubclass<IcpLedgerService>>();
        service.transfer.mockResolvedValue({
          Ok: BigInt(1234),
        });
        const fee = BigInt(10_000);
        const memo = BigInt(3456);
        const ledger = LedgerCanister.create({
          certifiedServiceOverride: service,
        });
        const createdAt = BigInt(123132223);
        await ledger.transfer({
          to,
          amount,
          fee,
          memo,
          createdAt,
        });

        expect(service.transfer).toHaveBeenCalledWith({
          to: to.toUint8Array(),
          fee: {
            e8s: fee,
          },
          amount: {
            e8s: amount,
          },
          memo,
          created_at_time: [{ timestamp_nanos: createdAt }],
          from_subaccount: [],
        });
      });

      it("handles subaccount", async () => {
        const service = mock<ActorSubclass<IcpLedgerService>>();
        service.transfer.mockResolvedValue({
          Ok: BigInt(1234),
        });
        const fee = BigInt(10_000);
        const memo = BigInt(0);
        const fromSubAccount = [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 1,
        ];
        const ledger = LedgerCanister.create({
          certifiedServiceOverride: service,
        });
        await ledger.transfer({
          to,
          amount,
          fee,
          memo,
          fromSubAccount,
        });

        expect(service.transfer).toHaveBeenCalledWith({
          to: to.toUint8Array(),
          fee: {
            e8s: fee,
          },
          amount: {
            e8s: amount,
          },
          memo,
          created_at_time: [],
          from_subaccount: [arrayOfNumberToUint8Array(fromSubAccount)],
        });
      });

      it("handles duplicate transaction", async () => {
        const service = mock<ActorSubclass<IcpLedgerService>>();
        service.transfer.mockResolvedValue({
          Err: {
            TxDuplicate: {
              duplicate_of: BigInt(10),
            },
          },
        });
        const ledger = LedgerCanister.create({
          certifiedServiceOverride: service,
          serviceOverride: service,
        });
        const call = async () =>
          await ledger.transfer({
            to,
            amount,
            fee: BigInt(10_000),
          });

        await expect(call).rejects.toThrowError(TxDuplicateError);
      });

      it("handles insufficient balance", async () => {
        const service = mock<ActorSubclass<IcpLedgerService>>();
        service.transfer.mockResolvedValue({
          Err: {
            InsufficientFunds: {
              balance: {
                e8s: BigInt(12312414),
              },
            },
          },
        });
        const ledger = LedgerCanister.create({
          certifiedServiceOverride: service,
          serviceOverride: service,
        });
        const call = async () =>
          await ledger.transfer({
            to,
            amount,
            fee: BigInt(10_000),
          });

        await expect(call).rejects.toThrowError(InsufficientFundsError);
      });

      it("handles old tx", async () => {
        const service = mock<ActorSubclass<IcpLedgerService>>();
        service.transfer.mockResolvedValue({
          Err: {
            TxTooOld: {
              allowed_window_nanos: BigInt(1234),
            },
          },
        });
        const ledger = LedgerCanister.create({
          certifiedServiceOverride: service,
          serviceOverride: service,
        });
        const call = async () =>
          await ledger.transfer({
            to,
            amount,
            fee: BigInt(10_000),
          });

        await expect(call).rejects.toThrowError(TxTooOldError);
      });

      it("handles bad fee", async () => {
        const service = mock<ActorSubclass<IcpLedgerService>>();
        service.transfer.mockResolvedValue({
          Err: {
            BadFee: {
              expected_fee: {
                e8s: BigInt(1234),
              },
            },
          },
        });
        const ledger = LedgerCanister.create({
          certifiedServiceOverride: service,
          serviceOverride: service,
        });
        const call = async () =>
          await ledger.transfer({
            to,
            amount,
            fee: BigInt(10_000),
          });

        await expect(call).rejects.toThrowError(BadFeeError);
      });

      it("handles transaction created in the future", async () => {
        const service = mock<ActorSubclass<IcpLedgerService>>();
        service.transfer.mockResolvedValue({
          Err: {
            TxCreatedInFuture: null,
          },
        });
        const ledger = LedgerCanister.create({
          certifiedServiceOverride: service,
          serviceOverride: service,
        });
        const call = async () =>
          await ledger.transfer({
            to,
            amount,
            fee: BigInt(10_000),
          });

        await expect(call).rejects.toThrowError(TxCreatedInFutureError);
      });
    });
  });

  describe("icrc1Transfer", () => {
    describe("no hardware wallet", () => {
      const to = {
        owner: Principal.fromHex("abcd"),
        subaccount: [] as [],
      };
      const amount = BigInt(100000);

      it("uses default transaction fee if not present", async () => {
        const service = mock<ActorSubclass<IcpLedgerService>>();
        service.icrc1_transfer.mockResolvedValue({
          Ok: BigInt(1234),
        });
        const ledger = LedgerCanister.create({
          certifiedServiceOverride: service,
          serviceOverride: service,
        });
        await ledger.icrc1Transfer({
          to,
          amount,
        });

        expect(service.transfer_fee).not.toHaveBeenCalled();
        expect(service.icrc1_transfer).toHaveBeenCalledExactlyOnceWith({
          amount,
          created_at_time: [],
          fee: [TRANSACTION_FEE],
          from_subaccount: [],
          memo: [],
          to,
        });
      });

      it("calls transfer certified service with data", async () => {
        const service = mock<ActorSubclass<IcpLedgerService>>();
        service.icrc1_transfer.mockResolvedValue({
          Ok: BigInt(1234),
        });
        const fee = BigInt(10_000);
        const icrc1Memo = new Uint8Array([3, 4, 5, 6]);
        const ledger = LedgerCanister.create({
          certifiedServiceOverride: service,
        });
        await ledger.icrc1Transfer({
          to,
          amount,
          fee,
          icrc1Memo,
        });

        expect(service.icrc1_transfer).toHaveBeenCalledWith({
          to,
          fee: [fee],
          amount,
          memo: [icrc1Memo],
          created_at_time: [],
          from_subaccount: [],
        });
      });

      it("sets a default memo if not passed", async () => {
        const service = mock<ActorSubclass<IcpLedgerService>>();
        service.icrc1_transfer.mockResolvedValue({
          Ok: BigInt(1234),
        });
        const fee = BigInt(10_000);
        const ledger = LedgerCanister.create({
          certifiedServiceOverride: service,
        });
        await ledger.icrc1Transfer({
          to,
          amount,
          fee,
        });

        expect(service.icrc1_transfer).toHaveBeenCalledWith({
          to,
          fee: [fee],
          amount,
          memo: [],
          created_at_time: [],
          from_subaccount: [],
        });
      });

      it("handles createdAt parameter", async () => {
        const service = mock<ActorSubclass<IcpLedgerService>>();
        service.icrc1_transfer.mockResolvedValue({
          Ok: BigInt(1234),
        });
        const fee = BigInt(10_000);
        const icrc1Memo = new Uint8Array([3, 4, 5, 6]);
        const ledger = LedgerCanister.create({
          certifiedServiceOverride: service,
        });
        const createdAt = BigInt(123132223);
        await ledger.icrc1Transfer({
          to,
          amount,
          fee,
          icrc1Memo,
          createdAt,
        });

        expect(service.icrc1_transfer).toHaveBeenCalledWith({
          to,
          fee: [fee],
          amount,
          memo: [icrc1Memo],
          created_at_time: [createdAt],
          from_subaccount: [],
        });
      });

      it("handles from subaccount", async () => {
        const service = mock<ActorSubclass<IcpLedgerService>>();
        service.icrc1_transfer.mockResolvedValue({
          Ok: BigInt(1234),
        });
        const fee = BigInt(10_000);
        const icrc1Memo = new Uint8Array();
        const fromSubAccount = new Uint8Array([
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 1,
        ]);
        const ledger = LedgerCanister.create({
          certifiedServiceOverride: service,
        });
        await ledger.icrc1Transfer({
          to,
          amount,
          fee,
          icrc1Memo,
          fromSubAccount,
        });

        expect(service.icrc1_transfer).toHaveBeenCalledWith({
          to,
          fee: [fee],
          amount,
          memo: [icrc1Memo],
          created_at_time: [],
          from_subaccount: [fromSubAccount],
        });
      });

      it("handles to subaccount", async () => {
        const service = mock<ActorSubclass<IcpLedgerService>>();
        service.icrc1_transfer.mockResolvedValue({
          Ok: BigInt(1234),
        });
        const fee = BigInt(10_000);
        const icrc1Memo = new Uint8Array();
        const toSubAccount = new Uint8Array([
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 1,
        ]);
        const ledger = LedgerCanister.create({
          certifiedServiceOverride: service,
        });
        await ledger.icrc1Transfer({
          to: {
            ...to,
            subaccount: [toSubAccount],
          },
          amount,
          fee,
          icrc1Memo,
        });

        expect(service.icrc1_transfer).toHaveBeenCalledWith({
          to: {
            ...to,
            subaccount: [toSubAccount],
          },
          fee: [fee],
          amount,
          memo: [icrc1Memo],
          created_at_time: [],
          from_subaccount: [],
        });
      });

      it("handles duplicate transaction", async () => {
        const service = mock<ActorSubclass<IcpLedgerService>>();
        service.icrc1_transfer.mockResolvedValue({
          Err: {
            Duplicate: {
              duplicate_of: BigInt(10),
            },
          },
        });
        const ledger = LedgerCanister.create({
          certifiedServiceOverride: service,
          serviceOverride: service,
        });
        const call = async () =>
          await ledger.icrc1Transfer({
            to,
            amount,
            fee: BigInt(10_000),
          });

        await expect(call).rejects.toThrowError(TxDuplicateError);
      });

      it("handles insufficient balance", async () => {
        const service = mock<ActorSubclass<IcpLedgerService>>();
        service.icrc1_transfer.mockResolvedValue({
          Err: {
            InsufficientFunds: {
              balance: BigInt(12312414),
            },
          },
        });
        const ledger = LedgerCanister.create({
          certifiedServiceOverride: service,
          serviceOverride: service,
        });
        const call = async () =>
          await ledger.icrc1Transfer({
            to,
            amount,
            fee: BigInt(10_000),
          });

        await expect(call).rejects.toThrowError(InsufficientFundsError);
      });

      it("handles old tx", async () => {
        const service = mock<ActorSubclass<IcpLedgerService>>();
        service.icrc1_transfer.mockResolvedValue({
          Err: {
            TooOld: null,
          },
        });
        const ledger = LedgerCanister.create({
          certifiedServiceOverride: service,
          serviceOverride: service,
        });
        const call = async () =>
          await ledger.icrc1Transfer({
            to,
            amount,
            fee: BigInt(10_000),
          });

        await expect(call).rejects.toThrowError(TxTooOldError);
      });

      it("handles bad fee", async () => {
        const service = mock<ActorSubclass<IcpLedgerService>>();
        service.icrc1_transfer.mockResolvedValue({
          Err: {
            BadFee: {
              expected_fee: BigInt(1234),
            },
          },
        });
        const ledger = LedgerCanister.create({
          certifiedServiceOverride: service,
          serviceOverride: service,
        });
        const call = async () =>
          await ledger.icrc1Transfer({
            to,
            amount,
            fee: BigInt(10_000),
          });

        await expect(call).rejects.toThrowError(BadFeeError);
      });

      it("handles transaction created in the future", async () => {
        const service = mock<ActorSubclass<IcpLedgerService>>();
        service.icrc1_transfer.mockResolvedValue({
          Err: {
            CreatedInFuture: { ledger_time: BigInt(1234) },
          },
        });
        const ledger = LedgerCanister.create({
          certifiedServiceOverride: service,
          serviceOverride: service,
        });
        const call = async () =>
          await ledger.icrc1Transfer({
            to,
            amount,
            fee: BigInt(10_000),
          });

        await expect(call).rejects.toThrowError(TxCreatedInFutureError);
      });
    });
  });

  describe("icrc2Approve", () => {
    const approveRequest: Icrc2ApproveRequest = {
      spender: {
        owner: mockPrincipal,
        subaccount: [],
      },
      amount: BigInt(100_000_000),
      expires_at: 123n,
    };

    const approveRawRequest: IcpLedgerDid.ApproveArgs = {
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
      const service = mock<ActorSubclass<IcpLedgerService>>();
      const blockHeight = BigInt(100);
      service.icrc2_approve.mockResolvedValue({ Ok: blockHeight });

      const ledger = LedgerCanister.create({
        certifiedServiceOverride: service,
      });

      const res = await ledger.icrc2Approve(approveRequest);

      expect(res).toEqual(blockHeight);
      expect(service.icrc2_approve).toHaveBeenCalledWith({
        ...approveRawRequest,
        fee: [TRANSACTION_FEE],
      });
    });

    it("should call approve with default fee", async () => {
      const service = mock<ActorSubclass<IcpLedgerService>>();
      const blockHeight = BigInt(100);
      service.icrc2_approve.mockResolvedValue({ Ok: blockHeight });

      const ledger = LedgerCanister.create({
        certifiedServiceOverride: service,
      });

      const res = await ledger.icrc2Approve(approveRequest);

      expect(res).toEqual(blockHeight);
      expect(service.icrc2_approve).toHaveBeenCalledWith({
        ...approveRawRequest,
        fee: [TRANSACTION_FEE],
      });
    });

    it("should call approve with custom fee", async () => {
      const service = mock<ActorSubclass<IcpLedgerService>>();
      const blockHeight = BigInt(100);
      service.icrc2_approve.mockResolvedValue({ Ok: blockHeight });

      const ledger = LedgerCanister.create({
        certifiedServiceOverride: service,
      });

      const res = await ledger.icrc2Approve({
        ...approveRequest,
        fee: 123n,
      });

      expect(res).toEqual(blockHeight);
      expect(service.icrc2_approve).toHaveBeenCalledWith({
        ...approveRawRequest,
        fee: [123n],
      });
    });

    it("should call approve with memo", async () => {
      const service = mock<ActorSubclass<IcpLedgerService>>();
      const blockHeight = BigInt(100);
      service.icrc2_approve.mockResolvedValue({ Ok: blockHeight });

      const ledger = LedgerCanister.create({
        certifiedServiceOverride: service,
      });

      const icrc1Memo = arrayOfNumberToUint8Array([1, 2, 3, 4, 5]);

      const res = await ledger.icrc2Approve({
        ...approveRequest,
        icrc1Memo,
      });

      expect(res).toEqual(blockHeight);
      expect(service.icrc2_approve).toHaveBeenCalledWith({
        ...approveRawRequest,
        fee: [TRANSACTION_FEE],
        memo: [icrc1Memo],
      });
    });

    it("should call approve with created at", async () => {
      const service = mock<ActorSubclass<IcpLedgerService>>();
      const blockHeight = BigInt(100);
      service.icrc2_approve.mockResolvedValue({ Ok: blockHeight });

      const ledger = LedgerCanister.create({
        certifiedServiceOverride: service,
      });

      const res = await ledger.icrc2Approve({
        ...approveRequest,
        createdAt: 456n,
      });

      expect(res).toEqual(blockHeight);
      expect(service.icrc2_approve).toHaveBeenCalledWith({
        ...approveRawRequest,
        fee: [TRANSACTION_FEE],
        created_at_time: [456n],
      });
    });

    it("should call approve with expected allowance", async () => {
      const service = mock<ActorSubclass<IcpLedgerService>>();
      const blockHeight = BigInt(100);
      service.icrc2_approve.mockResolvedValue({ Ok: blockHeight });

      const ledger = LedgerCanister.create({
        certifiedServiceOverride: service,
      });

      const res = await ledger.icrc2Approve({
        ...approveRequest,
        expected_allowance: 999n,
      });

      expect(res).toEqual(blockHeight);
      expect(service.icrc2_approve).toHaveBeenCalledWith({
        ...approveRawRequest,
        fee: [TRANSACTION_FEE],
        expected_allowance: [999n],
      });
    });

    it("should call approve with a from subaccount", async () => {
      const service = mock<ActorSubclass<IcpLedgerService>>();
      const blockHeight = BigInt(100);
      service.icrc2_approve.mockResolvedValue({ Ok: blockHeight });

      const ledger = LedgerCanister.create({
        certifiedServiceOverride: service,
      });

      const res = await ledger.icrc2Approve({
        ...approveRequest,
        fromSubAccount: arrayOfNumberToUint8Array([4, 3, 2, 1]),
      });

      expect(res).toEqual(blockHeight);
      expect(service.icrc2_approve).toHaveBeenCalledWith({
        ...approveRawRequest,
        fee: [TRANSACTION_FEE],
        from_subaccount: [arrayOfNumberToUint8Array([4, 3, 2, 1])],
      });
    });

    it("should call approve with a spender with subaccount", async () => {
      const service = mock<ActorSubclass<IcpLedgerService>>();
      const blockHeight = BigInt(100);
      service.icrc2_approve.mockResolvedValue({ Ok: blockHeight });

      const ledger = LedgerCanister.create({
        certifiedServiceOverride: service,
      });

      const spender: IcpLedgerDid.Account = {
        owner: mockPrincipal,
        subaccount: [arrayOfNumberToUint8Array([9, 8, 7, 6])],
      };

      const res = await ledger.icrc2Approve({
        ...approveRequest,
        spender,
      });

      expect(res).toEqual(blockHeight);
      expect(service.icrc2_approve).toHaveBeenCalledWith({
        ...approveRawRequest,
        fee: [TRANSACTION_FEE],
        spender,
      });
    });

    it("should raise GenericError", async () => {
      const service = mock<ActorSubclass<IcpLedgerService>>();
      service.icrc2_approve.mockResolvedValue({
        Err: {
          GenericError: { message: "This is a test", error_code: 123n },
        },
      });

      const ledger = LedgerCanister.create({
        certifiedServiceOverride: service,
        serviceOverride: service,
      });

      const call = async () => await ledger.icrc2Approve(approveRequest);

      await expect(call).rejects.toThrowError(GenericError);
    });

    it("should raise TemporarilyUnavailableError", async () => {
      const service = mock<ActorSubclass<IcpLedgerService>>();
      service.icrc2_approve.mockResolvedValue({
        Err: {
          TemporarilyUnavailable: null,
        },
      });

      const ledger = LedgerCanister.create({
        certifiedServiceOverride: service,
        serviceOverride: service,
      });

      const call = async () => await ledger.icrc2Approve(approveRequest);

      await expect(call).rejects.toThrowError(TemporarilyUnavailableError);
    });

    it("should raise DuplicateError", async () => {
      const service = mock<ActorSubclass<IcpLedgerService>>();
      service.icrc2_approve.mockResolvedValue({
        Err: {
          Duplicate: { duplicate_of: 888n },
        },
      });

      const ledger = LedgerCanister.create({
        certifiedServiceOverride: service,
        serviceOverride: service,
      });

      const call = async () => await ledger.icrc2Approve(approveRequest);

      await expect(call).rejects.toThrowError(DuplicateError);
    });

    it("should raise BadFeeError", async () => {
      const service = mock<ActorSubclass<IcpLedgerService>>();
      service.icrc2_approve.mockResolvedValue({
        Err: {
          BadFee: { expected_fee: 666n },
        },
      });

      const ledger = LedgerCanister.create({
        certifiedServiceOverride: service,
        serviceOverride: service,
      });

      const call = async () => await ledger.icrc2Approve(approveRequest);

      await expect(call).rejects.toThrowError(BadFeeError);
    });

    it("should raise AllowanceChangedError", async () => {
      const service = mock<ActorSubclass<IcpLedgerService>>();
      service.icrc2_approve.mockResolvedValue({
        Err: {
          AllowanceChanged: { current_allowance: 444n },
        },
      });

      const ledger = LedgerCanister.create({
        certifiedServiceOverride: service,
        serviceOverride: service,
      });

      const call = async () => await ledger.icrc2Approve(approveRequest);

      await expect(call).rejects.toThrowError(AllowanceChangedError);
    });

    it("should raise CreatedInFutureError", async () => {
      const service = mock<ActorSubclass<IcpLedgerService>>();
      service.icrc2_approve.mockResolvedValue({
        Err: {
          CreatedInFuture: { ledger_time: BigInt(1234) },
        },
      });

      const ledger = LedgerCanister.create({
        certifiedServiceOverride: service,
        serviceOverride: service,
      });

      const call = async () => await ledger.icrc2Approve(approveRequest);

      await expect(call).rejects.toThrowError(CreatedInFutureError);
    });

    it("should raise TooOldError", async () => {
      const service = mock<ActorSubclass<IcpLedgerService>>();
      service.icrc2_approve.mockResolvedValue({
        Err: {
          TooOld: null,
        },
      });

      const ledger = LedgerCanister.create({
        certifiedServiceOverride: service,
        serviceOverride: service,
      });

      const call = async () => await ledger.icrc2Approve(approveRequest);

      await expect(call).rejects.toThrowError(TooOldError);
    });

    it("should raise ExpiredError", async () => {
      const service = mock<ActorSubclass<IcpLedgerService>>();
      service.icrc2_approve.mockResolvedValue({
        Err: {
          Expired: { ledger_time: BigInt(1234) },
        },
      });

      const ledger = LedgerCanister.create({
        certifiedServiceOverride: service,
        serviceOverride: service,
      });

      const call = async () => await ledger.icrc2Approve(approveRequest);

      await expect(call).rejects.toThrowError(ExpiredError);
    });

    it("should raise InsufficientFundsError", async () => {
      const service = mock<ActorSubclass<IcpLedgerService>>();
      service.icrc2_approve.mockResolvedValue({
        Err: {
          InsufficientFunds: { balance: 333888n },
        },
      });

      const ledger = LedgerCanister.create({
        certifiedServiceOverride: service,
        serviceOverride: service,
      });

      const call = async () => await ledger.icrc2Approve(approveRequest);

      await expect(call).rejects.toThrowError(InsufficientFundsError);
    });
  });

  describe("icrc21ConsentMessage", () => {
    const consentMessageResponse: IcpLedgerDid.icrc21_consent_message_response =
      {
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

    const consentMessageFieldsDisplayResponse: IcpLedgerDid.icrc21_consent_message_response =
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
      const service = mock<ActorSubclass<IcpLedgerService>>();
      service.icrc21_canister_call_consent_message.mockResolvedValue(
        consentMessageResponse,
      );

      const ledger = LedgerCanister.create({
        certifiedServiceOverride: service,
      });

      const response = await ledger.icrc21ConsentMessage(
        mockConsentMessageRequest,
      );

      expect(response).toEqual(consentMessageResponse.Ok);
      expect(service.icrc21_canister_call_consent_message).toHaveBeenCalledWith(
        {
          method: mockConsentMessageRequest.method,
          arg: mockConsentMessageRequest.arg,
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
      const service = mock<ActorSubclass<IcpLedgerService>>();
      service.icrc21_canister_call_consent_message.mockResolvedValue(
        consentMessageFieldsDisplayResponse,
      );

      const ledger = LedgerCanister.create({
        certifiedServiceOverride: service,
      });

      const requestWithFieldsDisplay: Icrc21ConsentMessageRequest = {
        ...mockConsentMessageRequest,
        userPreferences: {
          metadata: {
            language: "en-US",
          },
          deriveSpec: {
            FieldsDisplay: null,
          },
        },
      };

      const response = await ledger.icrc21ConsentMessage(
        requestWithFieldsDisplay,
      );

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
      const service = mock<ActorSubclass<IcpLedgerService>>();
      service.icrc21_canister_call_consent_message.mockResolvedValue(
        consentMessageResponse,
      );

      const ledger = LedgerCanister.create({
        certifiedServiceOverride: service,
      });

      const requestWithUtcOffset: Icrc21ConsentMessageRequest = {
        ...mockConsentMessageRequest,
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

      const response = await ledger.icrc21ConsentMessage(requestWithUtcOffset);

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
      const service = mock<ActorSubclass<IcpLedgerService>>();

      const errorDescription = "An error occurred";
      const errorResponse: IcpLedgerDid.icrc21_consent_message_response = {
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

      const ledger = LedgerCanister.create({
        certifiedServiceOverride: service,
      });

      await expect(
        ledger.icrc21ConsentMessage(mockConsentMessageRequest),
      ).rejects.toThrowError(new GenericError(errorDescription, BigInt(500)));
    });

    it("should throw InsufficientPaymentError when the canister returns an InsufficientPayment error", async () => {
      const service = mock<ActorSubclass<IcpLedgerService>>();

      const insufficientPaymentDescription = "Payment is insufficient";
      const insufficientPaymentErrorResponse: IcpLedgerDid.icrc21_consent_message_response =
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

      const ledger = LedgerCanister.create({
        certifiedServiceOverride: service,
      });

      await expect(
        ledger.icrc21ConsentMessage(mockConsentMessageRequest),
      ).rejects.toThrowError(
        new InsufficientPaymentError(insufficientPaymentDescription),
      );
    });

    it("should throw UnsupportedCanisterCallError when the canister returns an UnsupportedCanisterCallError error", async () => {
      const service = mock<ActorSubclass<IcpLedgerService>>();

      const unsupportedCanisterCallDescription =
        "This canister call is not supported";
      const unsupportedCanisterCallErrorResponse: IcpLedgerDid.icrc21_consent_message_response =
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

      const ledger = LedgerCanister.create({
        certifiedServiceOverride: service,
      });

      await expect(
        ledger.icrc21ConsentMessage(mockConsentMessageRequest),
      ).rejects.toThrowError(
        new UnsupportedCanisterCallError(unsupportedCanisterCallDescription),
      );
    });

    it("should throw ConsentMessageUnavailableError when the canister returns an ConsentMessageUnavailableError error", async () => {
      const service = mock<ActorSubclass<IcpLedgerService>>();

      const consentMessageUnavailableDescription =
        "Consent message is unavailable";
      const consentMessageUnavailableErrorResponse: IcpLedgerDid.icrc21_consent_message_response =
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

      const ledger = LedgerCanister.create({
        certifiedServiceOverride: service,
      });

      await expect(
        ledger.icrc21ConsentMessage(mockConsentMessageRequest),
      ).rejects.toThrowError(
        new ConsentMessageUnavailableError(
          consentMessageUnavailableDescription,
        ),
      );
    });

    it("should throw ConsentMessageError with correct message for an unknown error type", async () => {
      const service = mock<ActorSubclass<IcpLedgerService>>();

      const Err = {
        UnknownErrorType: {
          description: "This is an unknown error type",
        },
      };

      const unknownErrorResponse: IcpLedgerDid.icrc21_consent_message_response =
        {
          // @ts-expect-error: we are testing this on purpose
          Err,
        };

      service.icrc21_canister_call_consent_message.mockResolvedValue(
        unknownErrorResponse,
      );

      const ledger = LedgerCanister.create({
        certifiedServiceOverride: service,
      });

      await expect(
        ledger.icrc21ConsentMessage(mockConsentMessageRequest),
      ).rejects.toThrowError(
        new ConsentMessageError(`Unknown error type ${JSON.stringify(Err)}`),
      );
    });
  });
});
