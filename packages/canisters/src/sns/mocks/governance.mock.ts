import { arrayOfNumberToUint8Array } from "@dfinity/utils";
import type {
  GetMetadataResponse,
  Neuron,
  NeuronId,
  ProposalData,
  Topic,
  TopicInfo,
} from "../../declarations/sns/governance";

export const neuronIdMock: NeuronId = { id: arrayOfNumberToUint8Array([1]) };

export const neuronMock = {
  id: [neuronIdMock],
} as Neuron;

export const neuronsMock: Neuron[] = [neuronMock];

export const metadataMock: GetMetadataResponse = {
  url: ["https://my.url/"],
  logo: [],
  name: ["My project"],
  description: ["Web3 for the win"],
};

export const proposalIdMock = { id: BigInt(12) };

export const proposalMock = {
  id: [proposalIdMock],
} as ProposalData;

export const proposalsMock: ProposalData[] = [proposalMock];

export const topicMock: Topic = {
  ApplicationBusinessLogic: null,
};

export const topicInfoMock: TopicInfo = {
  custom_functions: [],
  description: ["Description"],
  is_critical: [false],
  name: ["Name"],
  native_functions: [],
  topic: [topicMock],
  extension_operations: [],
};

export const topicsMock: TopicInfo[] = [topicInfoMock];
