/* eslint-disable local-rules/prefer-object-params */

/**
 * ## Quick Start
 *
 * The `AssetManager` supports the (chunked) upload of `File`, `Blob`, `ArrayBuffer`, `Uint8Array` and `number[]`.
 *
 * Create an asset manager instance:
 *
 * ```ts
 * import { AssetManager } from "@icp-sdk/canisters/assets";
 *
 * const assetManager = new AssetManager({
 *     canisterId: ..., // Principal of assets canister
 *     agent: ..., // Identity in agent must be authorized by the assets canister to make any changes
 * });
 * ```
 *
 * Select file and upload to asset canister from the browser:
 *
 * ```ts
 * const input = document.createElement('input');
 * input.type = 'file';
 * input.addEventListener('change', async e => {
 *   const file = e.target.files[0];
 *   const key = await assetManager.store(file);
 * });
 * input.click();
 * ```
 *
 * A config argument can be optionally passed as second argument in the `store` method.
 * The `fileName` property is required when the data passed in the first argument
 * is not a `File`, file path or custom `Readable` implementation.
 *
 * List files stored in the asset canister:
 *
 * ```ts
 * const files = await assetManager.list();
 * ```
 *
 * Upload multiple files and delete an existing file as batch in Node.js:
 *
 * ```ts
 * import fs from 'fs';
 *
 * const banana = fs.readFileSync('./banana.png');
 * const apple = fs.readFileSync('./apple.png');
 * const strawberry = fs.readFileSync('./strawberry.png');
 * const batch = assetManager.batch();
 * const keys = [
 *   await batch.store(banana, { fileName: 'banana.png' }),
 *   await batch.store(apple, { fileName: 'apple.png', path: '/directory/with/apples' }),
 *   await batch.store(strawberry, { fileName: 'strawberry.png' }),
 * ];
 * await batch.delete('/path/to/old/file.csv');
 * await batch.commit();
 * ```
 *
 * Read file from disk, compress with gzip and upload to asset canister in Node.js,
 * GZIP compression is recommended for HTML and JS files:
 *
 * ```ts
 * import fs from 'fs';
 *
 * const file = fs.readFileSync('./index.html');
 * const gzippedFile = // gzip the file here
 * const key = await assetManager.insert(gzippedFile, {
 *   fileName: 'index.html',
 *   contentEncoding: 'gzip',
 * });
 * ```
 *
 * Download image asset to blob and open in new browser tab:
 *
 * ```ts
 * const asset = await assetManager.get('/path/to/file/on/asset/canister/motoko.png');
 * const blob = await asset.toBlob();
 * const url = URL.createObjectURL(blob);
 *
 * window.open(URL.createObjectURL(blob, '_blank'));
 * ```
 *
 * Download and write asset to path in Node.js:
 *
 * ```ts
 * const asset = await assetManager.get('/large_dataset.csv');
 * asset.write('/large_dataset.csv');
 * ```
 *
 * @module api/assets
 */

import { base64ToUint8Array } from "@dfinity/utils";
import {
  Actor,
  type ActorConfig,
  type ActorSubclass,
  Cbor as cbor,
  Certificate,
  type HashTree,
  HttpAgent,
  lookup_path,
  LookupPathStatus,
  lookupResultToBuffer,
  reconstruct,
} from "@icp-sdk/core/agent";
import { compare, lebDecode, PipeArrayBuffer } from "@icp-sdk/core/candid";
import { sha256 } from "@noble/hashes/sha2";
import type { AssetsDid, AssetsService } from "../declarations";
import { getAssetsCanister } from "./assets.canister";
import { isReadable, type Readable } from "./readable/readable";
import { ReadableBlob } from "./readable/readable-blob";
import { ReadableBytes } from "./readable/readable-bytes";
import { ReadableFile } from "./readable/readable-file";
import { ReadablePath } from "./readable/readable-path";
import { type AssetDetails, entriesEqual } from "./utils/assets";
import fs from "./utils/fs-polyfill";
import { limit, type LimitFn } from "./utils/limit";

const DEFAULT_LIST_ASSETS_PAGE_SIZE = BigInt(100);

/**
 * Supported content encodings by asset canister
 */
export type ContentEncoding =
  | "identity"
  | "gzip"
  | "compress"
  | "deflate"
  | "br";

/**
 * Upload progress in bytes
 */
export interface Progress {
  current: number;
  total: number;
}

/**
 * Configuration that can be passed to set and override defaults and add progress callback
 */
export interface StoreConfig {
  /**
   * File name
   * @default File object name or name in file path
   */
  fileName?: string;
  /**
   * File path that file will be uploaded to
   * @default '/'
   */
  path?: string;
  /**
   * File content type
   * @default File/Blob object type or type from file name extension
   */
  contentType?: string;
  /**
   * Custom headers to be sent with the asset
   * @default []
   */
  headers?: Array<[string, string]>;
  /**
   * Content encoding
   * @default 'identity'
   */
  contentEncoding?: ContentEncoding;
  /**
   * File hash generation will be skipped if hash is provided
   */
  sha256?: Uint8Array;
  /**
   * Callback method to get upload progress in bytes (current / total)
   */
  onProgress?: (progress: Progress) => void;
}

export type StoreReadableArgs = [readable: Readable, config?: StoreConfig];

export type StoreFileArgs = [file: File, config?: StoreConfig];

export type StoreBlobArgs = [
  blob: Blob,
  config: Omit<StoreConfig, "fileName"> &
    Required<Pick<StoreConfig, "fileName">>,
];

export type StorePathArgs = [path: string, config?: StoreConfig];

export type StoreBytesArgs = [
  bytes: Uint8Array | ArrayBuffer | number[],
  config: Omit<StoreConfig, "fileName"> &
    Required<Pick<StoreConfig, "fileName">>,
];

/**
 * Arguments to store an asset in asset manager
 */
export type StoreArgs =
  | StoreReadableArgs
  | StoreFileArgs
  | StoreBlobArgs
  | StorePathArgs
  | StoreBytesArgs;

/**
 * Arguments to commit batch in asset manager
 */
export interface CommitBatchArgs {
  onProgress?: (progress: Progress) => void;
}

/**
 * Configuration that can be passed to set the canister id of the
 * assets canister to be managed, inherits actor configuration and
 * has additional asset manager specific configuration options.
 */
export interface AssetManagerConfig extends ActorConfig {
  /**
   * Max number of concurrent requests to the Internet Computer
   * @default 16
   */
  concurrency?: number;
  /**
   * Max file size in bytes that the asset manager shouldn't chunk
   * @default 1900000
   */
  maxSingleFileSize?: number;
  /**
   * Size of each chunk in bytes when the asset manager has to chunk a file
   * @default 1900000
   */
  maxChunkSize?: number;
}

export class AssetManager {
  private readonly _actor: ActorSubclass<AssetsService>;
  private readonly _limit: LimitFn;
  private readonly _maxSingleFileSize: number;
  private readonly _maxChunkSize: number;

  /**
   * Create assets canister manager instance
   * @param config Additional configuration options, canister id is required
   */
  constructor(config: AssetManagerConfig) {
    const { concurrency, maxSingleFileSize, maxChunkSize, ...actorConfig } =
      config;
    this._actor = getAssetsCanister(actorConfig);
    this._limit = limit(concurrency ?? 16);
    this._maxSingleFileSize = maxSingleFileSize ?? 1900000;
    this._maxChunkSize = maxChunkSize ?? 1900000;
  }

  /**
   * Create readable from store arguments
   * @param args Arguments with either a file, blob, path, bytes or custom Readable implementation
   */
  static async toReadable(...args: StoreArgs): Promise<Readable> {
    if (typeof File === "function" && args[0] instanceof File) {
      return new ReadableFile(args[0]);
    }
    if (
      typeof Blob === "function" &&
      args[0] instanceof Blob &&
      args[1]?.fileName
    ) {
      return new ReadableBlob(args[1].fileName, args[0]);
    }
    if (typeof args[0] === "string") {
      return await ReadablePath.create(args[0]);
    }
    if (
      (Array.isArray(args[0]) ||
        args[0] instanceof Uint8Array ||
        args[0] instanceof ArrayBuffer) &&
      args[1]?.fileName
    ) {
      return new ReadableBytes(args[1].fileName, args[0]);
    }
    if (isReadable(args[0])) {
      return args[0];
    }

    throw new Error("Invalid arguments, readable could not be created");
  }

  /**
   * Get list of all files in assets canister.
   * @returns All files in asset canister
   */
  public async list(): ReturnType<AssetsService["list"]> {
    const fetchAssets = async ({
      start,
      accumulated,
      prevPageSize,
    }: {
      start: bigint;
      accumulated: Array<AssetDetails>;
      prevPageSize: number | undefined;
    }): Promise<Array<AssetDetails>> => {
      const { list } = this._actor;
      const entries = await list({
        start: [start],
        length: [DEFAULT_LIST_ASSETS_PAGE_SIZE],
      });

      const numEntries = entries.length;

      // No more entries
      if (numEntries === 0) {
        return accumulated;
      }

      // If we're on a subsequent page but got the same data as the first page,
      // the canister doesn't support pagination and is returning all entries every time
      if (start > BigInt(0) && entriesEqual({ a: entries, b: accumulated })) {
        return accumulated;
      }

      const newAccumulated = [...accumulated, ...entries];

      // If we got fewer items than the previous page, we've reached the end
      if (prevPageSize !== undefined && numEntries < prevPageSize) {
        return newAccumulated;
      }

      return await fetchAssets({
        start: start + BigInt(numEntries),
        accumulated: newAccumulated,
        prevPageSize: numEntries,
      });
    };

    return await fetchAssets({
      start: BigInt(0),
      accumulated: [],
      prevPageSize: undefined,
    });
  }

  /**
   * Store data on assets canister
   * @param args Arguments with either a file, blob, path, bytes or custom Readable implementation
   */
  public async store(...args: StoreArgs): Promise<string> {
    const readable = await AssetManager.toReadable(...args);
    const [, config] = args;
    const key = [
      config?.path ?? "",
      config?.fileName ?? readable.fileName,
    ].join("/");

    // If asset is small enough upload in one request else upload in chunks (batch)
    if (readable.length <= this._maxSingleFileSize) {
      config?.onProgress?.({ current: 0, total: readable.length });
      await this._limit(async () => {
        await readable.open();
        const bytes = await readable.slice(0, readable.length);
        await readable.close();
        const hash = config?.sha256 ?? sha256(new Uint8Array(bytes));
        return this._actor.store({
          key,
          content: bytes,
          content_type: readable.contentType,
          sha256: [hash],
          content_encoding: config?.contentEncoding ?? "identity",
        });
      });
      config?.onProgress?.({
        current: readable.length,
        total: readable.length,
      });
    } else {
      // Create batch to upload asset in chunks
      const batch = this.batch();
      await batch.store(readable, config);
      await batch.commit();
    }

    return key;
  }

  /**
   * Delete file from assets canister
   * @param key The path to the file on the assets canister e.g. /folder/to/my_file.txt
   */
  public async delete(key: string): Promise<void> {
    await this._actor.delete_asset({ key });
  }

  /**
   * Delete all files from assets canister
   */
  public async clear(): Promise<void> {
    await this._actor.clear({});
  }

  /**
   * Get asset instance from assets canister
   * @param key The path to the file on the assets canister e.g. /folder/to/my_file.txt
   * @param acceptEncodings The accepted content encodings, defaults to ['identity']
   */
  public async get(
    key: string,
    acceptEncodings?: ContentEncoding[],
  ): Promise<Asset> {
    const data = await this._actor.get({
      key,
      accept_encodings: acceptEncodings ?? ["identity"],
    });

    return new Asset(
      this._actor,
      this._limit,
      key,
      acceptEncodings ?? ["identity"],
      data.content,
      data.content_type,
      Number(data.total_length),
      data.content_encoding,
      data.content.length,
      data.sha256[0],
    );
  }

  /**
   * Create a batch assets operations instance, commit multiple operations in a single request
   */
  public batch(): AssetManagerBatch {
    return new AssetManagerBatch(this._actor, this._limit, this._maxChunkSize);
  }
}

// Required since the sha256 type is not exported
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const hasher = sha256.create();
type SHA256TYPE = typeof hasher;

class AssetManagerBatch {
  private _scheduledOperations: Array<
    (
      batch_id: bigint,
      onProgress?: (progress: Progress) => void,
    ) => Promise<AssetsDid.BatchOperationKind[]>
  > = [];
  private _sha256: { [key: string]: SHA256TYPE } = {};
  private _progress: { [key: string]: Progress } = {};

  constructor(
    private readonly _actor: ActorSubclass<AssetsService>,
    private readonly _limit: LimitFn,
    private readonly _maxChunkSize: number,
  ) {}

  /**
   * Insert batch operation to store data on assets canister
   * @param args Arguments with either a file, blob, path, bytes or custom Readable implementation
   */
  public async store(...args: StoreArgs): Promise<string> {
    const readable = await AssetManager.toReadable(...args);
    const [, config] = args;
    const key = [
      config?.path ?? "",
      config?.fileName ?? readable.fileName,
    ].join("/");
    if (!config?.sha256) {
      this._sha256[key] = sha256.create();
    }
    this._progress[key] = { current: 0, total: readable.length };
    config?.onProgress?.(this._progress[key]);
    this._scheduledOperations.push(async (batch_id, onProgress) => {
      await readable.open();
      const chunkCount = Math.ceil(readable.length / this._maxChunkSize);
      const chunkIds: bigint[] = await Promise.all(
        Array.from({ length: chunkCount }).map(async (_, index) => {
          const content = await readable.slice(
            index * this._maxChunkSize,
            Math.min((index + 1) * this._maxChunkSize, readable.length),
          );
          if (!config?.sha256) {
            this._sha256[key].update(content);
          }
          const { chunk_id } = await this._limit(() =>
            this._actor.create_chunk({
              content,
              batch_id,
            }),
          );
          this._progress[key].current += content.length;
          config?.onProgress?.(this._progress[key]);
          onProgress?.({
            current: Object.values(this._progress).reduce(
              (acc, val) => acc + val.current,
              0,
            ),
            total: Object.values(this._progress).reduce(
              (acc, val) => acc + val.total,
              0,
            ),
          });

          return chunk_id;
        }),
      );
      await readable.close();
      const headers: [] | [[string, string][]] = config?.headers
        ? [config.headers]
        : [];
      return [
        {
          CreateAsset: {
            key,
            content_type: config?.contentType ?? readable.contentType,
            headers,
            allow_raw_access: [],
            max_age: [],
            enable_aliasing: [],
          },
        },
        {
          SetAssetContent: {
            key,
            sha256: [
              config?.sha256 ?? new Uint8Array(this._sha256[key].digest()),
            ],
            chunk_ids: chunkIds,
            content_encoding: config?.contentEncoding ?? "identity",
            last_chunk: [],
          },
        },
      ];
    });
    return key;
  }

  /**
   * Insert batch operation to delete file from assets canister
   * @param key The path to the file on the assets canister e.g. /folder/to/my_file.txt
   */
  public delete(key: string): void {
    this._scheduledOperations.push(() =>
      Promise.resolve([{ DeleteAsset: { key } }]),
    );
  }

  /**
   * Commit all batch operations to assets canister
   * @param args Optional arguments with optional progress callback for commit progress
   */
  public async commit(args?: CommitBatchArgs): Promise<void> {
    // Create batch
    const { batch_id } = await this._limit(() => this._actor.create_batch({}));

    // Progress callback
    args?.onProgress?.({
      current: Object.values(this._progress).reduce(
        (acc, val) => acc + val.current,
        0,
      ),
      total: Object.values(this._progress).reduce(
        (acc, val) => acc + val.total,
        0,
      ),
    });

    // Execute scheduled operations
    const operations = (
      await Promise.all(
        this._scheduledOperations.map((scheduled_operation) =>
          scheduled_operation(batch_id, args?.onProgress),
        ),
      )
    ).flat();

    // Commit batch
    await this._limit(() => this._actor.commit_batch({ batch_id, operations }));

    // Cleanup
    this._scheduledOperations = [];
    this._sha256 = {};
    this._progress = {};
  }
}

class Asset {
  constructor(
    private readonly _actor: ActorSubclass<AssetsService>,
    private readonly _limit: LimitFn,
    private readonly _key: string,
    private readonly _acceptEncodings: ContentEncoding[],
    private readonly _content: Uint8Array,
    public readonly contentType: string,
    public readonly length: number,
    public readonly contentEncoding: string,
    public readonly chunkSize: number,
    public readonly sha256?: Uint8Array,
  ) {}

  /**
   * Get asset content as blob (web), most browsers are able to use disk storage for larger blobs
   */
  public async toBlob(): Promise<Blob> {
    const blobs = Array.from<Blob>({
      length: Math.ceil(this.length / this.chunkSize),
    });
    await this.getChunks(
      (index, chunk) =>
        (blobs[index] = new Blob([chunk as Uint8Array<ArrayBuffer>])),
    );
    return new Blob([...blobs]);
  }

  /**
   * Get asset content as unsigned 8-bit integer array, use `toBlob` (web) or `write` (Node.js) for larger files
   */
  public async toUint8Array(): Promise<Uint8Array> {
    const bytes = new Uint8Array(this.length);
    await this.getChunks((index, chunk) =>
      bytes.set(chunk, index * this.chunkSize),
    );
    return bytes;
  }

  /**
   * Get asset content as number array, use `toBlob` (web) or `write` (Node.js) for larger files
   */
  public async toNumberArray(): Promise<number[]> {
    const chunks = Array.from<number[]>({
      length: Math.ceil(this.length / this.chunkSize),
    });
    await this.getChunks((index, chunk) => (chunks[index] = Array.from(chunk)));
    return chunks.flat();
  }

  /**
   * Write asset content to file (Node.js)
   * @param path File path to write to
   */
  public async write(path: string): Promise<void> {
    const fd = await new Promise<number>((resolve, reject) =>
      fs.open(path, "w", (err: unknown, fd: number) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(fd);
      }),
    );
    await this.getChunks(
      (index, chunk) =>
        new Promise<void>((resolve, reject) =>
          fs.write(
            fd,
            chunk,
            0,
            chunk.length,
            index * this.chunkSize,
            (err: unknown) => {
              if (err) {
                reject(err);
                return;
              }
              resolve();
            },
          ),
        ),
    );
    await new Promise<void>((resolve) => fs.close(fd, () => resolve()));
  }

  /**
   * Get All chunks of asset through `onChunk` callback, can be used for a custom storage implementation
   * @param onChunk Called on each received chunk
   * @param sequential Chunks are received in sequential order when true or `concurrency` is `1` in config
   */
  public async getChunks(
    onChunk: (index: number, chunk: Uint8Array) => void,
    sequential?: boolean,
  ) {
    onChunk(0, this._content);
    const chunkLimit = sequential ? limit(1) : this._limit;
    await Promise.all(
      Array.from({ length: Math.ceil(this.length / this.chunkSize) - 1 }).map(
        (_, index) =>
          chunkLimit(async () => {
            const { content } = await this._actor.get_chunk({
              key: this._key,
              content_encoding: this.contentEncoding,
              index: BigInt(index + 1),
              sha256: this.sha256 ? [this.sha256] : [],
            });
            onChunk(index + 1, content);
          }),
      ),
    );
  }

  /**
   * Check if asset has been certified, which means that the content's hash is in the canister hash tree
   */
  public async isCertified(): Promise<boolean> {
    // Below implementation is based on Internet Computer service worker
    const agent = Actor.agentOf(this._actor) ?? new HttpAgent();
    const canisterId = Actor.canisterIdOf(this._actor);

    if (!agent.rootKey) {
      throw Error("Agent is missing root key");
    }

    const response = await this._limit(() =>
      this._actor.http_request({
        method: "get",
        url: this._key,
        headers: [["Accept-Encoding", this._acceptEncodings.join(", ")]],
        body: new Uint8Array(),
        certificate_version: [],
      }),
    );

    let certificate: Uint8Array | undefined;
    let tree: Uint8Array | undefined;
    const certificateHeader = response.headers.find(
      ([key]) => key.trim().toLowerCase() === "ic-certificate",
    );
    if (!certificateHeader) {
      return false;
    }
    const fields = certificateHeader[1].split(/,/);
    for (const f of fields) {
      const [, name, b64Value] = [...(f.match(/^(.*)=:(.*):$/) ?? [])].map(
        (x) => x.trim(),
      );
      const value = base64ToUint8Array(b64Value);
      if (name === "certificate") {
        certificate = value;
      } else if (name === "tree") {
        tree = value;
      }
    }

    if (!certificate || !tree) {
      // No certificate or tree in response header
      return false;
    }

    const cert = await Certificate.create({
      certificate,
      rootKey: agent.rootKey,
      canisterId,
    }).catch(() => Promise.resolve());

    if (!cert) {
      // Certificate is not valid
      return false;
    }

    // Check certificate time
    const timeLookup = cert.lookup_path(["time"]);
    if (
      timeLookup.status !== LookupPathStatus.Found ||
      !(timeLookup.value instanceof Uint8Array)
    ) {
      return false;
    }

    const decodedTime = lebDecode(new PipeArrayBuffer(timeLookup.value));
    const certTime = Number(decodedTime / BigInt(1_000_000)); // Convert from nanos to millis
    const now = Date.now();
    const maxCertTimeOffset = 300_000; // 5 min
    if (
      certTime - maxCertTimeOffset > now ||
      certTime + maxCertTimeOffset < now
    ) {
      return false;
    }

    const hashTree = cbor.decode<HashTree>(tree);
    const reconstructed = await reconstruct(hashTree);
    const witness = cert.lookup_path([
      "canister",
      canisterId.toUint8Array(),
      "certified_data",
    ]);

    if (
      witness.status !== LookupPathStatus.Found ||
      !(witness.value instanceof Uint8Array)
    ) {
      // Could not find certified data for this canister in the certificate
      return false;
    }

    // First validate that the Tree is as good as the certification
    if (compare(witness.value, reconstructed) !== 0) {
      // Witness != Tree passed in ic-certification
      return false;
    }

    // Lookup hash of asset in tree
    const treeSha = lookupResultToBuffer(
      lookup_path(["http_assets", this._key], hashTree),
    );

    return !!treeSha && !!this.sha256 && compare(this.sha256, treeSha) === 0;
  }

  /**
   * Check if the hash of the asset data is equal to the hash that has been certified
   * @param bytes Optionally pass data to hash instead of waiting for asset data to be fetched and hashed
   */
  public async verifySha256(bytes?: Uint8Array | number[]): Promise<boolean> {
    if (!this.sha256?.buffer) {
      return false;
    }
    const hash = sha256.create();
    if (bytes) {
      hash.update(Array.isArray(bytes) ? new Uint8Array(bytes) : bytes);
    } else {
      await this.getChunks((_, chunk) => hash.update(chunk), true);
    }
    return compare(this.sha256, hash.digest()) === 0;
  }
}
