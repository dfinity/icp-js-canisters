import { arrayOfNumberToUint8Array, toNullable } from "@dfinity/utils";
import { Principal } from "@icp-sdk/core/principal";
import { mockAccountIdentifier } from "../../mocks/ledger.mock";
import { mockConsentMessageRequest } from "../../mocks/ledger.request.mock";
import type {
  Icrc1TransferRequest,
  Icrc2ApproveRequest,
  TransferRequest,
} from "../../types/ledger_converters";
import {
  toIcrc1TransferRawRequest,
  toIcrc21ConsentMessageRawRequest,
  toIcrc2ApproveRawRequest,
  toTransferRawRequest,
} from "./ledger.request.converts";

describe("ledger.request.converts", () => {
  const now = BigInt(Date.now()) * BigInt(1e6);

  const mockTransferRequest: TransferRequest = {
    to: mockAccountIdentifier,
    amount: 123n,
    memo: 456n,
    fee: 10_000n,
    fromSubAccount: [0, 1, 2],
    createdAt: now,
  };

  const to = {
    owner: Principal.fromHex("abcd"),
    subaccount: [] as [],
  };

  const mockIcrc1TransferRequest: Icrc1TransferRequest = {
    to,
    fromSubAccount: arrayOfNumberToUint8Array([0, 1, 2]),
    amount: 1_000_000n,
    fee: 11_000n,
    icrc1Memo: new Uint8Array([1, 2, 3]),
    createdAt: now,
  };

  const mockIcrc2ApproveRequest: Icrc2ApproveRequest = {
    spender: to,
    fromSubAccount: arrayOfNumberToUint8Array([0, 1, 2]),
    expected_allowance: 5_000n,
    expires_at: now + 200n,
    amount: 1_200_000n,
    fee: 12_000n,
    icrc1Memo: new Uint8Array([1, 2, 3]),
    createdAt: now,
  };

  it("toTransferRawRequest should return a valid raw request", () => {
    const result = toTransferRawRequest(mockTransferRequest);

    expect(result.to).toEqual(mockTransferRequest.to.toUint8Array());
    expect(result.fee).toEqual({ e8s: mockTransferRequest.fee });
    expect(result.amount).toEqual({ e8s: mockTransferRequest.amount });
    expect(result.memo).toEqual(mockTransferRequest.memo);
    expect(result.created_at_time).toEqual([
      { timestamp_nanos: mockTransferRequest.createdAt },
    ]);
    expect(result.from_subaccount).toEqual([
      new Uint8Array(mockTransferRequest.fromSubAccount ?? []),
    ]);
  });

  it("toIcrc1TransferRawRequest should return a valid ICRC-1 raw request", () => {
    const result = toIcrc1TransferRawRequest(mockIcrc1TransferRequest);

    expect(result.to).toEqual(mockIcrc1TransferRequest.to);
    expect(result.fee).toEqual(toNullable(mockIcrc1TransferRequest.fee));
    expect(result.amount).toEqual(mockIcrc1TransferRequest.amount);
    expect(result.memo).toEqual(toNullable(mockIcrc1TransferRequest.icrc1Memo));
    expect(result.created_at_time).toEqual(
      toNullable(mockIcrc1TransferRequest.createdAt),
    );
    expect(result.from_subaccount).toEqual(
      toNullable(mockIcrc1TransferRequest.fromSubAccount),
    );
  });

  it("toIcrc2ApproveRawRequest should return a valid ICRC-2 raw request", () => {
    const result = toIcrc2ApproveRawRequest(mockIcrc2ApproveRequest);

    expect(result.spender).toEqual(mockIcrc2ApproveRequest.spender);
    expect(result.fee).toEqual(toNullable(mockIcrc2ApproveRequest.fee));
    expect(result.memo).toEqual(toNullable(mockIcrc2ApproveRequest.icrc1Memo));
    expect(result.created_at_time).toEqual(
      toNullable(mockIcrc2ApproveRequest.createdAt),
    );
    expect(result.amount).toEqual(mockIcrc2ApproveRequest.amount);
    expect(result.expected_allowance).toEqual(
      toNullable(mockIcrc2ApproveRequest.expected_allowance),
    );
    expect(result.expires_at).toEqual(
      toNullable(mockIcrc2ApproveRequest.expires_at),
    );
    expect(result.from_subaccount).toEqual(
      toNullable(mockIcrc2ApproveRequest.fromSubAccount),
    );
  });

  it("toIcrc21ConsentMessageRawRequest should return a valid ICRC-21 generic consent message request", () => {
    const result = toIcrc21ConsentMessageRawRequest(mockConsentMessageRequest);

    expect(result.method).toEqual(mockConsentMessageRequest.method);
    expect(result.arg).toEqual(mockConsentMessageRequest.arg);
    expect(result.user_preferences.metadata.language).toEqual(
      mockConsentMessageRequest.userPreferences.metadata.language,
    );
    expect(result.user_preferences.metadata.utc_offset_minutes).toEqual(
      toNullable(
        mockConsentMessageRequest.userPreferences.metadata.utcOffsetMinutes,
      ),
    );
  });

  it("toIcrc21ConsentMessageRawRequest should return a valid ICRC-21 fields display consent message request", () => {
    const consentMessageRequest = {
      ...mockConsentMessageRequest,
      userPreferences: {
        ...mockConsentMessageRequest.userPreferences,
        deriveSpec: {
          FieldsDisplay: null,
        },
      },
    };

    const result = toIcrc21ConsentMessageRawRequest(consentMessageRequest);

    expect(result.user_preferences.device_spec).toEqual(
      toNullable({
        FieldsDisplay: null,
      }),
    );
  });
});
