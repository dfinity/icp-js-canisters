import { isNullish } from "@dfinity/utils";
import type {
  NnsGovernanceDid,
  NnsGovernanceService,
} from "../../../declarations";
import { GovernanceError } from "../../errors/governance.errors";

/**
 * Checks a Manage Neuron Response for error and returns successful response data.
 *
 * @throws {@link GovernanceError}
 */
export const getSuccessfulCommandFromResponse = (
  response: NnsGovernanceDid.ManageNeuronResponse,
): NnsGovernanceDid.Command_1 => {
  const { command } = response;
  const [data] = command;
  if (isNullish(data)) {
    throw new GovernanceError({
      error_message: "Error updating neuron",
      error_type: 0,
    });
  }

  if ("Error" in data) {
    throw new GovernanceError(data.Error);
  }
  return data;
};

/**
 * @throws {@link GovernanceError}
 */
export const manageNeuron = async ({
  request,
  service,
}: {
  request: NnsGovernanceDid.ManageNeuronRequest;
  service: NnsGovernanceService;
}): Promise<NnsGovernanceDid.Command_1> => {
  const response = await service.manage_neuron(request);
  // We use it only to assert that there are no errors
  return getSuccessfulCommandFromResponse(response);
};

/**
 * @throws {@link GovernanceError}
 */
export const simulateManageNeuron = async ({
  request,
  service,
}: {
  request: NnsGovernanceDid.ManageNeuronRequest;
  service: NnsGovernanceService;
}): Promise<NnsGovernanceDid.Command_1> => {
  const response = await service.simulate_manage_neuron(request);
  return getSuccessfulCommandFromResponse(response);
};
