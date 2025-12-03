import { ICManagementCanister } from "./index";

describe("@dfinity/ic-management", () => {
  it("should re-export IcManagementCanister", () => {
    expect(ICManagementCanister).not.toBeUndefined();
  });
});
