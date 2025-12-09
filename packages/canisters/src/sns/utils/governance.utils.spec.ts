import { mockPrincipal } from "../mocks/ledger.mock";
import { neuronSubaccount } from "./governance.utils";

describe("governance utils", () => {
  describe("neuronSubaccount", () => {
    // Test it to make sure that if there are changes, the test will fail.
    it("calculates the neuron subaccount based on controller and index", () => {
      const subaccount = neuronSubaccount({
        controller: mockPrincipal,
        index: 4,
      });
      const expected = new Uint8Array([
        198, 112, 210, 99, 31, 205, 63, 124, 217, 206, 133, 104, 105, 140, 83,
        167, 139, 60, 94, 58, 107, 169, 215, 12, 177, 219, 237, 24, 75, 149,
        241, 128,
      ]);

      expect(subaccount).toEqual(expected);
    });
  });
});
