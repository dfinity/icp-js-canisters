import { fromNullable, nonNullish } from "@dfinity/utils";
import type {
  PendingUtxo,
  RetrieveBtcError,
  RetrieveBtcWithApprovalError,
  UpdateBalanceError,
} from "../../declarations/ckbtc/minter";

export class MinterGenericError extends Error {}
export class MinterTemporaryUnavailableError extends MinterGenericError {}
export class MinterAlreadyProcessingError extends MinterGenericError {}

export class MinterUpdateBalanceError extends MinterGenericError {}
export class MinterNoNewUtxosError extends MinterUpdateBalanceError {
  readonly pendingUtxos: PendingUtxo[];
  readonly requiredConfirmations: number;
  constructor({
    pending_utxos,
    required_confirmations,
  }: {
    pending_utxos: [] | [PendingUtxo[]];
    required_confirmations: number;
  }) {
    super();
    this.pendingUtxos = fromNullable(pending_utxos) ?? [];
    this.requiredConfirmations = required_confirmations;
  }
}

export class MinterRetrieveBtcError extends MinterGenericError {}
export class MinterMalformedAddressError extends MinterRetrieveBtcError {}
export class MinterAmountTooLowError extends MinterRetrieveBtcError {}
export class MinterInsufficientFundsError extends MinterRetrieveBtcError {}
export class MinterInsufficientAllowanceError extends MinterRetrieveBtcError {}

const mapGenericError = (
  Err: UpdateBalanceError | RetrieveBtcError | RetrieveBtcWithApprovalError,
): MinterGenericError | undefined => {
  if ("GenericError" in Err) {
    const {
      GenericError: { error_message, error_code },
    } = Err;
    return new MinterGenericError(`${error_message} (${error_code})`);
  }

  if ("TemporarilyUnavailable" in Err) {
    return new MinterTemporaryUnavailableError(Err.TemporarilyUnavailable);
  }

  if ("AlreadyProcessing" in Err) {
    return new MinterAlreadyProcessingError();
  }

  return undefined;
};

export const createUpdateBalanceError = (
  Err: UpdateBalanceError,
): MinterGenericError => {
  const error = mapGenericError(Err);

  if (nonNullish(error)) {
    return error;
  }

  if ("NoNewUtxos" in Err) {
    return new MinterNoNewUtxosError(Err.NoNewUtxos);
  }

  // Handle types added in the backend but not yet added in the frontend
  return new MinterUpdateBalanceError(
    `Unsupported response type in minter.updateBalance ${JSON.stringify(Err)}`,
  );
};

export const createRetrieveBtcError = (
  Err: RetrieveBtcError,
): MinterGenericError => {
  const error = mapGenericError(Err);

  if (nonNullish(error)) {
    return error;
  }

  if ("MalformedAddress" in Err) {
    return new MinterMalformedAddressError(Err.MalformedAddress);
  }

  if ("AmountTooLow" in Err) {
    return new MinterAmountTooLowError(`${Err.AmountTooLow}`);
  }

  if ("InsufficientFunds" in Err) {
    return new MinterInsufficientFundsError(`${Err.InsufficientFunds.balance}`);
  }

  // Handle types added in the backend but not yet added in the frontend
  return new MinterRetrieveBtcError(
    `Unsupported response type in minter.retrieveBtc ${JSON.stringify(Err)}`,
  );
};

export const createRetrieveBtcWithApprovalError = (
  Err: RetrieveBtcWithApprovalError,
): MinterGenericError => {
  const error = mapGenericError(Err);

  if (nonNullish(error)) {
    return error;
  }

  if ("InsufficientAllowance" in Err) {
    return new MinterInsufficientAllowanceError(
      `${Err.InsufficientAllowance.allowance}`,
    );
  }

  return createRetrieveBtcError(Err);
};
