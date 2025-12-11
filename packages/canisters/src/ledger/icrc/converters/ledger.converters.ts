import { isNullish, toNullable } from "@dfinity/utils";
import type { IcrcLedgerDid } from "../../../declarations";
import type {
  ApproveParams,
  Icrc21ConsentMessageParams,
  TransferFromParams,
  TransferParams,
} from "../types/ledger.params";

// WARNING: When using the ICRC-1 interface of the ICP ledger, there is no
// relationship between the memo and the icrc1Memo of a transaction. The ICRC-1
// interface simply cannot set the memo field and the non-ICRC-1 interface
// cannot set the icrc1Memo field, even though the icrc1Memo field is called
// just "memo" in canister method params.
export const toTransferArg = ({
  from_subaccount,
  fee,
  created_at_time,
  memo,
  ...rest
}: TransferParams): IcrcLedgerDid.TransferArg => ({
  ...rest,
  fee: toNullable(fee),
  memo: toNullable(memo),
  from_subaccount: toNullable(from_subaccount),
  created_at_time: toNullable(created_at_time),
});

export const toTransferFromArgs = ({
  spender_subaccount,
  fee,
  created_at_time,
  memo,
  ...rest
}: TransferFromParams): IcrcLedgerDid.TransferFromArgs => ({
  ...rest,
  fee: toNullable(fee),
  memo: toNullable(memo),
  spender_subaccount: toNullable(spender_subaccount),
  created_at_time: toNullable(created_at_time),
});

export const toApproveArgs = ({
  fee,
  created_at_time,
  memo,
  from_subaccount,
  expected_allowance,
  expires_at,
  ...rest
}: ApproveParams): IcrcLedgerDid.ApproveArgs => ({
  ...rest,
  fee: toNullable(fee),
  memo: toNullable(memo),
  from_subaccount: toNullable(from_subaccount),
  created_at_time: toNullable(created_at_time),
  expected_allowance: toNullable(expected_allowance),
  expires_at: toNullable(expires_at),
});

export const toIcrc21ConsentMessageArgs = ({
  userPreferences: {
    metadata: { utcOffsetMinutes, language },
    deriveSpec,
  },
  ...rest
}: Icrc21ConsentMessageParams): IcrcLedgerDid.icrc21_consent_message_request => ({
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
