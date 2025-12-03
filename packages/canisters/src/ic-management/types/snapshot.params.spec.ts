import { toNullable } from "@dfinity/utils";
import {
  mockCanisterId,
  mockSnapshotId,
  mockSnapshotIdHex,
} from "../ic-management.mock";
import {
  toCanisterSnapshotMetadataKind,
  toReplaceSnapshotArgs,
  toSnapshotArgs,
  toUploadCanisterSnapshotDataKind,
  toUploadCanisterSnapshotMetadata,
  type UploadCanisterSnapshotMetadataParam,
} from "./snapshot.params";

describe("snapshot.params", () => {
  describe("toSnapshotArgs", () => {
    it("should map snapshot params to did arguments", () => {
      const args = toSnapshotArgs({
        canisterId: mockCanisterId,
        snapshotId: mockSnapshotIdHex,
      });

      expect(args).toStrictEqual({
        canister_id: mockCanisterId,
        snapshot_id: mockSnapshotId,
      });
    });
  });

  describe("toReplaceSnapshotArgs", () => {
    it("should map replace snapshot params to did arguments with omitted snapshot ID", () => {
      const args = toReplaceSnapshotArgs({
        canisterId: mockCanisterId,
      });

      expect(args).toStrictEqual({
        canister_id: mockCanisterId,
        replace_snapshot: toNullable(),
      });
    });

    it("should map replace snapshot params to did arguments with snapshot ID", () => {
      const args = toReplaceSnapshotArgs({
        canisterId: mockCanisterId,
        snapshotId: mockSnapshotIdHex,
      });

      expect(args).toStrictEqual({
        canister_id: mockCanisterId,
        replace_snapshot: toNullable(mockSnapshotId),
      });
    });
  });

  describe("toCanisterSnapshotMetadataKind", () => {
    it("should map wasmModule", () => {
      const kind = toCanisterSnapshotMetadataKind({
        wasmModule: { size: 1024n, offset: 0n },
      });

      expect(kind).toStrictEqual({ wasm_module: { size: 1024n, offset: 0n } });
    });

    it("should map wasmMemory", () => {
      const kind = toCanisterSnapshotMetadataKind({
        wasmMemory: { size: 2048n, offset: 64n },
      });

      expect(kind).toStrictEqual({ wasm_memory: { size: 2048n, offset: 64n } });
    });

    it("should map stableMemory", () => {
      const kind = toCanisterSnapshotMetadataKind({
        stableMemory: { size: 4096n, offset: 128n },
      });

      expect(kind).toStrictEqual({
        stable_memory: { size: 4096n, offset: 128n },
      });
    });

    it("should map wasmChunk", () => {
      const hash = new Uint8Array([1, 2, 3]);
      const kind = toCanisterSnapshotMetadataKind({ wasmChunk: { hash } });

      expect(kind).toStrictEqual({ wasm_chunk: { hash } });
    });

    it("throws on unsupported kind", () => {
      expect(() =>
        // @ts-expect-error - intentionally invalid
        toCanisterSnapshotMetadataKind({ nope: true }),
      ).toThrowError("Unsupported snapshot metadata kind");
    });
  });

  describe("toUploadCanisterSnapshotMetadata", () => {
    const mockParam: UploadCanisterSnapshotMetadataParam = {
      globals: [{ i32: 5 }, { i64: 10n }],
      certifiedData: new Uint8Array([7, 8, 9]),
      globalTimer: undefined,
      onLowWasmMemoryHookStatus: undefined,
      wasmModuleSize: 10000n,
      stableMemorySize: 20000n,
      wasmMemorySize: 30000n,
    };

    it("should map all fields and nullable", () => {
      const mapped = toUploadCanisterSnapshotMetadata(mockParam);

      expect(mapped).toStrictEqual({
        globals: mockParam.globals,
        certified_data: mockParam.certifiedData,
        global_timer: toNullable(undefined),
        on_low_wasm_memory_hook_status: toNullable(),
        wasm_module_size: mockParam.wasmModuleSize,
        stable_memory_size: mockParam.stableMemorySize,
        wasm_memory_size: mockParam.wasmMemorySize,
      });
    });

    it("should map globalTimer when provided", () => {
      const mapped = toUploadCanisterSnapshotMetadata({
        ...mockParam,
        globalTimer: { active: 123n },
      });

      expect(mapped.global_timer).toStrictEqual(toNullable({ active: 123n }));
    });

    it("should map onLowWasmMemoryHookStatus with conditionNotSatisfied", () => {
      const mapped = toUploadCanisterSnapshotMetadata({
        ...mockParam,
        onLowWasmMemoryHookStatus: { conditionNotSatisfied: null },
      });

      expect(mapped.on_low_wasm_memory_hook_status).toStrictEqual(
        toNullable({ condition_not_satisfied: null }),
      );
    });

    it("should map onLowWasmMemoryHookStatus with executed", () => {
      const mapped = toUploadCanisterSnapshotMetadata({
        ...mockParam,
        onLowWasmMemoryHookStatus: { executed: null },
      });

      expect(mapped.on_low_wasm_memory_hook_status).toStrictEqual(
        toNullable({ executed: null }),
      );
    });

    it("should map onLowWasmMemoryHookStatus with ready", () => {
      const mapped = toUploadCanisterSnapshotMetadata({
        ...mockParam,
        onLowWasmMemoryHookStatus: { ready: null },
      });

      expect(mapped.on_low_wasm_memory_hook_status).toStrictEqual(
        toNullable({ ready: null }),
      );
    });
  });

  describe("toUploadCanisterSnapshotDataKind", () => {
    it("should map wasmModule", () => {
      const kind = toUploadCanisterSnapshotDataKind({
        wasmModule: { offset: 234n },
      });

      expect(kind).toStrictEqual({ wasm_module: { offset: 234n } });
    });

    it("should map wasmMemory", () => {
      const kind = toUploadCanisterSnapshotDataKind({
        wasmMemory: { offset: 64n },
      });

      expect(kind).toStrictEqual({ wasm_memory: { offset: 64n } });
    });

    it("should map stableMemory", () => {
      const kind = toUploadCanisterSnapshotDataKind({
        stableMemory: { offset: 128n },
      });

      expect(kind).toStrictEqual({ stable_memory: { offset: 128n } });
    });

    it("should map wasmChunk", () => {
      const kind = toUploadCanisterSnapshotDataKind({ wasmChunk: null });

      expect(kind).toStrictEqual({ wasm_chunk: null });
    });

    it("throws on unsupported kind", () => {
      expect(() =>
        // @ts-expect-error - intentionally invalid
        toUploadCanisterSnapshotDataKind({ nope: true }),
      ).toThrowError("Unsupported snapshot data kind");
    });
  });
});
