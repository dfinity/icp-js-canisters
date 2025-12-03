import { assertNever, jsonReplacer } from "@dfinity/utils";
import type { CmcDid } from "../declarations";

export class RefundedError extends Error {}
export class InvalidaTransactionError extends Error {}
export class CmcError extends Error {}
export class ProcessingError extends Error {}
export class TransactionTooOldError extends Error {}

// Throws one of the errors above
export const throwNotifyError = ({
  Err: error,
}: {
  Err: CmcDid.NotifyError;
}): void => {
  if ("Refunded" in error) {
    throw new RefundedError(error.Refunded.reason);
  }
  if ("InvalidTransaction" in error) {
    throw new InvalidaTransactionError(error.InvalidTransaction);
  }
  if ("Processing" in error) {
    throw new ProcessingError();
  }
  if ("TransactionTooOld" in error) {
    throw new TransactionTooOldError();
  }
  if ("Other" in error) {
    throw new CmcError(
      `Error in CMC with code ${error.Other.error_code}: ${error.Other.error_message}`,
    );
  }

  assertNever(
    error,
    `Unsupported error type ${JSON.stringify(error, jsonReplacer)}`,
  );
};
