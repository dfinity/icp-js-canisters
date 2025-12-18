import {
  createServices,
  hexStringToUint8Array,
  toNullable,
  type QueryParams,
} from "@dfinity/utils";
import { Principal } from "@icp-sdk/core/principal";
import {
  idlFactoryCertifiedIcManagement,
  idlFactoryIcManagement,
  type IcManagementDid,
  type IcManagementService,
} from "../declarations";
import type { IcManagementCanisterOptions } from "./types/canister.options";
import {
  toCanisterSettings,
  type CanisterStatusParams,
  type ClearChunkStoreParams,
  type CreateCanisterParams,
  type InstallChunkedCodeParams,
  type InstallCodeParams,
  type ProvisionalCreateCanisterWithCyclesParams,
  type StoredChunksParams,
  type UninstallCodeParams,
  type UpdateSettingsParams,
  type UploadChunkParams,
} from "./types/ic-management.params";
import type {
  CanisterStatusResponse,
  FetchCanisterLogsResponse,
} from "./types/ic-management.responses";
import {
  toCanisterSnapshotMetadataKind,
  toReplaceSnapshotArgs,
  toSnapshotArgs,
  toUploadCanisterSnapshotDataKind,
  toUploadCanisterSnapshotMetadata,
  type OptionSnapshotParams,
  type ReadCanisterSnapshotDataParams,
  type SnapshotParams,
  type UploadCanisterSnapshotDataParams,
  type UploadCanisterSnapshotMetadataParams,
} from "./types/snapshot.params";
import {
  fromReadCanisterSnapshotMetadataResponse,
  type ReadCanisterSnapshotMetadataResponse,
} from "./types/snapshot.responses";
import { transform } from "./utils/transform.utils";

export class IcManagementCanister {
  private constructor(
    private readonly service: IcManagementService,
    private readonly certifiedService: IcManagementService,
  ) {}

  private caller = ({ certified = true }: QueryParams): IcManagementService =>
    certified ? this.certifiedService : this.service;

  public static create(options: IcManagementCanisterOptions) {
    const { service, certifiedService } = createServices<IcManagementService>({
      options: {
        ...options,
        // Resolve to "aaaaa-aa" on mainnet
        canisterId: Principal.fromHex(""),
        callTransform: transform,
        queryTransform: transform,
      },
      idlFactory: idlFactoryIcManagement,
      certifiedIdlFactory: idlFactoryCertifiedIcManagement,
    });

    return new IcManagementCanister(service, certifiedService);
  }

  /**
   * Create a new canister
   *
   * @param {Object} params
   * @param {CanisterSettings} params.settings
   * @param {BigInt} params.senderCanisterVersion
   * @returns {Promise<Principal>}
   */
  createCanister = async ({
    settings,
    senderCanisterVersion,
  }: CreateCanisterParams = {}): Promise<Principal> => {
    const { create_canister } = this.certifiedService;

    const { canister_id } = await create_canister({
      settings: toNullable(toCanisterSettings(settings)),
      sender_canister_version: toNullable(senderCanisterVersion),
    });

    return canister_id;
  };

  /**
   * Update canister settings
   *
   * @param {Object} params
   * @param {Principal} params.canisterId
   * @param {BigInt} params.senderCanisterVersion
   * @param {CanisterSettings} params.settings
   * @returns {Promise<void>}
   */
  updateSettings = ({
    canisterId,
    senderCanisterVersion,
    settings,
  }: UpdateSettingsParams): Promise<void> => {
    const { update_settings } = this.certifiedService;

    return update_settings({
      canister_id: canisterId,
      sender_canister_version: toNullable(senderCanisterVersion),
      settings: toCanisterSettings(settings),
    });
  };

  /**
   * Install code to a canister
   *
   * @param {Object} params
   * @param {canister_install_mode} params.mode
   * @param {Principal} params.canisterId
   * @param {Uint8Array} params.wasmModule
   * @param {Uint8Array} params.arg
   * @param {BigInt} params.senderCanisterVersion
   * @returns {Promise<void>}
   */
  installCode = ({
    canisterId,
    wasmModule,
    senderCanisterVersion,
    ...rest
  }: InstallCodeParams): Promise<void> => {
    const { install_code } = this.certifiedService;

    return install_code({
      ...rest,
      canister_id: canisterId,
      wasm_module: wasmModule,
      sender_canister_version: toNullable(senderCanisterVersion),
    });
  };

  /**
   * Upload chunks of Wasm modules that are too large to fit in a single message for installation purposes.
   *
   * @link https://internetcomputer.org/docs/current/references/ic-interface-spec/#ic-upload_chunk
   *
   * @param {UploadChunkParams} params
   * @param {canisterId} params.canisterId The canister in which the chunks will be stored.
   * @param {Uint8Array} params.chunk A chunk of Wasm module.
   * @returns {Promise<chunk_hash>} The hash of the stored chunk.
   */
  uploadChunk = ({
    canisterId,
    ...rest
  }: UploadChunkParams): Promise<IcManagementDid.chunk_hash> => {
    const { upload_chunk } = this.certifiedService;

    return upload_chunk({
      canister_id: canisterId,
      ...rest,
    });
  };

  /**
   * Clear the entire chunk storage of a canister.
   *
   * @link https://internetcomputer.org/docs/current/references/ic-interface-spec/#ic-clear_chunk_store
   *
   * @param {ClearChunkStoreParams} params
   * @param {canisterId} params.canisterId The canister in which the chunks are stored.
   */
  clearChunkStore = async ({
    canisterId,
  }: ClearChunkStoreParams): Promise<void> => {
    const { clear_chunk_store } = this.certifiedService;

    await clear_chunk_store({
      canister_id: canisterId,
    });
  };

  /**
   * List the hashes of chunks in the chunk storage of a canister.
   *
   * @link https://internetcomputer.org/docs/current/references/ic-interface-spec/#ic-stored_chunks
   *
   * @param {StoredChunksParams} params
   * @param {canisterId} params.canisterId The canister in which the chunks are stored.
   * @returns {Promise<chunk_hash[]>} The list of hash of the stored chunks.
   */
  storedChunks = ({
    canisterId,
  }: StoredChunksParams): Promise<IcManagementDid.chunk_hash[]> => {
    const { stored_chunks } = this.certifiedService;

    return stored_chunks({
      canister_id: canisterId,
    });
  };

  /**
   * Installs code that had previously been uploaded in chunks.
   *
   * @link https://internetcomputer.org/docs/current/references/ic-interface-spec/#ic-install_chunked_code
   *
   * @param {InstallChunkedCodeParams} params
   * @param {canister_install_mode} params.mode Installation, re-installation or upgrade.
   * @param {Uint8Array} params.arg The arguments of the canister.
   * @param {Uint8Array | undefined} params.senderCanisterVersion The optional sender_canister_version parameter can contain the caller's canister version.
   * @param {Array<chunk_hash>} params.chunkHashesList The list of chunks of the Wasm module to install.
   * @param {Principal} params.targetCanisterId Specifies the canister where the code should be installed.
   * @param {Principal | undefined} params.storeCanisterId Specifies the canister in whose chunk storage the chunks are stored (this parameter defaults to target_canister if not specified).
   * @param {String} params.wasmModuleHash The Wasm module hash as hex string. Used to check that the SHA-256 hash of wasm_module is equal to the wasm_module_hash parameter and can calls install_code with parameters.
   * @returns {Promise<void>}
   */
  installChunkedCode = async ({
    senderCanisterVersion,
    chunkHashesList,
    targetCanisterId,
    storeCanisterId,
    wasmModuleHash,
    ...rest
  }: InstallChunkedCodeParams): Promise<void> => {
    const { install_chunked_code } = this.certifiedService;

    await install_chunked_code({
      ...rest,
      target_canister: targetCanisterId,
      store_canister: toNullable(storeCanisterId),
      sender_canister_version: toNullable(senderCanisterVersion),
      chunk_hashes_list: chunkHashesList,
      wasm_module_hash:
        typeof wasmModuleHash === "string"
          ? hexStringToUint8Array(wasmModuleHash)
          : wasmModuleHash,
    });
  };

  /**
   * Uninstall code from a canister
   *
   * @param {Object} params
   * @param {Principal} params.canisterId
   * @param {BigInt} params.senderCanisterVersion
   * @returns {Promise<void>}
   */
  uninstallCode = ({
    canisterId,
    senderCanisterVersion,
  }: UninstallCodeParams): Promise<void> => {
    const { uninstall_code } = this.certifiedService;

    return uninstall_code({
      canister_id: canisterId,
      sender_canister_version: toNullable(senderCanisterVersion),
    });
  };

  /**
   * Start a canister
   *
   * @param {Principal} canisterId
   * @returns {Promise<void>}
   */
  startCanister = (canisterId: Principal): Promise<void> => {
    const { start_canister } = this.certifiedService;

    return start_canister({ canister_id: canisterId });
  };

  /**
   * Stop a canister
   *
   * @param {Principal} canisterId
   * @returns {Promise<void>}
   */
  stopCanister = (canisterId: Principal): Promise<void> => {
    const { stop_canister } = this.certifiedService;
    return stop_canister({ canister_id: canisterId });
  };

  /**
   * Get canister details (memory size, status, etc.)
   *
   * @param {CanisterStatusParams} params - The parameters for the status call.
   * @param {Principal} params.canisterId - The principal ID of the canister for which the status should be fetched.
   * @param {boolean} [params.certified] - Whether to perform a certified (update, default) or a query call.
   * @returns {Promise<CanisterStatusResponse>} A promise that resolves with the canister status details.
   *
   */
  canisterStatus = ({
    canisterId,
    certified,
  }: CanisterStatusParams): Promise<CanisterStatusResponse> => {
    const { canister_status } = this.caller({ certified });

    return canister_status({
      canister_id: canisterId,
    });
  };

  /**
   * Deletes a canister
   *
   * @param {Principal} canisterId
   * @returns {Promise<void>}
   */
  deleteCanister = (canisterId: Principal): Promise<void> => {
    const { delete_canister } = this.certifiedService;

    return delete_canister({ canister_id: canisterId });
  };

  /**
   * Creates a canister. Only available on development instances.
   *
   * @param {Object} params
   * @param {Principal} params.canisterId
   * @param {BigInt} params.amount
   * @param {CanisterSettings} params.settings
   * @returns {Promise<Principal>}
   */
  provisionalCreateCanisterWithCycles = async ({
    settings,
    amount,
    canisterId,
  }: ProvisionalCreateCanisterWithCyclesParams = {}): Promise<Principal> => {
    const { provisional_create_canister_with_cycles } = this.certifiedService;

    const { canister_id } = await provisional_create_canister_with_cycles({
      settings: toNullable(toCanisterSettings(settings)),
      amount: toNullable(amount),
      specified_id: toNullable(canisterId),
      sender_canister_version: [],
    });

    return canister_id;
  };

  /**
   * Given a canister ID as input, this method returns a vector of logs of that canister including its trap messages. The canister logs are not collected in canister methods running in non-replicated mode (NRQ, CQ, CRy, CRt, CC, and F modes, as defined in Overview of imports). The total size of all returned logs does not exceed 4KiB. If new logs are added resulting in exceeding the maximum total log size of 4KiB, the oldest logs will be removed. Logs persist across canister upgrades and they are deleted if the canister is reinstalled or uninstalled.
   *
   * @param {Principal} canisterId
   * @returns {Promise<FetchCanisterLogsResponse>}
   */
  fetchCanisterLogs = (
    canisterId: Principal,
  ): Promise<FetchCanisterLogsResponse> => {
    const { fetch_canister_logs } = this.caller({ certified: false });

    return fetch_canister_logs({
      canister_id: canisterId,
    });
  };

  /**
   * This method takes a snapshot of the specified canister. A snapshot consists of the wasm memory, stable memory, certified variables, wasm chunk store and wasm binary.
   *
   * @link https://internetcomputer.org/docs/current/references/ic-interface-spec#ic-take_canister_snapshot
   *
   * @param {Object} params - Parameters for the snapshot operation.
   * @param {Principal} params.canisterId - The ID of the canister for which the snapshot will be taken.
   * @param {SnapshotIdText | snapshot_id} [params.snapshotId] - The ID of the snapshot to replace, if applicable.
   * Can be provided as a `string` or a `Uint8Array`.
   * If not provided, a new snapshot will be created.
   * @param {boolean} [params.uninstallCode] - If true, automatically uninstalls the canister's code and state after the snapshot is successfully created.
   * @param {BigInt} [params.senderCanisterVersion] - The optional sender canister version. If provided, its value must be equal to ic0.canister_version.
   *
   * @returns {Promise<take_canister_snapshot_result>} A promise that resolves with the snapshot details,
   * including the snapshot ID, total size, and timestamp.
   *
   * @throws {Error} If the snapshot operation fails.
   */
  takeCanisterSnapshot = ({
    senderCanisterVersion,
    uninstallCode,
    ...params
  }: OptionSnapshotParams & {
    uninstallCode?: boolean;
    senderCanisterVersion?: bigint;
  }): Promise<IcManagementDid.take_canister_snapshot_result> => {
    const { take_canister_snapshot } = this.certifiedService;

    return take_canister_snapshot({
      ...toReplaceSnapshotArgs(params),
      sender_canister_version: toNullable(senderCanisterVersion),
      uninstall_code: toNullable(uninstallCode),
    });
  };

  /**
   * Lists the snapshots of a canister.
   *
   * @link https://internetcomputer.org/docs/current/references/ic-interface-spec#ic-list_canister_snapshots
   *
   * @param {Object} params - Parameters for the listing operation.
   * @param {Principal} params.canisterId - The ID of the canister for which snapshots will be listed.
   *
   * @returns {Promise<list_canister_snapshots_result>} A promise that resolves with the list of snapshots.
   *
   * @throws {Error} If the operation fails.
   */
  listCanisterSnapshots = ({
    canisterId,
  }: {
    canisterId: Principal;
  }): Promise<IcManagementDid.list_canister_snapshots_result> => {
    const { list_canister_snapshots } = this.certifiedService;

    return list_canister_snapshots({
      canister_id: canisterId,
    });
  };

  /**
   * Loads a snapshot of a canister's state.
   *
   * @link https://internetcomputer.org/docs/current/references/ic-interface-spec#ic-load_canister_snapshot
   *
   * @param {Object} params - Parameters for the snapshot loading operation.
   * @param {Principal} params.canisterId - The ID of the canister for which the snapshot will be loaded.
   * @param {snapshot_id} params.snapshotId - The ID of the snapshot to load.
   * @param {BigInt} [params.senderCanisterVersion] - The optional sender canister version. If provided, its value must be equal to ic0.canister_version.
   *
   * @returns {Promise<void>} A promise that resolves when the snapshot is successfully loaded.
   *
   * @throws {Error} If the snapshot loading operation fails.
   */
  loadCanisterSnapshot = async ({
    senderCanisterVersion,
    ...rest
  }: SnapshotParams & {
    senderCanisterVersion?: bigint;
  }): Promise<void> => {
    const { load_canister_snapshot } = this.certifiedService;

    await load_canister_snapshot({
      ...toSnapshotArgs(rest),
      sender_canister_version: toNullable(senderCanisterVersion),
    });
  };

  /**
   * Deletes a specific snapshot of a canister.
   *
   * @link https://internetcomputer.org/docs/current/references/ic-interface-spec#ic-delete_canister_snapshot
   *
   * @param {Object} params - Parameters for the deletion operation.
   * @param {Principal} params.canisterId - The ID of the canister for which the snapshot will be deleted.
   * @param {snapshot_id} params.snapshotId - The ID of the snapshot to delete.
   *
   * @returns {Promise<void>} A promise that resolves when the snapshot is successfully deleted.
   *
   * @throws {Error} If the deletion operation fails.
   */
  deleteCanisterSnapshot = async (params: SnapshotParams): Promise<void> => {
    const { delete_canister_snapshot } = this.certifiedService;

    await delete_canister_snapshot(toSnapshotArgs(params));
  };

  /**
   * Reads metadata for a specific canister snapshot.
   *
   * @link https://internetcomputer.org/docs/current/references/ic-interface-spec#ic-read_canister_snapshot_metadata
   *
   * @param {Object} params - Parameters for the metadata read operation.
   * @param {Principal} params.canisterId - The ID of the canister whose snapshot metadata will be read.
   * @param {SnapshotIdText | snapshot_id} params.snapshotId - The ID of the snapshot to read metadata from.
   *
   * @returns {Promise<read_canister_snapshot_metadata_response>} A promise that resolves with the snapshot metadata.
   *
   * @throws {Error} If the metadata read operation fails.
   */
  readCanisterSnapshotMetadata = async (
    params: SnapshotParams,
  ): Promise<ReadCanisterSnapshotMetadataResponse> => {
    const { read_canister_snapshot_metadata } = this.certifiedService;

    const metadata = await read_canister_snapshot_metadata(
      toSnapshotArgs(params),
    );

    return fromReadCanisterSnapshotMetadataResponse(metadata);
  };

  /**
   * Reads snapshot data for a specific canister snapshot and kind.
   *
   * @link https://internetcomputer.org/docs/current/references/ic-interface-spec#ic-read_canister_snapshot_data
   *
   * @param {Object} params - Parameters for the data read operation.
   * @param {Principal} params.canisterId - The ID of the canister whose snapshot data will be read.
   * @param {SnapshotIdText | snapshot_id} params.snapshotId - The ID of the snapshot to read data from.
   * @param {CanisterSnapshotMetadataKind} params.kind - The kind of data to read.
   *
   * @returns {Promise<read_canister_snapshot_data_response>} A promise that resolves with the snapshot data payload.
   *
   * @throws {Error} If the data read operation fails.
   */
  readCanisterSnapshotData = ({
    kind,
    ...params
  }: ReadCanisterSnapshotDataParams): Promise<IcManagementDid.read_canister_snapshot_data_response> => {
    const { read_canister_snapshot_data } = this.certifiedService;

    return read_canister_snapshot_data({
      ...toSnapshotArgs(params),
      kind: toCanisterSnapshotMetadataKind(kind),
    });
  };

  /**
   * Uploads snapshot metadata for a canister.
   *
   * @link https://internetcomputer.org/docs/current/references/ic-interface-spec#ic-upload_canister_snapshot_metadata
   *
   * @param {Object} params - Parameters for the metadata upload operation.
   * @param {Principal} params.canisterId - The ID of the canister the snapshot metadata belongs to.
   * @param {UploadCanisterSnapshotMetadataParam} params.metadata - The metadata payload to upload.
   * @param {SnapshotIdText | snapshot_id} [params.snapshotId] - If provided, replace a snapshot instead of creating a new one.
   *
   * @returns {Promise<upload_canister_snapshot_metadata_response>} A promise that resolves with the upload response.
   *
   * @throws {Error} If the metadata upload operation fails.
   */
  uploadCanisterSnapshotMetadata = ({
    metadata,
    ...params
  }: UploadCanisterSnapshotMetadataParams): Promise<IcManagementDid.upload_canister_snapshot_metadata_response> => {
    const { upload_canister_snapshot_metadata } = this.certifiedService;

    return upload_canister_snapshot_metadata({
      ...toUploadCanisterSnapshotMetadata(metadata),
      ...toReplaceSnapshotArgs(params),
    });
  };

  /**
   * Uploads a chunk of snapshot data for a canister snapshot.
   *
   * @link https://internetcomputer.org/docs/current/references/ic-interface-spec#ic-upload_canister_snapshot_data
   *
   * @param {Object} params - Parameters for the data upload operation.
   * @param {Principal} params.canisterId - The ID of the canister the snapshot belongs to.
   * @param {SnapshotIdText | snapshot_id} params.snapshotId - The ID of the snapshot to which data is uploaded.
   * @param {UploadCanisterSnapshotDataKind} params.kind - The target to upload to.
   * @param {Uint8Array} params.chunk - The raw bytes to upload.
   *
   * @returns {Promise<void>} A promise that resolves when the data is successfully uploaded.
   *
   * @throws {Error} If the data upload operation fails.
   */
  uploadCanisterSnapshotData = async ({
    kind,
    chunk,
    ...params
  }: UploadCanisterSnapshotDataParams): Promise<void> => {
    const { upload_canister_snapshot_data } = this.certifiedService;

    await upload_canister_snapshot_data({
      ...toSnapshotArgs(params),
      chunk,
      kind: toUploadCanisterSnapshotDataKind(kind),
    });
  };
}
