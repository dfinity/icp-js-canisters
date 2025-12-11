import {
  bigEndianCrc32,
  encodeBase32,
  hexStringToUint8Array,
  isNullish,
  nonNullish,
  notEmptyString,
  uint8ArrayToHexString,
} from "@dfinity/utils";
import { Principal } from "@icp-sdk/core/principal";
import {
  IcrcMetadataResponseEntries,
  type IcrcAccount,
  type IcrcTokenMetadata,
  type IcrcTokenMetadataResponse,
} from "../types/ledger.responses";

const MAX_SUBACCOUNT_HEX_LENGTH = 64;

/**
 * Encodes an Icrc-1 account compatible into a string.
 * Formatting Reference: https://github.com/dfinity/ICRC-1/blob/main/standards/ICRC-1/TextualEncoding.md
 *
 * @param account { owner: Principal, subaccount?: Uint8Array }
 * @returns string
 */
export const encodeIcrcAccount = ({
  owner,
  subaccount,
}: IcrcAccount): string => {
  if (isNullish(subaccount)) {
    return owner.toText();
  }

  const removeLeadingZeros = (text: string): string => text.replace(/^0+/, "");

  const subaccountText = removeLeadingZeros(
    uint8ArrayToHexString(Uint8Array.from(subaccount)),
  );

  if (subaccountText.length === 0) {
    return owner.toText();
  }

  return `${owner.toText()}-${encodeCrc({
    owner,
    subaccount,
  })}.${subaccountText}`;
};

const encodeCrc = ({ owner, subaccount }: Required<IcrcAccount>): string => {
  const crc = bigEndianCrc32(
    Uint8Array.from([...owner.toUint8Array(), ...subaccount]),
  );

  return encodeBase32(crc);
};

/**
 * Decodes a string into an Icrc-1 compatible account.
 * Formatting Reference: https://github.com/dfinity/ICRC-1/blob/main/standards/ICRC-1/TextualEncoding.md
 *
 * @param accountString string
 * @throws Error if the string is not a valid Icrc-1 account
 * @returns IcrcAccount { owner: Principal, subaccount?: Uint8Array }
 */
export const decodeIcrcAccount = (accountString: string): IcrcAccount => {
  const [principalAndMaybeCheckSum, subaccountHex, ...unexpected] =
    accountString.split(".");

  if (!notEmptyString(principalAndMaybeCheckSum)) {
    throw new Error("Invalid account. No string provided.");
  }

  if (unexpected.length > 0) {
    throw new Error(
      "Invalid account string format. Expected at most one '.' separator.",
    );
  }

  if (isNullish(subaccountHex)) {
    return {
      owner: Principal.fromText(accountString),
    };
  }

  const [checksum, ...rest] = principalAndMaybeCheckSum.split("-").reverse();
  const principalText = rest.reverse().join("-");

  const account = {
    owner: Principal.fromText(principalText),
    subaccount: hexStringToUint8Array(
      subaccountHex.padStart(MAX_SUBACCOUNT_HEX_LENGTH, "0"),
    ),
  };

  const crcText = encodeCrc(account);

  if (crcText !== checksum) {
    throw new Error("Invalid account. Invalid checksum.");
  }

  return account;
};

/**
 * Maps the token metadata information from a ledger response into a structured record.
 *
 * This utility processes an array of metadata key-value pairs provided by the ledger
 * and extracts specific fields, such as symbol, name, fee, decimals, and logo. It then
 * constructs a `IcrcTokenMetadata` record. If any required fields are missing,
 * the function returns `undefined`.
 *
 * @param {IcrcTokenMetadataResponse} response - An array of key-value pairs representing token metadata.
 *
 * @returns {IcrcTokenMetadata | undefined} - A structured metadata record or `undefined` if required fields are missing.
 */
export const mapTokenMetadata = (
  response: IcrcTokenMetadataResponse,
): IcrcTokenMetadata | undefined => {
  const nullishToken = response.reduce<Partial<IcrcTokenMetadata>>(
    (acc, [key, value]) => {
      switch (key) {
        case IcrcMetadataResponseEntries.SYMBOL:
          acc = { ...acc, ...("Text" in value && { symbol: value.Text }) };
          break;
        case IcrcMetadataResponseEntries.NAME:
          acc = { ...acc, ...("Text" in value && { name: value.Text }) };
          break;
        case IcrcMetadataResponseEntries.FEE:
          acc = { ...acc, ...("Nat" in value && { fee: value.Nat }) };
          break;
        case IcrcMetadataResponseEntries.DECIMALS:
          acc = {
            ...acc,
            ...("Nat" in value && { decimals: Number(value.Nat) }),
          };
          break;
        case IcrcMetadataResponseEntries.LOGO:
          acc = { ...acc, ...("Text" in value && { icon: value.Text }) };
      }

      return acc;
    },
    {},
  );

  const isIcrcTokenMetadata = (
    arg: Partial<IcrcTokenMetadata>,
  ): arg is IcrcTokenMetadata =>
    nonNullish(arg.symbol) &&
    nonNullish(arg.name) &&
    nonNullish(arg.fee) &&
    nonNullish(arg.decimals);

  if (!isIcrcTokenMetadata(nullishToken)) {
    return undefined;
  }

  return nullishToken;
};
