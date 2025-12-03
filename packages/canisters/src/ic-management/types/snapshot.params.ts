import { assertNever, isNullish, nonNullish, toNullable } from "@dfinity/utils";
import type { Principal } from "@icp-sdk/core/principal";
import type {
  canister_id,
  read_canister_snapshot_data_args,
  snapshot_id,
  take_canister_snapshot_args,
  upload_canister_snapshot_data_args,
  upload_canister_snapshot_metadata_args,
} from "../../declarations/ic-management/ic-management";
import { mapSnapshotId } from "../utils/ic-management.utils";
import type { ReadCanisterSnapshotMetadataResponse } from "./snapshot.responses";

export type SnapshotIdText = string;

export interface OptionSnapshotParams {
  canisterId: Principal;
  snapshotId?: SnapshotIdText | snapshot_id;
}

export type SnapshotParams = Required<OptionSnapshotParams>;

export const toSnapshotArgs = ({
  canisterId: canister_id,
  snapshotId,
}: SnapshotParams): { canister_id: canister_id; snapshot_id: snapshot_id } => ({
  canister_id,
  snapshot_id: mapSnapshotId(snapshotId),
});

export const toReplaceSnapshotArgs = ({
  canisterId: canister_id,
  snapshotId,
}: OptionSnapshotParams): take_canister_snapshot_args => ({
  canister_id,
  replace_snapshot: toNullable(
    nonNullish(snapshotId) ? mapSnapshotId(snapshotId) : undefined,
  ),
});

export type CanisterSnapshotMetadataKind =
  | { wasmModule: { size: bigint; offset: bigint } }
  | { wasmMemory: { size: bigint; offset: bigint } }
  | { stableMemory: { size: bigint; offset: bigint } }
  | { wasmChunk: { hash: Uint8Array } };

export interface ReadCanisterSnapshotDataParams extends SnapshotParams {
  kind: CanisterSnapshotMetadataKind;
}

export const toCanisterSnapshotMetadataKind = (
  kind: CanisterSnapshotMetadataKind,
): read_canister_snapshot_data_args["kind"] => {
  if ("wasmModule" in kind) {
    return { wasm_module: kind.wasmModule };
  }

  if ("wasmMemory" in kind) {
    return { wasm_memory: kind.wasmMemory };
  }

  if ("stableMemory" in kind) {
    return { stable_memory: kind.stableMemory };
  }

  if ("wasmChunk" in kind) {
    return { wasm_chunk: kind.wasmChunk };
  }

  assertNever(kind, "Unsupported snapshot metadata kind");
};

export type UploadCanisterSnapshotMetadataParam = Pick<
  ReadCanisterSnapshotMetadataResponse,
  | "globals"
  | "certifiedData"
  | "globalTimer"
  | "onLowWasmMemoryHookStatus"
  | "wasmModuleSize"
  | "stableMemorySize"
  | "wasmMemorySize"
>;

export interface UploadCanisterSnapshotMetadataParams extends OptionSnapshotParams {
  metadata: UploadCanisterSnapshotMetadataParam;
}

export const toUploadCanisterSnapshotMetadata = ({
  globals,
  certifiedData: certified_data,
  globalTimer,
  onLowWasmMemoryHookStatus,
  wasmModuleSize: wasm_module_size,
  stableMemorySize: stable_memory_size,
  wasmMemorySize: wasm_memory_size,
}: UploadCanisterSnapshotMetadataParam): Omit<
  upload_canister_snapshot_metadata_args,
  "canister_id" | "replace_snapshot"
> => {
  const mapOnLowWasmMemoryHookStatus =
    (): upload_canister_snapshot_metadata_args["on_low_wasm_memory_hook_status"] => {
      if (isNullish(onLowWasmMemoryHookStatus)) {
        return toNullable();
      }

      if ("conditionNotSatisfied" in onLowWasmMemoryHookStatus) {
        return toNullable({
          condition_not_satisfied:
            onLowWasmMemoryHookStatus.conditionNotSatisfied,
        });
      }

      return toNullable(onLowWasmMemoryHookStatus);
    };

  return {
    globals,
    certified_data,
    global_timer: toNullable(globalTimer),
    on_low_wasm_memory_hook_status: mapOnLowWasmMemoryHookStatus(),
    wasm_module_size,
    stable_memory_size,
    wasm_memory_size,
  };
};

export type UploadCanisterSnapshotDataKind =
  | { wasmModule: { offset: bigint } }
  | { wasmMemory: { offset: bigint } }
  | { stableMemory: { offset: bigint } }
  | { wasmChunk: null };

export interface ReadCanisterSnapshotMetadataParams extends SnapshotParams {
  kind: CanisterSnapshotMetadataKind;
}

export interface UploadCanisterSnapshotDataParams extends SnapshotParams {
  chunk: Uint8Array;
  kind: UploadCanisterSnapshotDataKind;
}

export const toUploadCanisterSnapshotDataKind = (
  kind: UploadCanisterSnapshotDataKind,
): upload_canister_snapshot_data_args["kind"] => {
  if ("wasmModule" in kind) {
    return { wasm_module: kind.wasmModule };
  }

  if ("wasmMemory" in kind) {
    return { wasm_memory: kind.wasmMemory };
  }

  if ("stableMemory" in kind) {
    return { stable_memory: kind.stableMemory };
  }

  if ("wasmChunk" in kind) {
    return { wasm_chunk: null };
  }

  assertNever(kind, "Unsupported snapshot data kind");
};
