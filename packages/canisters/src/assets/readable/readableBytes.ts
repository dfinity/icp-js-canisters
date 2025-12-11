/* eslint-disable local-rules/prefer-object-params */

import mime from "mime/lite.js";
import type { Readable } from "./readable";

export class ReadableBytes implements Readable {
  public readonly fileName: string;
  private readonly _bytes: Uint8Array;

  constructor(fileName: string, bytes: Uint8Array | ArrayBuffer | number[]) {
    this.fileName = fileName;
    this._bytes = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  }

  public get contentType(): string {
    return mime.getType(this.fileName) ?? "application/octet-stream";
  }

  public get length(): number {
    return this._bytes.byteLength;
  }

  public open(): Promise<void> {
    return Promise.resolve();
  }

  public close(): Promise<void> {
    return Promise.resolve();
  }

  public slice(start: number, end: number): Promise<Uint8Array> {
    return Promise.resolve(this._bytes.slice(start, end));
  }
}
