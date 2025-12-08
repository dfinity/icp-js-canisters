import { nonNullish } from "@dfinity/utils";
import type { CkEthMinterDid } from "../../declarations";

export class DetailedError<T> extends Error {
  public details: T | undefined;
  constructor({ msg, details }: { msg?: string; details?: T }) {
    super(msg);
    this.details = details;
  }
}

export class MinterGenericError extends Error {}

export class MinterError<T> extends DetailedError<T> {}

export class MinterTemporaryUnavailableError extends MinterGenericError {}
export class MinterInsufficientFundsError<T> extends MinterError<T> {}
export class MinterInsufficientAllowanceError<T> extends MinterError<T> {}
export class MinterAmountTooLowError<T> extends MinterError<T> {}
export class MinterRecipientAddressBlockedError<T> extends MinterError<T> {}
export class MinterTokenNotSupported<T> extends MinterError<T> {}

export class LedgerGenericError extends Error {}

export class LedgerError<T> extends DetailedError<T> {}

export class LedgerWithdrawalError<T> extends LedgerError<T> {}
export class LedgerTemporaryUnavailableError<T> extends LedgerError<T> {}
export class LedgerInsufficientAllowanceError<T> extends LedgerError<T> {}
export class LedgerAmountTooLowError<T> extends LedgerError<T> {}
export class LedgerInsufficientFundsError<T> extends LedgerError<T> {}

export const createWithdrawEthError = (
  Err: CkEthMinterDid.WithdrawalError,
): MinterGenericError => {
  if ("TemporarilyUnavailable" in Err) {
    return new MinterTemporaryUnavailableError(Err.TemporarilyUnavailable);
  }

  if ("InsufficientAllowance" in Err) {
    return new MinterInsufficientAllowanceError({
      details: Err.InsufficientAllowance.allowance,
    });
  }

  if ("AmountTooLow" in Err) {
    return new MinterAmountTooLowError({
      details: Err.AmountTooLow.min_withdrawal_amount,
    });
  }

  if ("RecipientAddressBlocked" in Err) {
    return new MinterRecipientAddressBlockedError({
      details: Err.RecipientAddressBlocked.address,
    });
  }

  if ("InsufficientFunds" in Err) {
    return new MinterInsufficientFundsError({
      details: Err.InsufficientFunds.balance,
    });
  }

  // Handle types added in the backend but not yet added in the frontend
  return new MinterError({
    msg: `Unsupported response type in minter.withdrawEth`,
    details: Err,
  });
};

export const createWithdrawErc20Error = (
  Err: CkEthMinterDid.WithdrawErc20Error,
): MinterGenericError => {
  if ("TemporarilyUnavailable" in Err) {
    return new MinterTemporaryUnavailableError(Err.TemporarilyUnavailable);
  }

  if ("RecipientAddressBlocked" in Err) {
    return new MinterRecipientAddressBlockedError({
      details: Err.RecipientAddressBlocked.address,
    });
  }

  if ("TokenNotSupported" in Err) {
    return new MinterTokenNotSupported({
      details: Err.TokenNotSupported.supported_tokens,
    });
  }

  const createLedgerError = ({
    Err,
    ckEthBlockIndex,
  }: {
    Err: CkEthMinterDid.LedgerError;
    ckEthBlockIndex?: bigint;
  }): LedgerGenericError => {
    const createDetailsError = <T>(
      error: T,
    ): { error: T; ckEthBlockIndex?: bigint } => ({ error, ckEthBlockIndex });

    if ("TemporarilyUnavailable" in Err) {
      return new LedgerTemporaryUnavailableError({
        msg: Err.TemporarilyUnavailable,
        ...(nonNullish(ckEthBlockIndex) && {
          details: {
            ckEthBlockIndex,
          },
        }),
      });
    }

    if ("InsufficientAllowance" in Err) {
      return new LedgerInsufficientAllowanceError({
        details: createDetailsError(Err.InsufficientAllowance),
      });
    }

    if ("AmountTooLow" in Err) {
      return new LedgerAmountTooLowError({
        details: createDetailsError(Err.AmountTooLow),
      });
    }

    if ("InsufficientFunds" in Err) {
      return new LedgerInsufficientFundsError({
        details: createDetailsError(Err.InsufficientFunds),
      });
    }

    // Handle types added in the backend but not yet added in the frontend
    return new LedgerWithdrawalError({
      msg: `Unsupported response type in ledger for minter.withdrawErc20`,
      details: createDetailsError(Err),
    });
  };

  if ("CkErc20LedgerError" in Err) {
    return createLedgerError({
      Err: Err.CkErc20LedgerError.error,
      ckEthBlockIndex: Err.CkErc20LedgerError.cketh_block_index,
    });
  }

  if ("CkEthLedgerError" in Err) {
    return createLedgerError({ Err: Err.CkEthLedgerError.error });
  }

  // Handle types added in the backend but not yet added in the frontend
  return new MinterError({
    msg: `Unsupported response type in minter.withdrawErc20`,
    details: Err,
  });
};
