import type { IcpLedgerDid } from "../../../declarations";
import type { BlockHeight } from "../types/common";

export class IcrcError extends Error {}

export class TransferError extends IcrcError {}
export class ApproveError extends IcrcError {}
export class ConsentMessageError extends IcrcError {}

export class InvalidSenderError extends TransferError {}

export class InvalidAccountIDError extends Error {}

export class InsufficientFundsError extends TransferError {
  constructor(public readonly balance: bigint) {
    super();
  }
}

export class TxTooOldError extends TransferError {
  constructor(public readonly allowed_window_secs?: number | undefined) {
    super();
  }
}

export class TxCreatedInFutureError extends TransferError {}

export class TxDuplicateError extends TransferError {
  constructor(public readonly duplicateOf: BlockHeight) {
    super();
  }
}

export class BadFeeError extends IcrcError {
  constructor(public readonly expectedFee: bigint) {
    super();
  }
}

export class GenericError extends ApproveError {
  constructor(
    public readonly message: string,
    public readonly error_code: bigint,
  ) {
    super();
  }
}

export class TemporarilyUnavailableError extends ApproveError {}

export class DuplicateError extends ApproveError {
  constructor(public readonly duplicateOf: IcpLedgerDid.Icrc1BlockIndex) {
    super();
  }
}

export class AllowanceChangedError extends ApproveError {
  constructor(public readonly currentAllowance: IcpLedgerDid.Icrc1Tokens) {
    super();
  }
}

export class CreatedInFutureError extends ApproveError {}
export class TooOldError extends ApproveError {}

export class ExpiredError extends ApproveError {
  constructor(public readonly ledgerTime: bigint) {
    super();
  }
}

export class InsufficientPaymentError extends ConsentMessageError {}
export class UnsupportedCanisterCallError extends ConsentMessageError {}
export class ConsentMessageUnavailableError extends ConsentMessageError {}

export const mapTransferError = (
  rawTransferError: IcpLedgerDid.TransferError,
): TransferError => {
  if ("TxDuplicate" in rawTransferError) {
    return new TxDuplicateError(rawTransferError.TxDuplicate.duplicate_of);
  }
  if ("InsufficientFunds" in rawTransferError) {
    return new InsufficientFundsError(
      rawTransferError.InsufficientFunds.balance.e8s,
    );
  }
  if ("TxCreatedInFuture" in rawTransferError) {
    return new TxCreatedInFutureError();
  }
  if ("TxTooOld" in rawTransferError) {
    return new TxTooOldError(
      Number(rawTransferError.TxTooOld.allowed_window_nanos),
    );
  }
  if ("BadFee" in rawTransferError) {
    return new BadFeeError(rawTransferError.BadFee.expected_fee.e8s);
  }
  // Edge case
  return new TransferError(
    `Unknown error type ${JSON.stringify(rawTransferError)}`,
  );
};

export const mapIcrc1TransferError = (
  rawTransferError: IcpLedgerDid.Icrc1TransferError,
): TransferError => {
  if ("Duplicate" in rawTransferError) {
    return new TxDuplicateError(rawTransferError.Duplicate.duplicate_of);
  }
  if ("InsufficientFunds" in rawTransferError) {
    return new InsufficientFundsError(
      rawTransferError.InsufficientFunds.balance,
    );
  }
  if ("CreatedInFuture" in rawTransferError) {
    return new TxCreatedInFutureError();
  }
  if ("TooOld" in rawTransferError) {
    return new TxTooOldError();
  }
  if ("BadFee" in rawTransferError) {
    return new BadFeeError(rawTransferError.BadFee.expected_fee);
  }
  // Edge case
  return new TransferError(
    `Unknown error type ${JSON.stringify(rawTransferError)}`,
  );
};

export const mapIcrc2ApproveError = (
  rawApproveError: IcpLedgerDid.ApproveError,
): ApproveError => {
  /**
   * export type ApproveError =
   *   | { InsufficientFunds: { balance: Icrc1Tokens } };
   */

  if ("GenericError" in rawApproveError) {
    return new GenericError(
      rawApproveError.GenericError.message,
      rawApproveError.GenericError.error_code,
    );
  }

  if ("TemporarilyUnavailable" in rawApproveError) {
    return new TemporarilyUnavailableError();
  }

  if ("Duplicate" in rawApproveError) {
    return new DuplicateError(rawApproveError.Duplicate.duplicate_of);
  }

  if ("BadFee" in rawApproveError) {
    return new BadFeeError(rawApproveError.BadFee.expected_fee);
  }

  if ("AllowanceChanged" in rawApproveError) {
    return new AllowanceChangedError(
      rawApproveError.AllowanceChanged.current_allowance,
    );
  }

  if ("CreatedInFuture" in rawApproveError) {
    return new CreatedInFutureError();
  }

  if ("TooOld" in rawApproveError) {
    return new TooOldError();
  }

  if ("Expired" in rawApproveError) {
    return new ExpiredError(rawApproveError.Expired.ledger_time);
  }

  if ("InsufficientFunds" in rawApproveError) {
    return new InsufficientFundsError(
      rawApproveError.InsufficientFunds.balance,
    );
  }

  // Edge case
  return new ApproveError(
    `Unknown error type ${JSON.stringify(rawApproveError)}`,
  );
};

export const mapIcrc21ConsentMessageError = (
  rawError: IcpLedgerDid.icrc21_error,
): ConsentMessageError => {
  if ("GenericError" in rawError) {
    return new GenericError(
      rawError.GenericError.description,
      rawError.GenericError.error_code,
    );
  }

  if ("InsufficientPayment" in rawError) {
    return new InsufficientPaymentError(
      rawError.InsufficientPayment.description,
    );
  }

  if ("UnsupportedCanisterCall" in rawError) {
    return new UnsupportedCanisterCallError(
      rawError.UnsupportedCanisterCall.description,
    );
  }
  if ("ConsentMessageUnavailable" in rawError) {
    return new ConsentMessageUnavailableError(
      rawError.ConsentMessageUnavailable.description,
    );
  }

  // Edge case
  return new ConsentMessageError(
    `Unknown error type ${JSON.stringify(rawError)}`,
  );
};
