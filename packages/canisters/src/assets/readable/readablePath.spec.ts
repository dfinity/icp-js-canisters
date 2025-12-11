import { readFileSync, statSync } from "fs";
import { basename, resolve } from "path";
import { ReadablePath } from "./readablePath";

describe("ReadablePath", () => {
  test("ReadablePath from path", async () => {
    const path = resolve(__dirname, "../../package.json");
    const readable = await ReadablePath.create(path);

    expect(readable.fileName).toEqual(basename(path));
    expect(readable.contentType).toEqual("application/json");
    expect(readable.length).toHaveLength(statSync(path).size);

    await readable.open();

    await expect(readable.slice(16, 24)).resolves.toEqual(
      new Uint8Array(readFileSync(path).subarray(16, 24)),
    );

    await readable.close();
  });
});
