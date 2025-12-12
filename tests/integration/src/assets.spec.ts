/* eslint-disable local-rules/prefer-object-params */

import { createAgent } from "@dfinity/utils";
import { AssetManager } from "@icp-sdk/canisters/assets";
import type { Principal } from "@icp-sdk/core/principal";
import { existsSync, readFileSync, unlinkSync } from "fs";
import path from "path";
import { getCanisterId } from "./utils/env";
import { assetsIdentity } from "./utils/identity";

const IC_HOST = `http://127.0.0.1:4943`;

/**
 * Create (pseudo) random bytes Readable
 * @param fileName File name of Readable
 * @param length Byte length of Readable
 */
const randomBytesReadable = (fileName: string, length: number) => {
  const rand = Math.floor(Math.random() * 10000);
  return {
    fileName,
    contentType: "application/octet-stream",
    length,

    open: async () => {},

    close: async () => {},
    slice: (start: number, end: number) => {
      const bytes = Uint8Array.from(
        Array.from({ length: end - start }).map((_, i) => {
          const offset = start + i;
          const x = Math.sin(rand + offset) * 10000;
          return Math.floor((x - Math.floor(x)) * 256);
        }),
      );

      return Promise.resolve(bytes);
    },
  };
};

describe("assets", async () => {
  /**
   * File paths used in file read/write tests
   */
  const testFile = {
    source: path.join(__dirname, "../package.json"),
    target: path.join(__dirname, "../package_copy.json"),
  };

  const agent = await createAgent({
    host: IC_HOST,
    fetchRootKey: true,
    identity: assetsIdentity,
  });

  let canisterId: Principal;

  const testRandomBytes = async (fileName: string, length: number) => {
    const assetManager = new AssetManager({
      canisterId,
      agent,
    });
    const readable = randomBytesReadable(fileName, length);
    const key = await assetManager.store(readable);
    const asset = await assetManager.get(key);
    const sentData = await readable.slice(0, readable.length);
    const receivedData = await asset.toUint8Array();
    const isCertified = await asset.isCertified();
    const isValidSha = await asset.verifySha256(receivedData);
    await assetManager.delete(key);

    expect(key).toEqual(`/${readable.fileName}`);
    expect(asset.contentType).toEqual(readable.contentType);
    expect(asset).toHaveLength(readable.length);
    expect(Array.from(receivedData).join()).toEqual(
      Array.from(sentData).join(),
    );
    expect(isCertified).toBeTruthy();
    expect(isValidSha).toBeTruthy();
    await expect(assetManager.get(key)).rejects.toThrowError(/asset not found/);
  };

  beforeAll(() => {
    canisterId = getCanisterId("assets");
  });

  afterEach(async () => {
    const assetManager = new AssetManager({ canisterId, agent });
    await assetManager.clear();
    if (existsSync(testFile.target)) {
      unlinkSync(testFile.target);
    }
  });

  // eslint-disable-next-line vitest/expect-expect
  it("store, get and delete 1MB asset (single chunk)", async () => {
    await testRandomBytes("1MB.bin", 1000000);
  });

  // eslint-disable-next-line vitest/expect-expect
  it("store, get and delete 3MB asset (multiple chunk)", async () => {
    await testRandomBytes("3MB.bin", 3000000);
  });

  it("batch process assets and verify asset list", async () => {
    const assetManager = new AssetManager({ canisterId, agent });
    const batch = assetManager.batch();

    // Initial X asset
    const x = randomBytesReadable("X.bin", 1000);
    await assetManager.store(x);

    // Batch store A and B assets and delete X asset
    const readables = [
      randomBytesReadable("A.bin", 1000),
      randomBytesReadable("B.bin", 1000),
    ];
    batch.delete(`/${x.fileName}`);
    await Promise.all(readables.map((readable) => batch.store(readable)));
    await batch.commit();

    await expect(
      assetManager
        .list()
        .then((assets) => assets.map((asset) => asset.key).sort()),
    ).resolves.toEqual(readables.map(({ fileName }) => `/${fileName}`).sort());
  });

  it("read file from disk, store as asset, get asset, write file to disk and compare files", async () => {
    const assetManager = new AssetManager({
      canisterId,
      agent,
      // Make sure files are read and written in chunks during this test
      maxSingleFileSize: 200,
      maxChunkSize: 200,
    });
    const key = await assetManager.store(testFile.source);
    const asset = await assetManager.get(key);
    await asset.write(testFile.target);

    expect(readFileSync(testFile.target, "utf8")).toEqual(
      readFileSync(testFile.source, "utf8"),
    );
  });
});
