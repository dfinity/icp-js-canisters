import type { read_canister_snapshot_metadata_response } from "../candid/ic-management";
import {
  fromReadCanisterSnapshotMetadataResponse,
  type ReadCanisterSnapshotMetadataResponse,
} from "./snapshot.responses";

describe("snapshot.responses", () => {
  const mockResponse: read_canister_snapshot_metadata_response = {
    globals: [
      { i32: 1 },
      { i64: 2n },
      { f32: 3.14 },
      { f64: 6.28 },
      { v128: 0n },
    ],
    canister_version: 42n,
    source: { metadata_upload: { hello: "world test" } },
    certified_data: new Uint8Array([1, 2, 3]),
    global_timer: [],
    on_low_wasm_memory_hook_status: [],
    wasm_module_size: 1000n,
    stable_memory_size: 2000n,
    wasm_chunk_store: [{ hash: new Uint8Array([9, 9, 9]) }],
    taken_at_timestamp: 123456789n,
    wasm_memory_size: 3000n,
  };

  it("should map fields", () => {
    const mapped = fromReadCanisterSnapshotMetadataResponse(mockResponse);

    const expected: ReadCanisterSnapshotMetadataResponse = {
      globals: mockResponse.globals,
      canisterVersion: mockResponse.canister_version,
      source: { metadataUpload: { hello: "world test" } },
      certifiedData: mockResponse.certified_data,
      globalTimer: undefined,
      onLowWasmMemoryHookStatus: undefined,
      wasmModuleSize: mockResponse.wasm_module_size,
      stableMemorySize: mockResponse.stable_memory_size,
      wasmChunkStore: mockResponse.wasm_chunk_store,
      takenAtTimestamp: mockResponse.taken_at_timestamp,
      wasmMemorySize: mockResponse.wasm_memory_size,
    };

    expect(mapped).toStrictEqual(expected);
  });

  it("should map source with taken_from_canister", () => {
    const candid: read_canister_snapshot_metadata_response = {
      ...mockResponse,
      source: { taken_from_canister: { hello: "world" } },
    };

    const mapped = fromReadCanisterSnapshotMetadataResponse(candid);

    expect(mapped.source).toStrictEqual({
      takenFromCanister: { hello: "world" },
    });
  });

  describe("global_timer", () => {
    it("should map active global_timer", () => {
      const candid: read_canister_snapshot_metadata_response = {
        ...mockResponse,
        global_timer: [{ active: 787n }],
      };

      const mapped = fromReadCanisterSnapshotMetadataResponse(candid);

      expect(mapped.globalTimer).toStrictEqual({ active: 787n });
    });

    it("should map inactive global_timer", () => {
      const candid: read_canister_snapshot_metadata_response = {
        ...mockResponse,
        global_timer: [{ inactive: null }],
      };

      const mapped = fromReadCanisterSnapshotMetadataResponse(candid);

      expect(mapped.globalTimer).toStrictEqual({ inactive: null });
    });
  });

  describe("onLowWasmMemoryHookStatus", () => {
    it("should map condition_not_satisfied", () => {
      const candid: read_canister_snapshot_metadata_response = {
        ...mockResponse,
        on_low_wasm_memory_hook_status: [{ condition_not_satisfied: null }],
      };

      const mapped = fromReadCanisterSnapshotMetadataResponse(candid);

      expect(mapped.onLowWasmMemoryHookStatus).toStrictEqual({
        conditionNotSatisfied: null,
      });
    });

    it("should map executed", () => {
      const candid: read_canister_snapshot_metadata_response = {
        ...mockResponse,
        on_low_wasm_memory_hook_status: [{ executed: null }],
      };

      const mapped = fromReadCanisterSnapshotMetadataResponse(candid);

      expect(mapped.onLowWasmMemoryHookStatus).toStrictEqual({
        executed: null,
      });
    });

    it("should map ready", () => {
      const candid: read_canister_snapshot_metadata_response = {
        ...mockResponse,
        on_low_wasm_memory_hook_status: [{ ready: null }],
      };

      const mapped = fromReadCanisterSnapshotMetadataResponse(candid);

      expect(mapped.onLowWasmMemoryHookStatus).toStrictEqual({ ready: null });
    });

    it("should stays undefined when empty", () => {
      const candid: read_canister_snapshot_metadata_response = {
        ...mockResponse,
        on_low_wasm_memory_hook_status: [],
      };

      const mapped = fromReadCanisterSnapshotMetadataResponse(candid);

      expect(mapped.onLowWasmMemoryHookStatus).toBeUndefined();
    });
  });

  it("should throw on unsupported source variant", () => {
    const candid = {
      ...mockResponse,
      source: { something_else: 1 },
    } as unknown as read_canister_snapshot_metadata_response;

    expect(() => fromReadCanisterSnapshotMetadataResponse(candid)).toThrowError(
      "Unsupported snapshot metadata source",
    );
  });

  it("should throw on unsupported on_low_wasm_memory_hook_status variant", () => {
    const candid = {
      ...mockResponse,
      on_low_wasm_memory_hook_status: [{ unknown: null }],
    } as unknown as read_canister_snapshot_metadata_response;

    expect(() => fromReadCanisterSnapshotMetadataResponse(candid)).toThrowError(
      "Unsupported snapshot metadata on_low_wasm_memory_hook_status",
    );
  });
});
