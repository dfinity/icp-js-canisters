import { isNullish } from "@dfinity/utils";
import { sha256 } from "@noble/hashes/sha2";
import { base58_to_binary } from "base58-js";
import { bech32, bech32m, type Decoded } from "bech32";
import { BtcAddressType, BtcNetwork } from "../enums/btc.enums";
import {
  ParseBtcAddressBadWitnessLengthError,
  ParseBtcAddressInvalidError,
  ParseBtcAddressMalformedAddressError,
  ParseBtcAddressNoDataError,
  ParseBtcAddressUnexpectedHumanReadablePartError,
  ParseBtcAddressUnsupportedAddressTypeError,
  ParseBtcAddressUnsupportedWitnessVersionError,
  ParseBtcAddressWrongNetworkError,
} from "../errors/btc.errors";
import type { BtcAddress, BtcAddressInfo } from "../types/btc";

// See https://en.bitcoin.it/wiki/List_of_address_prefixes
const BTC_MAINNET_PREFIX = 0; // or 0x00
const BTC_MAINNET_P2SH_PREFIX = 5; // or 0x05
const BTC_TESTNET_PREFIX = 111; // or 0x6f
const BTC_TESTNET_P2SH_PREFIX = 196; // or 0xc4

const Base58AddressTypes: Record<
  number,
  { type: BtcAddressType; networks: BtcNetwork[] }
> = {
  [BTC_MAINNET_PREFIX]: {
    type: BtcAddressType.P2pkh,
    networks: [BtcNetwork.Mainnet],
  },

  [BTC_TESTNET_PREFIX]: {
    type: BtcAddressType.P2pkh,
    networks: [BtcNetwork.Testnet, BtcNetwork.Regtest],
  },

  [BTC_MAINNET_P2SH_PREFIX]: {
    type: BtcAddressType.P2sh,
    networks: [BtcNetwork.Mainnet],
  },

  [BTC_TESTNET_P2SH_PREFIX]: {
    type: BtcAddressType.P2sh,
    networks: [BtcNetwork.Testnet, BtcNetwork.Regtest],
  },
};

const parseBase58Address = ({
  address,
  network,
}: Required<BtcAddress>): BtcAddressInfo => {
  const decodeBase58 = (address: string): Uint8Array => {
    try {
      return base58_to_binary(address);
    } catch (_error: unknown) {
      throw new ParseBtcAddressInvalidError();
    }
  };

  const decoded: Uint8Array = decodeBase58(address);

  const { length } = decoded;

  if (length !== 25) {
    throw new ParseBtcAddressMalformedAddressError(
      `Expected the address to be 25 bytes, got ${length}.`,
    );
  }

  const validateBase58Checksum = (decoded: Uint8Array) => {
    const expectedChecksum = decoded.slice(length - 4, length);
    const body = decoded.slice(0, length - 4);

    const bodyHash = sha256.create();
    bodyHash.update(body);

    const checksumHash = sha256.create();
    checksumHash.update(bodyHash.digest());

    const checksum = checksumHash.digest().slice(0, 4);

    if (
      expectedChecksum.some(
        (value: number, index: number) => value !== checksum[index],
      )
    ) {
      throw new ParseBtcAddressMalformedAddressError(
        `Checksum mismatch expected ${expectedChecksum}, got ${checksum}.`,
      );
    }
  };

  validateBase58Checksum(decoded);

  const [version] = decoded;

  const versionNetwork = Base58AddressTypes[version];

  if (isNullish(versionNetwork)) {
    throw new ParseBtcAddressUnsupportedAddressTypeError();
  }

  const { type, networks } = versionNetwork;

  if (!networks.includes(network)) {
    throw new ParseBtcAddressWrongNetworkError();
  }

  return {
    address,
    network,
    type,
    parser: "base58",
  };
};

const parseBip173Address = ({
  address,
  network,
}: Required<BtcAddress>): BtcAddressInfo => {
  const decodeBech32 = (address: string): Decoded => {
    try {
      if (
        address.startsWith("bc1p") ||
        address.startsWith("tb1p") ||
        address.startsWith("bcrt1p")
      ) {
        return bech32m.decode(address);
      }

      return bech32.decode(address);
    } catch (_error: unknown) {
      throw new ParseBtcAddressMalformedAddressError();
    }
  };

  const { prefix, words } = decodeBech32(address);

  const mapPrefixToNetwork: Record<string, BtcNetwork> = {
    bc: BtcNetwork.Mainnet,
    tb: BtcNetwork.Testnet,
    bcrt: BtcNetwork.Regtest,
  };

  const decodedNetwork: BtcNetwork | undefined = mapPrefixToNetwork[prefix];

  if (isNullish(decodedNetwork)) {
    throw new ParseBtcAddressInvalidError();
  }

  if (decodedNetwork !== network) {
    throw new ParseBtcAddressUnexpectedHumanReadablePartError();
  }

  const [witnessVersion, ...rest] = words;

  if (witnessVersion > 1) {
    throw new ParseBtcAddressUnsupportedWitnessVersionError();
  }

  const data = bech32.fromWords(rest);

  switch (data.length) {
    case 20:
      return {
        address,
        network,
        type: BtcAddressType.P2wpkhV0,
        parser: "bip-173",
      };
    case 32:
      return {
        address,
        network,
        type: witnessVersion === 0 ? BtcAddressType.P2wsh : BtcAddressType.P2tr,
        parser: "bip-173",
      };
    default:
      throw new ParseBtcAddressBadWitnessLengthError();
  }
};

/**
 * Parse a Bitcoin address.
 *
 * Parse implementation follows strategy implemented in [Minter canister](https://github.com/dfinity/ic/blob/a8da3aa23dc6f8f4708cb0cb8edce84c5bd8f225/rs/bitcoin/ckbtc/minter/src/address.rs#L54).
 *
 * Credits: Parts of JavaScript code and test values from [bitcoin-address-validation](https://github.com/ruigomeseu/bitcoin-address-validation).
 *
 * @param {BtcAddress} params The Bitcoin address and network to parse
 * @param {string} params.address
 * @param {BtcNetwork} params.network Optional. Default BtcNetwork is Mainnet
 */
export const parseBtcAddress = ({
  address,
  network = BtcNetwork.Mainnet,
}: BtcAddress): BtcAddressInfo => {
  switch (address.charAt(0)) {
    case "1":
    case "2":
    case "3":
    case "m":
    case "n":
      return parseBase58Address({ address, network });
    case "b":
    case "B":
    case "t":
    case "T":
      return parseBip173Address({ address, network });
    case "":
      throw new ParseBtcAddressNoDataError();
    default:
      throw new ParseBtcAddressUnsupportedAddressTypeError();
  }
};
