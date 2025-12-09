import {
  arrayOfNumberToUint8Array,
  isNullish,
  toNullable,
} from "@dfinity/utils";
import type {
  TransferArg as Icrc1TransferRawRequest,
  icrc21_consent_message_request as Icrc21ConsentMessageRawRequest,
  ApproveArgs as Icrc2ApproveRawRequest,
  Tokens,
  TransferArgs as TransferRawRequest,
} from "../../../../declarations/ledger-icp/ledger";
import { TRANSACTION_FEE } from "../../constants/constants";
import type {
  Icrc1TransferRequest,
  Icrc21ConsentMessageRequest,
  Icrc2ApproveRequest,
  TransferRequest,
} from "../../types/ledger_converters";

const e8sToTokens = (e8s: bigint): Tokens => ({ e8s });

export const toTransferRawRequest = ({
  to,
  amount,
  memo,
  fee,
  fromSubAccount,
  createdAt,
}: TransferRequest): TransferRawRequest => ({
  to: to.toUint8Array(),
  fee: e8sToTokens(fee ?? TRANSACTION_FEE),
  amount: e8sToTokens(amount),
  // Always explicitly set the memo for compatibility with ledger wallet - hardware wallet
  memo: memo ?? BigInt(0),
  created_at_time:
    createdAt !== undefined ? [{ timestamp_nanos: createdAt }] : [],
  from_subaccount:
    fromSubAccount === undefined
      ? []
      : [arrayOfNumberToUint8Array(fromSubAccount)],
});

// WARNING: When using the ICRC-1 interface of the ICP ledger, there is no
// relationship between the memo and the icrc1Memo of a transaction. The ICRC-1
// interface simply cannot set the memo field and the non-ICRC-1 interface
// cannot set the icrc1Memo field, even though the icrc1Memo field is called
// just "memo" in canister method params.
export const toIcrc1TransferRawRequest = ({
  fromSubAccount,
  to,
  amount,
  fee,
  icrc1Memo,
  createdAt,
}: Icrc1TransferRequest): Icrc1TransferRawRequest => ({
  to,
  fee: toNullable(fee ?? TRANSACTION_FEE),
  amount,
  memo: toNullable(icrc1Memo),
  created_at_time: toNullable(createdAt),
  from_subaccount: toNullable(fromSubAccount),
});

export const toIcrc2ApproveRawRequest = ({
  fee,
  createdAt,
  icrc1Memo,
  fromSubAccount,
  expected_allowance,
  expires_at,
  amount,
  ...rest
}: Icrc2ApproveRequest): Icrc2ApproveRawRequest => ({
  ...rest,
  fee: toNullable(fee ?? TRANSACTION_FEE),
  memo: toNullable(icrc1Memo),
  from_subaccount: toNullable(fromSubAccount),
  created_at_time: toNullable(createdAt),
  amount,
  expected_allowance: toNullable(expected_allowance),
  expires_at: toNullable(expires_at),
});

export const toIcrc21ConsentMessageRawRequest = ({
  userPreferences: {
    metadata: { utcOffsetMinutes, language },
    deriveSpec,
  },
  ...rest
}: Icrc21ConsentMessageRequest): Icrc21ConsentMessageRawRequest => ({
  ...rest,
  user_preferences: {
    metadata: {
      language,
      utc_offset_minutes: toNullable(utcOffsetMinutes),
    },
    device_spec: isNullish(deriveSpec)
      ? toNullable()
      : toNullable(
          "GenericDisplay" in deriveSpec
            ? { GenericDisplay: null }
            : {
                FieldsDisplay: null,
              },
        ),
  },
});
