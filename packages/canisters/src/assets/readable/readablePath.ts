/* eslint-disable local-rules/prefer-object-params */

import { uint8FromBufLike } from "@icp-sdk/core/agent";
import fs from "fs";
import mime from "mime/lite.js";
import path from "path";
import type { Readable } from "./readable";

export class ReadablePath implements Readable {
  private readonly _path: string;
  private readonly _size: number;
  private _fd?: number;

  protected constructor(path: string, size: number) {
    this._path = path;
    this._size = size;
  }

  public get fileName(): string {
    return path.basename(this._path);
  }

  public get contentType(): string {
    return mime.getType(this.fileName) ?? "application/octet-stream";
  }

  public get length(): number {
    return this._size;
  }

  static create(path: string): Promise<ReadablePath> {
    return new Promise<ReadablePath>((resolve, reject) => {
      fs.stat(path, (err, stats) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(new ReadablePath(path, stats.size));
      });
    });
  }

  public open(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this._fd !== undefined) {
        reject("File is already open");
        return;
      }
      fs.open(this._path, (err, fd) => {
        if (err) {
          reject(err);
          return;
        }
        this._fd = fd;
        resolve();
      });
    });
  }

  public close(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this._fd === undefined) {
        reject("No open file handle found");
        return;
      }
      fs.close(this._fd, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  public slice(start: number, end: number): Promise<Uint8Array> {
    return new Promise<Uint8Array>((resolve, reject) => {
      if (this._fd === undefined) {
        reject("No open file handle found");
        return;
      }
      const buffer = Buffer.alloc(end - start);
      fs.read(
        this._fd,
        uint8FromBufLike(buffer),
        0,
        end - start,
        start,
        (err: unknown) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(new Uint8Array(buffer));
        },
      );
    });
  }
}
