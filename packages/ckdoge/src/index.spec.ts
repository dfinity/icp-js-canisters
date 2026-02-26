describe("@dfinity/ckdoge", () => {
  it("should be importable", async () => {
    const module = await import("./index");

    expect(module).toBeDefined();
  });
});
