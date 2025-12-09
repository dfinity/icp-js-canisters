import type { NnsGovernanceDid } from "../../declarations";

export abstract class StakeNeuronError extends Error {}

export class CouldNotClaimNeuronError extends StakeNeuronError {}

export class InsufficientAmountError extends StakeNeuronError {
  constructor(public readonly minimumAmount: bigint) {
    super();
  }
}

export class UnrecognizedTypeError extends Error {}
export class GovernanceError extends Error {
  constructor(public readonly detail: NnsGovernanceDid.GovernanceError) {
    super();
  }
}

/**
 * An error used to ensure at compile-time that it's never reached.
 */
export class UnsupportedValueError extends Error {
  constructor(value: never) {
    super(`Unsupported value: ${value}`);
  }
}
