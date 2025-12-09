import {
  arrayOfNumberToUint8Array,
  asciiStringToByteArray,
  bigIntToUint8Array,
} from "@dfinity/utils";
import type { Principal } from "@icp-sdk/core/principal";
import { sha256 } from "@noble/hashes/sha2";
import { AccountIdentifier, SubAccount } from "../../ledger/icp";
import { Vote } from "../enums/governance.enums";
import type {
  Ballot,
  NeuronInfo,
  ProposalInfo,
} from "../types/governance_converters";

const getNeuronVoteForProposal = ({
  proposal: { ballots },
  neuron: { neuronId },
}: {
  proposal: ProposalInfo;
  neuron: NeuronInfo;
}): Vote | undefined =>
  ballots.find(({ neuronId: id }) => id === neuronId)?.vote;

/**
 * Filter the neurons that are ineligible to vote to a proposal.
 *
 * This feature needs the ballots of the proposal to contains accurate data.
 * If the proposal has settled, as the ballots of the proposal are emptied for archive purpose, the function might return a list of ineligible neurons that are actually neurons that have not voted but would have been eligible.
 *
 * Long story short, check the status of the proposal before using this function.
 *
 * @param {neurons; proposal;} params
 * @param params.neurons The neurons to filter.
 * @param params.proposal The proposal to match against the selected neurons.
 */
export const ineligibleNeurons = ({
  neurons,
  proposal,
}: {
  neurons: NeuronInfo[];
  proposal: ProposalInfo;
}): NeuronInfo[] => {
  const { ballots, proposalTimestampSeconds } = proposal;

  return neurons.filter(({ createdTimestampSeconds, neuronId }: NeuronInfo) => {
    const createdSinceProposal: boolean =
      createdTimestampSeconds > proposalTimestampSeconds;

    const dissolveTooShort: boolean =
      ballots.find(
        ({ neuronId: ballotNeuronId }: Ballot) => ballotNeuronId === neuronId,
      ) === undefined;

    return createdSinceProposal || dissolveTooShort;
  });
};

/**
 * Filter the neurons that can vote for a proposal - i.e. the neurons that have not voted yet and are eligible
 *
 * @param {neurons; proposal;} params
 * @param params.neurons The neurons to filter.
 * @param params.proposal The proposal to match against the selected neurons.
 */
export const votableNeurons = ({
  neurons,
  proposal,
}: {
  neurons: NeuronInfo[];
  proposal: ProposalInfo;
}): NeuronInfo[] =>
  neurons.filter(
    (neuron: NeuronInfo) =>
      getNeuronVoteForProposal({ proposal, neuron }) === Vote.Unspecified &&
      ineligibleNeurons({ neurons, proposal }).find(
        ({ neuronId: ineligibleNeuronId }: NeuronInfo) =>
          ineligibleNeuronId === neuron.neuronId,
      ) === undefined,
  );

/**
 * Filter the neurons that have voted for a proposal.
 *
 * @param {neurons; proposal;} params
 * @param params.neurons The neurons to filter.
 * @param params.proposal The proposal for which some neurons might have already voted.
 */
export const votedNeurons = ({
  neurons,
  proposal,
}: {
  neurons: NeuronInfo[];
  proposal: ProposalInfo;
}): NeuronInfo[] =>
  neurons.filter(
    (neuron: NeuronInfo) =>
      getNeuronVoteForProposal({ proposal, neuron }) !== Vote.Unspecified,
  );

export const memoToNeuronSubaccount = ({
  controller,
  memo,
}: {
  controller: Principal;
  memo: bigint;
}): SubAccount => {
  const padding = asciiStringToByteArray("neuron-stake");
  const shaObj = sha256.create();
  shaObj.update(
    arrayOfNumberToUint8Array([
      padding.length,
      ...padding,
      ...controller.toUint8Array(),
      ...bigIntToUint8Array(memo),
    ]),
  );

  return SubAccount.fromBytes(shaObj.digest());
};

export const memoToNeuronAccountIdentifier = ({
  controller,
  memo,
  governanceCanisterId,
}: {
  controller: Principal;
  memo: bigint;
  governanceCanisterId: Principal;
}): AccountIdentifier => {
  const subAccount = memoToNeuronSubaccount({ controller, memo });
  return AccountIdentifier.fromPrincipal({
    principal: governanceCanisterId,
    subAccount,
  });
};
