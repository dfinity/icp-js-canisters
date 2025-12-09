import { nonNullish } from "@dfinity/utils";

/**
 * Identifies errors of method not being present in the canister.
 *
 * This is useful because SNS projects have different versions of SNS canisters.
 * Therefore, what works in the latest version might not work in the previous one.
 *
 * Error message example: "Call was rejected:
 * Request ID: 3a6ef904b35fd19721c95c3df2b0b00b8abefba7f0ad188f5c472809b772c914
 * Reject code: 3
 * Reject text: Canister 75ffu-oaaaa-aaaaa-aabbq-cai has no update method 'get_auto_finalization_status'"
 */
export const isMethodNotSupportedError = (err: unknown): boolean => {
  if (typeof err === "object" && nonNullish(err) && "message" in err) {
    const message = err.message as string;
    return (
      message.includes("has no update method") ||
      message.includes("has no query method")
    );
  }
  return false;
};
