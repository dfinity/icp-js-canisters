import type { ActorSubclass } from "@icp-sdk/core/agent";
import { mock } from "vitest-mock-extended";
import type { NnsGovernanceTestService } from "../declarations";
import { toNeuron } from "./canisters/governance/response.converters";
import { MAINNET_GOVERNANCE_CANISTER_ID } from "./constants/canister_ids";
import { GovernanceTestCanister } from "./governance_test.canister";
import { mockListNeuronsResponse, mockNeuron } from "./mocks/governance.mock";
import type { Neuron } from "./types/governance_converters";

describe("GovernanceTestCanister", () => {
  describe("updateNeuron", () => {
    it("should update maturity", async () => {
      const service = mock<ActorSubclass<NnsGovernanceTestService>>();
      service.list_neurons.mockResolvedValue(mockListNeuronsResponse);

      const governance = GovernanceTestCanister.create({
        certifiedServiceOverride: service,
        serviceOverride: service,
      });
      const currentNeuron = toNeuron({
        neuron: mockNeuron,
        canisterId: MAINNET_GOVERNANCE_CANISTER_ID,
      });
      const newMaturity = 312_000_000n;
      const newNeuron: Neuron = {
        ...currentNeuron,
        maturityE8sEquivalent: newMaturity,
      };

      await governance.updateNeuron(newNeuron);

      const expectedNewRawNeuron = {
        ...mockNeuron,
        maturity_e8s_equivalent: newMaturity,
      };

      expect(service.update_neuron).toHaveBeenCalledExactlyOnceWith(
        expectedNewRawNeuron,
      );
    });

    it("should not update accountIdentifier", async () => {
      const service = mock<ActorSubclass<NnsGovernanceTestService>>();
      service.list_neurons.mockResolvedValue(mockListNeuronsResponse);

      const governance = GovernanceTestCanister.create({
        certifiedServiceOverride: service,
        serviceOverride: service,
      });
      const currentNeuron = toNeuron({
        neuron: mockNeuron,
        canisterId: MAINNET_GOVERNANCE_CANISTER_ID,
      });
      const newAccountIdentifier = "1a2b3cff";
      const newNeuron: Neuron = {
        ...currentNeuron,
        accountIdentifier: newAccountIdentifier,
      };

      await expect(() =>
        governance.updateNeuron(newNeuron),
      ).rejects.toThrowError("Neuron account identifier can't be changed");

      expect(service.update_neuron).not.toHaveBeenCalled();
    });
  });
});
