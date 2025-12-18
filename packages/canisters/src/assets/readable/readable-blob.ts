/* eslint-disable local-rules/prefer-object-params */

import mime from "mime/lite.js";
import type { Readable } from "./readable";

export class ReadableBlob implements Readable {
  public readonly fileName: string;
  private readonly _blob: Blob;

  constructor(fileName: string, blob: Blob) {
    this.fileName = fileName;
    this._blob = blob;
  }

  public get contentType(): string {
    return (
      this._blob.type ||
      (mime.getType(this.fileName) ?? "application/octet-stream")
    );
  }

  public get length(): number {
    return this._blob.size;
  }

  open(): Promise<void> {
    return Promise.resolve();
  }

  close(): Promise<void> {
    return Promise.resolve();
  }

  async slice(start: number, end: number): Promise<Uint8Array> {
    return new Uint8Array(await this._blob.slice(start, end).arrayBuffer());
  }
}
