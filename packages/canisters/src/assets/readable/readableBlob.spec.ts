import { ReadableBlob } from "./readableBlob";

describe("ReadableBlob", () => {
  test("ReadableBlob from Blob", async () => {
    const blob = new Blob(["Hello world!"]);
    const fileName = "hello.txt";
    const readable = new ReadableBlob(fileName, blob);

    expect(readable.fileName).toEqual(fileName);
    expect(readable.contentType).toEqual("text/plain");
    expect(readable).toHaveLength(blob.size);

    await readable.open();

    await expect(readable.slice(1, 4)).resolves.toEqual(
      new Uint8Array(await blob.slice(1, 4).arrayBuffer()),
    );

    await readable.close();
  });
});
