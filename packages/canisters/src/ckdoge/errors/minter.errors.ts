import { fromNullable, nonNullish } from "@dfinity/utils";
import type { CkDogeMinterDid } from "../../declarations";

export class MinterGenericError extends Error {}
export class MinterTemporaryUnavailableError extends MinterGenericError {}
export class MinterAlreadyProcessingError extends MinterGenericError {}

export class MinterUpdateBalanceError extends MinterGenericError {}
export class MinterRetrieveDogeWithApprovalError extends MinterGenericError {}
export class MinterNoNewUtxosError extends MinterUpdateBalanceError {
  readonly pendingUtxos: CkDogeMinterDid.PendingUtxo[];
  readonly requiredConfirmations: number;
  constructor({
    pending_utxos,
    required_confirmations,
  }: {
    pending_utxos: [] | [CkDogeMinterDid.PendingUtxo[]];
    required_confirmations: number;
  }) {
    super();
    this.pendingUtxos = fromNullable(pending_utxos) ?? [];
    this.requiredConfirmations = required_confirmations;
  }
}

export class MinterEstimateWithdrawalFeeError extends MinterGenericError {}
export class MinterRetrieveDogeError extends MinterGenericError {}
export class MinterMalformedAddressError extends MinterRetrieveDogeError {}
export class MinterAmountTooLowError extends MinterRetrieveDogeError {}
export class MinterAmountTooHighError extends MinterRetrieveDogeError {}
export class MinterInsufficientFundsError extends MinterRetrieveDogeError {}
export class MinterInsufficientAllowanceError extends MinterRetrieveDogeError {}

const mapGenericError = (
  Err:
    | CkDogeMinterDid.UpdateBalanceError
    | CkDogeMinterDid.RetrieveDogeWithApprovalError,
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
  Err: CkDogeMinterDid.UpdateBalanceError,
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

export const createEstimateWithdrawalFeeError = (
  Err: CkDogeMinterDid.EstimateWithdrawalFeeError,
): MinterGenericError => {
  if ("AmountTooHigh" in Err) {
    return new MinterAmountTooHighError("Amount too high");
  }

  if ("AmountTooLow" in Err) {
    return new MinterAmountTooLowError(
      `Amount too low, minimum: ${Err.AmountTooLow.min_amount}`,
    );
  }

  return new MinterEstimateWithdrawalFeeError(
    `Unsupported response type in minter.estimateWithdrawalFee ${JSON.stringify(Err)}`,
  );
};

export const createRetrieveDogeWithApprovalError = (
  Err: CkDogeMinterDid.RetrieveDogeWithApprovalError,
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

  if ("MalformedAddress" in Err) {
    return new MinterMalformedAddressError(`${Err.MalformedAddress}`);
  }

  if ("AmountTooLow" in Err) {
    return new MinterAmountTooLowError(`${Err.AmountTooLow}`);
  }

  if ("InsufficientFunds" in Err) {
    return new MinterInsufficientFundsError(`${Err.InsufficientFunds.balance}`);
  }

  return new MinterRetrieveDogeWithApprovalError(
    `Unsupported response type in minter.updateBalance ${JSON.stringify(Err)}`,
  );
};
