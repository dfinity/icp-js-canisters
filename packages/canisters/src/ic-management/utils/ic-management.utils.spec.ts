import { mockSnapshotId, mockSnapshotIdHex } from "../ic-management.mock";
import {
  decodeSnapshotId,
  encodeSnapshotId,
  mapSnapshotId,
} from "./ic-management.utils";

describe("ic-management.utils", () => {
  it("should correctly encode a snapshot ID with encodeSnapshotId", () => {
    const encoded = encodeSnapshotId(mockSnapshotId);

    expect(encoded).toBe(mockSnapshotIdHex);
  });

  it("should correctly decode a snapshot ID with decodeSnapshotId", () => {
    const decoded = decodeSnapshotId(mockSnapshotIdHex);

    expect(decoded).toEqual(mockSnapshotId);
  });

  it("should encodeSnapshotId and decodeSnapshotId", () => {
    const encoded = encodeSnapshotId(mockSnapshotId);
    const decoded = decodeSnapshotId(encoded);

    expect(decoded).toEqual(mockSnapshotId);
  });

  describe("mapSnapshotId", () => {
    it("should map a Uint8Array snapshot ID without changes", () => {
      const result = mapSnapshotId(mockSnapshotId);

      expect(result).toEqual(mockSnapshotId);
    });

    it("should map a string snapshot ID by decoding it", () => {
      const result = mapSnapshotId(mockSnapshotIdHex);

      expect(result).toEqual(mockSnapshotId);
    });
  });
});
