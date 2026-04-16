describe("@icp-sdk/canisters", () => {
  it("should throw loading error", async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    await expect(import("@icp-sdk/canisters")).rejects.toThrow(
      "This package has no default entry point. Please import from a subpath.",
    );
  });
});
