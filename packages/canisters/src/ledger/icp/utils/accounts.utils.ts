import {
  bigEndianCrc32,
  hexStringToUint8Array,
  isNullish,
  uint8ArrayToHexString,
  uint8ArraysEqual,
} from "@dfinity/utils";
import { InvalidAccountIDError } from "../errors/ledger.errors";

/**
 * Checks account id check sum
 *
 * @throws InvalidAccountIDError
 */
export const checkAccountId = (accountId: string): void => {
  // Verify the checksum of the given address.
  if (accountId.length != 64) {
    throw new InvalidAccountIDError(
      `Invalid account identifier ${accountId}. The account identifier must be 64 chars in length.`,
    );
  }

  const toAccountBytes = hexStringToUint8Array(accountId);
  const foundChecksum = toAccountBytes.slice(0, 4);
  const expectedCheckum = bigEndianCrc32(toAccountBytes.slice(4));
  if (!uint8ArraysEqual({ a: expectedCheckum, b: foundChecksum })) {
    throw new InvalidAccountIDError(
      `Account identifier ${accountId} has an invalid checksum. Are you sure the account identifier is correct?\n\nExpected checksum: ${uint8ArrayToHexString(expectedCheckum)}\nFound checksum: ${uint8ArrayToHexString(foundChecksum)}`,
    );
  }
};

/**
 * Checks if a given string (or undefined) is a valid ICP account identifier.
 *
 * It uses the `checkAccountId` function to validate the checksum, but it does not throw an error.
 *
 * @param {string | undefined} address The putative ICP account identifier.
 */

export const isIcpAccountIdentifier = (
  address: string | undefined,
): boolean => {
  if (isNullish(address)) {
    return false;
  }

  try {
    checkAccountId(address);
    return true;
  } catch (_: unknown) {
    // We do not parse the error
  }

  return false;
};
