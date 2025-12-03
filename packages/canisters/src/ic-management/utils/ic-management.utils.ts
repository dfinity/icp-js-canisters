import { hexStringToUint8Array, uint8ArrayToHexString } from "@dfinity/utils";
import type { snapshot_id } from "../../declarations/ic-management/ic-management";
import type { SnapshotIdText } from "../types/snapshot.params";

/**
 * Encodes a snapshot ID into a hex string representation.
 *
 * A snapshot ID is a tuple `(CanisterId, u64)`, where:
 * - `CanisterId` is a unique identifier for a canister.
 * - `u64` is a subnet-local number (incremented for each new snapshot).
 *
 * @param {snapshot_id} snapshotId - The snapshot ID to encode, represented as a `Uint8Array` or an array of numbers.
 * @returns {string} The hex string representation of the snapshot ID.
 */
export const encodeSnapshotId = (snapshotId: snapshot_id): SnapshotIdText =>
  uint8ArrayToHexString(snapshotId);

/**
 * Decodes a hex string representation of a snapshot ID back into its original format.
 *
 * A snapshot ID is a tuple `(CanisterId, u64)`, where:
 * - `CanisterId` is a unique identifier for a canister.
 * - `u64` is a subnet-local number (incremented for each new snapshot).
 *
 * @param {string} snapshotId - The hex string representation of the snapshot ID.
 * @returns {snapshot_id} The decoded snapshot ID as a `Uint8Array`.
 */
export const decodeSnapshotId = (snapshotId: SnapshotIdText): snapshot_id =>
  hexStringToUint8Array(snapshotId);

/**
 * Maps a snapshot ID to the appropriate format for the IC interface.
 *
 * @param {SnapshotIdText | snapshot_id} snapshotId - The snapshot ID to map.
 * It can either be a `string` (SnapshotIdText) or a `Uint8Array | number[]` (snapshot_id).
 * If a `string` is provided, it is decoded into a `Uint8Array` using `decodeSnapshotId`.
 *
 * @returns {Uint8Array} The mapped snapshot ID.
 */
export const mapSnapshotId = (
  snapshotId: SnapshotIdText | snapshot_id,
): snapshot_id =>
  typeof snapshotId === "string" ? decodeSnapshotId(snapshotId) : snapshotId;
