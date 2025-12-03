import { assertNever, fromNullable, isNullish } from "@dfinity/utils";
import type { read_canister_snapshot_metadata_response } from "../../declarations/ic-management/ic-management";

export interface ReadCanisterSnapshotMetadataResponse {
  globals: (
    | { f32: number }
    | { f64: number }
    | { i32: number }
    | { i64: bigint }
    | { v128: bigint }
  )[];
  canisterVersion: bigint;
  source: { metadataUpload: unknown } | { takenFromCanister: unknown };
  certifiedData: Uint8Array;
  globalTimer?: { active: bigint } | { inactive: null };
  onLowWasmMemoryHookStatus?:
    | { conditionNotSatisfied: null }
    | { executed: null }
    | { ready: null };
  wasmModuleSize: bigint;
  stableMemorySize: bigint;
  wasmChunkStore: Array<{ hash: Uint8Array }>;
  takenAtTimestamp: bigint;
  wasmMemorySize: bigint;
}

export const fromReadCanisterSnapshotMetadataResponse = ({
  globals,
  canister_version: canisterVersion,
  source,
  certified_data: certifiedData,
  global_timer,
  on_low_wasm_memory_hook_status,
  wasm_module_size: wasmModuleSize,
  stable_memory_size: stableMemorySize,
  wasm_chunk_store: wasmChunkStore,
  taken_at_timestamp: takenAtTimestamp,
  wasm_memory_size: wasmMemorySize,
}: read_canister_snapshot_metadata_response): ReadCanisterSnapshotMetadataResponse => {
  const mapSource = (): ReadCanisterSnapshotMetadataResponse["source"] => {
    if ("metadata_upload" in source) {
      return { metadataUpload: source.metadata_upload };
    }

    if ("taken_from_canister" in source) {
      return { takenFromCanister: source.taken_from_canister };
    }

    assertNever(source, "Unsupported snapshot metadata source");
  };

  const mapOnLowWasmMemoryHookStatus =
    (): ReadCanisterSnapshotMetadataResponse["onLowWasmMemoryHookStatus"] => {
      const value = fromNullable(on_low_wasm_memory_hook_status);

      if (isNullish(value)) {
        return undefined;
      }

      if ("condition_not_satisfied" in value) {
        return { conditionNotSatisfied: value.condition_not_satisfied };
      }

      if ("executed" in value) {
        return { executed: value.executed };
      }

      if ("ready" in value) {
        return { ready: value.ready };
      }

      assertNever(
        value,
        "Unsupported snapshot metadata on_low_wasm_memory_hook_status",
      );
    };

  return {
    globals,
    canisterVersion,
    source: mapSource(),
    certifiedData,
    globalTimer: fromNullable(global_timer),
    onLowWasmMemoryHookStatus: mapOnLowWasmMemoryHookStatus(),
    wasmModuleSize,
    stableMemorySize,
    wasmChunkStore,
    takenAtTimestamp,
    wasmMemorySize,
  };
};
