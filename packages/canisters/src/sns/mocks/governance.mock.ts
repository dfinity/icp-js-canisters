import { arrayOfNumberToUint8Array } from "@dfinity/utils";
import type { SnsGovernanceDid } from "../../declarations";

export const neuronIdMock: SnsGovernanceDid.NeuronId = {
  id: arrayOfNumberToUint8Array([1]),
};

export const neuronMock = {
  id: [neuronIdMock],
} as SnsGovernanceDid.Neuron;

export const neuronsMock: SnsGovernanceDid.Neuron[] = [neuronMock];

export const metadataMock: SnsGovernanceDid.GetMetadataResponse = {
  url: ["https://my.url/"],
  logo: [],
  name: ["My project"],
  description: ["Web3 for the win"],
};

export const proposalIdMock = { id: BigInt(12) };

export const proposalMock = {
  id: [proposalIdMock],
} as SnsGovernanceDid.ProposalData;

export const proposalsMock: SnsGovernanceDid.ProposalData[] = [proposalMock];

export const topicMock: SnsGovernanceDid.Topic = {
  ApplicationBusinessLogic: null,
};

export const topicInfoMock: SnsGovernanceDid.TopicInfo = {
  custom_functions: [],
  description: ["Description"],
  is_critical: [false],
  name: ["Name"],
  native_functions: [],
  topic: [topicMock],
  extension_operations: [],
};

export const topicsMock: SnsGovernanceDid.TopicInfo[] = [topicInfoMock];
