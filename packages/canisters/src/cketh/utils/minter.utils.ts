import { decodeBase32 } from "@dfinity/utils";
import type { Principal } from "@icp-sdk/core/principal";

/**
 * Encode a principal to a byte array as Ethereum data hex (staring with 0x).
 * Such a conversion is required to deposit ETH to the ckETH helper contract.
 *
 * Code adapted from the ckETH minter dashboard JS function: https://github.com/dfinity/ic/blob/master/rs/ethereum/cketh/minter/templates/principal_to_bytes.js
 *
 * @param principal The principal to encode into a fixed 32-byte representation suitable for calling Ethereum smart contracts.
 */
export const encodePrincipalToEthAddress = (principal: Principal): string => {
  const rawBytes = decodeBase32(principal.toText().replace(/-/g, ""));
  return bytes32Encode(rawBytes.slice(4));
};

/**
 * Appends a hex representation of a number to string.
 * @param {string} s A string to append the hex to.
 * @param {number} b A byte.
 * @return {string} An updated string.
 */
const appendHexByte = ({
  stringToAppend,
  bytes,
}: {
  stringToAppend: string;
  bytes: number;
}): string => {
  stringToAppend += ((bytes >> 4) & 0x0f).toString(16);
  stringToAppend += (bytes & 0x0f).toString(16);
  return stringToAppend;
};

/**
 * Encodes a byte array as Ethereum data hex (staring with 0x).
 * @param {Array<number>} bytes A byte array.
 * @return {string} A hex string.
 */
const bytes32Encode = (bytes: Uint8Array): string => {
  const n = bytes.length;
  let s = "0x";
  s = appendHexByte({ stringToAppend: s, bytes: n });
  for (let i = 0; i < bytes.length; i++) {
    s = appendHexByte({ stringToAppend: s, bytes: bytes[i] });
  }
  for (let i = 0; i < 31 - bytes.length; i++) {
    s += "00";
  }
  return s;
};
