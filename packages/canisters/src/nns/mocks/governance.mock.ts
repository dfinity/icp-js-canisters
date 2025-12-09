import { Principal } from "@icp-sdk/core/principal";
import type {
  ListNeuronsResponse,
  Neuron,
  NeuronInfo,
} from "../../declarations/nns/governance";

const one = BigInt(1);
export const mockNeuronId = BigInt(14567);
export const mockNeuronInfo: NeuronInfo = {
  id: [{ id: 678n }],
  dissolve_delay_seconds: one,
  recent_ballots: [],
  neuron_type: [],
  created_timestamp_seconds: one,
  state: 2,
  stake_e8s: one,
  joined_community_fund_timestamp_seconds: [],
  retrieved_at_timestamp_seconds: one,
  known_neuron_data: [],
  voting_power: one,
  age_seconds: one,
  visibility: [1],
  voting_power_refreshed_timestamp_seconds: [],
  potential_voting_power: [one],
  deciding_voting_power: [one],
};
export const mockNeuron: Neuron = {
  id: [{ id: mockNeuronId }],
  staked_maturity_e8s_equivalent: [one],
  controller: [Principal.fromHex("1f")],
  recent_ballots: [],
  neuron_type: [],
  kyc_verified: false,
  not_for_profit: false,
  maturity_e8s_equivalent: one,
  cached_neuron_stake_e8s: one,
  created_timestamp_seconds: one,
  auto_stake_maturity: [false],
  aging_since_timestamp_seconds: one,
  hot_keys: [],
  account: new Uint8Array([1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 6]),
  joined_community_fund_timestamp_seconds: [],
  maturity_disbursements_in_progress: [],
  dissolve_state: [],
  followees: [],
  neuron_fees_e8s: one,
  transfer: [],
  known_neuron_data: [],
  spawn_at_timestamp_seconds: [],
  visibility: [1],
  voting_power_refreshed_timestamp_seconds: [],
  potential_voting_power: [one],
  deciding_voting_power: [one],
};
export const mockListNeuronsResponse: ListNeuronsResponse = {
  neuron_infos: [[mockNeuronId, mockNeuronInfo]],
  full_neurons: [mockNeuron],
  total_pages_available: [1n],
};
