import type { NeuronsFundParticipationConstraints as SnsNeuronsFundParticipationConstraints } from "../../candid/sns_swap";

export interface NeuronsFundParticipationConstraints {}

export const emptyOptionalsForSnsNeuronsFundParticipationConstraints: Pick<
  SnsNeuronsFundParticipationConstraints,
  | "max_neurons_fund_participation_icp_e8s"
  | "min_direct_participation_threshold_icp_e8s"
  | "ideal_matched_participation_function"
> = {
  max_neurons_fund_participation_icp_e8s: [],
  min_direct_participation_threshold_icp_e8s: [],
  ideal_matched_participation_function: [],
};
