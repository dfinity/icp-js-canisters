// This is possible specially in SNS projects/
// Because they share the same canisters but in different versions.
export class UnsupportedMethodError extends Error {
  constructor(public readonly methodName: string) {
    super();
  }
}
