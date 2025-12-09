import {
  arrayOfNumberToUint8Array,
  asciiStringToByteArray,
  bigEndianCrc32,
  hexStringToUint8Array,
  uint8ArrayToHexString,
} from "@dfinity/utils";
import type { Principal } from "@icp-sdk/core/principal";
import { sha224 } from "@noble/hashes/sha2";

/**
 * A 32-byte account identifier used to send and receive ICP tokens.
 *
 * The ICP Ledger uses the concept of an `AccountIdentifier` to represent accounts.
 * It’s a unique value derived from a principal (the identity controlling the account)
 * and a subaccount. This design allows a single principal to control multiple accounts
 * by using different subaccounts.
 *
 * @see https://internetcomputer.org/docs/references/ledger#_accounts
 * @see https://internetcomputer.org/docs/defi/token-ledgers/setup/icp_ledger_setup
 * @see https://internetcomputer.org/docs/references/ledger#_operations_transactions_blocks_transaction_ledger
 */
export class AccountIdentifier {
  private constructor(private readonly bytes: Uint8Array) {}

  /**
   * Creates an `AccountIdentifier` object from a hexadecimal string (e.g. d3e13d4777e22367532053190b6c6ccf57444a61337e996242b1abfb52cf92c8).
   * Validates the checksum in the process.
   *
   * @param hex - The 64-character hexadecimal representation of the account identifier.
   * @throws If the length is not 32 bytes or if the checksum is invalid.
   * @returns An instance of `AccountIdentifier`.
   */
  public static fromHex(hex: string): AccountIdentifier {
    const bytes = hexStringToUint8Array(hex);

    if (bytes.length !== 32) {
      throw new Error(
        `Invalid AccountIdentifier: expected 32 bytes, got ${bytes.length}.`,
      );
    }

    const providedChecksum = uint8ArrayToHexString(bytes.slice(0, 4));

    const hash = bytes.slice(4);
    const expectedChecksum = uint8ArrayToHexString(bigEndianCrc32(hash));

    if (providedChecksum !== expectedChecksum) {
      throw Error(
        `Checksum mismatch. Expected ${expectedChecksum}, but got ${providedChecksum}.`,
      );
    }

    return new AccountIdentifier(bytes);
  }

  /**
   * Creates an `AccountIdentifier` object from a principal and optional subaccount.
   *
   * When no subaccount is provided, a 32-byte array of zeros is used by default.
   * You can use any arbitrary 32 bytes as a subaccount identifier to derive a distinct account identifier
   * for the same principal.
   *
   * @param options.principal - The principal to derive the account from.
   * @param options.subAccount - The optional subaccount (defaults to 0).
   * @returns An instance of `AccountIdentifier`.
   */
  public static fromPrincipal({
    principal,
    subAccount = SubAccount.fromID(0),
  }: {
    principal: Principal;
    subAccount?: SubAccount;
  }): AccountIdentifier {
    // Hash (sha224) the principal, the subAccount and some padding
    const padding = asciiStringToByteArray("\x0Aaccount-id");

    const shaObj = sha224.create();
    shaObj.update(
      arrayOfNumberToUint8Array([
        ...padding,
        ...principal.toUint8Array(),
        ...subAccount.toUint8Array(),
      ]),
    );
    const hash = shaObj.digest();

    // Prepend the checksum of the hash and convert to a hex string
    const checksum = bigEndianCrc32(hash);
    const bytes = new Uint8Array([...checksum, ...hash]);
    return new AccountIdentifier(bytes);
  }

  /**
   * Returns the ICP Ledger Account Identifier as a 64-character hexadecimal string.
   * This is the format typically used to display the account identifier in a human-readable way.
   *
   * @returns Hex representation (64-character string).
   */
  public toHex(): string {
    return uint8ArrayToHexString(this.bytes);
  }

  /**
   * Returns the raw 32-byte `Uint8Array` of the account identifier.
   *
   * @returns The raw bytes of the account identifier.
   */
  public toUint8Array(): Uint8Array {
    return this.bytes;
  }

  /**
   * Returns the account identifier as an array of numbers.
   *
   * @returns An array of byte values.
   */
  public toNumbers(): number[] {
    return Array.from(this.bytes);
  }

  /**
   * Returns the raw bytes wrapped in an object under the `hash` key.
   *
   * @returns `{ hash: Uint8Array }` where `hash` is the raw 32-byte `Uint8Array`.
   */
  public toAccountIdentifierHash(): { hash: Uint8Array } {
    return {
      hash: this.toUint8Array(),
    };
  }
}

/**
 * A subaccount in the ICP ledger is a 32-byte identifier that allows a principal (user or canister)
 * to control multiple independent accounts under the same principal.
 *
 * @see https://internetcomputer.org/docs/references/ledger#_accounts
 */
export class SubAccount {
  private constructor(private readonly bytes: Uint8Array) {}

  /**
   * Creates a `SubAccount` from a 32‑byte array.
   *
   * @param bytes - A `Uint8Array` of exactly 32 bytes.
   * @throws If the byte array length is not 32.
   * @returns A `SubAccount` instance.
   */
  public static fromBytes(bytes: Uint8Array): SubAccount {
    if (bytes.length !== 32) {
      throw new Error("Subaccount length must be 32-bytes");
    }

    return new SubAccount(bytes);
  }

  /**
   * Generates a `SubAccount` from a principal.
   *
   * The principal is embedded into the beginning of a 32‑byte array.
   *
   * @param principal - A principal to encode into the subaccount.
   * @returns A `SubAccount` instance.
   */
  public static fromPrincipal(principal: Principal): SubAccount {
    const bytes = new Uint8Array(32).fill(0);

    const principalBytes = principal.toUint8Array();
    bytes[0] = principalBytes.length;

    for (let i = 0; i < principalBytes.length; i++) {
      bytes[1 + i] = principalBytes[i];
    }

    return new SubAccount(bytes);
  }

  /**
   * Generates a `SubAccount` from a non‑negative number.
   *
   * The number is encoded into the last 8 bytes of the 32‑byte array.
   * This is a common pattern when using numbered subaccounts like 0, 1, 2...
   *
   * @param id - A non-negative integer.
   * @throws If the number is negative or exceeds `Number.MAX_SAFE_INTEGER`.
   * @returns A `SubAccount` instance.
   */
  public static fromID(id: number): SubAccount {
    if (id < 0) {
      throw new Error("Number cannot be negative");
    }

    if (id > Number.MAX_SAFE_INTEGER) {
      throw new Error("Number is too large to fit in 32 bytes.");
    }

    const view = new DataView(new ArrayBuffer(32));

    // Fix for IOS < 14.8 setBigUint64 absence
    if (typeof view.setBigUint64 === "function") {
      view.setBigUint64(24, BigInt(id));
    } else {
      const TWO_TO_THE_32 = BigInt(1) << BigInt(32);
      view.setUint32(24, Number(BigInt(id) >> BigInt(32)));
      view.setUint32(28, Number(BigInt(id) % TWO_TO_THE_32));
    }

    const uint8Arary = new Uint8Array(view.buffer);
    return new SubAccount(uint8Arary);
  }

  /**
   * Returns the raw 32-byte `Uint8Array` representing this subaccount.
   *
   * @returns A 32-byte array.
   */
  public toUint8Array(): Uint8Array {
    return this.bytes;
  }
}
