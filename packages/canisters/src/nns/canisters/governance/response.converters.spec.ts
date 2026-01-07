import { Principal } from "@icp-sdk/core/principal";
import type { NnsGovernanceDid } from "../../../declarations";
import { MAINNET_GOVERNANCE_CANISTER_ID } from "../../constants/canister_ids";
import { NeuronState } from "../../enums/governance.enums";
import type {
  MaturityDisbursement,
  Neuron,
  NeuronInfo,
} from "../../types/governance_converters";
import { fromAccountIdentifier } from "./request.converters";
import {
  toNeuron,
  toNeuronInfo,
  toProposalInfo,
  toRawNeuron,
} from "./response.converters";

describe("response.converters", () => {
  const neuronId = 123n;
  const neuronStake = 100_000_000n;
  const controlledIdText = "souto-grxij-jbijj-tmr3q";
  const createdTimestampSeconds = 1_234_567_000n;
  const dissolveDelaySeconds = 8_640_000n;
  const state = NeuronState.Locked;
  const canisterId = MAINNET_GOVERNANCE_CANISTER_ID;
  const accountIdentifier = {
    hash: Uint8Array.from(Array.from({ length: 32 }, (_, i) => i)),
  };
  const accountIdentifierHex =
    "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f";
  // Encoding of the accountIdentifier hash is not symmetrical,
  // so we need to remove the first 4 bytes which is a checksum
  // (Identity = [4-byte crc32 checksum + 28-byte blob])
  const accountIdentifierWithoutChecksum = {
    hash: accountIdentifier.hash.subarray(4),
  };

  const defaultCandidNeuron: NnsGovernanceDid.Neuron = {
    id: [{ id: neuronId }],
    staked_maturity_e8s_equivalent: [0n],
    controller: [Principal.fromText(controlledIdText)],
    recent_ballots: [],
    kyc_verified: false,
    neuron_type: [],
    not_for_profit: false,
    cached_neuron_stake_e8s: neuronStake,
    created_timestamp_seconds: createdTimestampSeconds,
    auto_stake_maturity: [false],
    maturity_e8s_equivalent: 0n,
    aging_since_timestamp_seconds: createdTimestampSeconds,
    neuron_fees_e8s: 0n,
    hot_keys: [],
    account: new Uint8Array(),
    joined_community_fund_timestamp_seconds: [],
    maturity_disbursements_in_progress: [],
    dissolve_state: [{ DissolveDelaySeconds: dissolveDelaySeconds }],
    spawn_at_timestamp_seconds: [],
    followees: [],
    visibility: [],
    transfer: [],
    known_neuron_data: [],
    voting_power_refreshed_timestamp_seconds: [],
    potential_voting_power: [],
    deciding_voting_power: [],
  };

  const defaultNeuron: Neuron = {
    id: neuronId,
    stakedMaturityE8sEquivalent: 0n,
    controller: controlledIdText,
    recentBallots: [],
    neuronType: undefined,
    kycVerified: false,
    notForProfit: false,
    cachedNeuronStake: neuronStake,
    createdTimestampSeconds,
    autoStakeMaturity: false,
    maturityE8sEquivalent: 0n,
    agingSinceTimestampSeconds: createdTimestampSeconds,
    neuronFees: 0n,
    hotKeys: [],
    accountIdentifier:
      "5608e9e28e45cb752c31464abe8edfca5fca00971942a882989613c20848da6f",
    joinedCommunityFundTimestampSeconds: undefined,
    maturityDisbursementsInProgress: undefined,
    dissolveState: { DissolveDelaySeconds: dissolveDelaySeconds },
    spawnAtTimesSeconds: undefined,
    followees: [],
    visibility: undefined,
    votingPowerRefreshedTimestampSeconds: undefined,
    potentialVotingPower: undefined,
    decidingVotingPower: undefined,
  };

  const defaultCandidNeuronInfo: NnsGovernanceDid.NeuronInfo = {
    id: [{ id: 987n }],
    dissolve_delay_seconds: dissolveDelaySeconds,
    recent_ballots: [],
    voting_power_refreshed_timestamp_seconds: [],
    potential_voting_power: [],
    neuron_type: [],
    deciding_voting_power: [],
    created_timestamp_seconds: createdTimestampSeconds,
    state,
    stake_e8s: 0n,
    joined_community_fund_timestamp_seconds: [],
    retrieved_at_timestamp_seconds: 0n,
    visibility: [],
    known_neuron_data: [],
    voting_power: 0n,
    age_seconds: 0n,
  };

  const defaultNeuronInfo: NeuronInfo = {
    neuronId,
    dissolveDelaySeconds,
    recentBallots: [],
    neuronType: undefined,
    createdTimestampSeconds,
    state,
    joinedCommunityFundTimestampSeconds: undefined,
    retrievedAtTimestampSeconds: 0n,
    votingPower: 0n,
    votingPowerRefreshedTimestampSeconds: undefined,
    decidingVotingPower: undefined,
    potentialVotingPower: undefined,
    ageSeconds: 0n,
    fullNeuron: undefined,
    visibility: undefined,
  };

  const testRawMaturityDisbursementWithSubaccount: NnsGovernanceDid.MaturityDisbursement =
    {
      timestamp_of_disbursement_seconds: [10n],
      amount_e8s: [11n],
      account_to_disburse_to: [
        {
          owner: [Principal.fromText("aaaaa-aa")],
          subaccount: [Uint8Array.from([1, 2, 3])],
        },
      ],
      account_identifier_to_disburse_to: [],
      finalize_disbursement_timestamp_seconds: [12n],
    };
  const testRawMaturityDisbursementWithoutSubaccount: NnsGovernanceDid.MaturityDisbursement =
    {
      timestamp_of_disbursement_seconds: [20n],
      amount_e8s: [21n],
      account_to_disburse_to: [
        {
          owner: [Principal.fromText("aaaaa-aa")],
          subaccount: [],
        },
      ],
      account_identifier_to_disburse_to: [],
      finalize_disbursement_timestamp_seconds: [22n],
    };
  const testRawMaturityDisbursementWithAccountIdentifier: NnsGovernanceDid.MaturityDisbursement =
    {
      timestamp_of_disbursement_seconds: [20n],
      amount_e8s: [21n],
      account_to_disburse_to: [],
      account_identifier_to_disburse_to: [accountIdentifier],
      finalize_disbursement_timestamp_seconds: [22n],
    };
  const testMaturityDisbursementWithSubaccount: MaturityDisbursement = {
    timestampOfDisbursementSeconds: 10n,
    amountE8s: 11n,
    accountToDisburseTo: {
      owner: Principal.fromText("aaaaa-aa"),
      subaccount: [1, 2, 3],
    },
    accountIdentifierToDisburseTo: undefined,
    finalizeDisbursementTimestampSeconds: 12n,
  };
  const testMaturityDisbursementWithoutSubaccount: MaturityDisbursement = {
    timestampOfDisbursementSeconds: 20n,
    amountE8s: 21n,
    accountToDisburseTo: {
      owner: Principal.fromText("aaaaa-aa"),
      subaccount: undefined,
    },
    accountIdentifierToDisburseTo: undefined,
    finalizeDisbursementTimestampSeconds: 22n,
  };
  const testMaturityDisbursementWithAccountIdentifier: MaturityDisbursement = {
    timestampOfDisbursementSeconds: 20n,
    amountE8s: 21n,
    accountToDisburseTo: undefined,
    accountIdentifierToDisburseTo: accountIdentifierHex,
    finalizeDisbursementTimestampSeconds: 22n,
  };

  describe("toNeuronInfo", () => {
    it("should convert a default candid NeuronInfo to ic-js NeuronInfo", () => {
      expect(
        toNeuronInfo({
          neuronId,
          neuronInfo: defaultCandidNeuronInfo,
          rawNeuron: undefined,
          canisterId,
        }),
      ).toEqual(defaultNeuronInfo);
    });

    it("should convert a fullNeuron", () => {
      expect(
        toNeuronInfo({
          neuronId,
          neuronInfo: defaultCandidNeuronInfo,
          rawNeuron: defaultCandidNeuron,
          canisterId,
        }),
      ).toEqual({
        ...defaultNeuronInfo,
        fullNeuron: defaultNeuron,
      });
    });

    it("should convert a voting power refreshed timestamp", () => {
      const timestamp = 1_333_444_999n;

      expect(
        toNeuronInfo({
          neuronId,
          neuronInfo: {
            ...defaultCandidNeuronInfo,
            voting_power_refreshed_timestamp_seconds: [timestamp],
          },
          rawNeuron: undefined,
          canisterId,
        }),
      ).toEqual({
        ...defaultNeuronInfo,
        votingPowerRefreshedTimestampSeconds: timestamp,
      });
    });

    it("should convert potential voting power", () => {
      const potentialVotingPower = 1_000_000n;

      expect(
        toNeuronInfo({
          neuronId,
          neuronInfo: {
            ...defaultCandidNeuronInfo,
            potential_voting_power: [potentialVotingPower],
          },
          rawNeuron: undefined,
          canisterId,
        }),
      ).toEqual({ ...defaultNeuronInfo, potentialVotingPower });
    });

    it("should convert deciding voting power", () => {
      const decidingVotingPower = 1_001_000n;

      expect(
        toNeuronInfo({
          neuronId,
          neuronInfo: {
            ...defaultCandidNeuronInfo,
            deciding_voting_power: [decidingVotingPower],
          },
          rawNeuron: undefined,
          canisterId,
        }),
      ).toEqual({ ...defaultNeuronInfo, decidingVotingPower });
    });
  });

  describe("toNeuron", () => {
    it("should convert a default candid Neuron to ic-js Neuron", () => {
      expect(
        toNeuron({
          neuron: defaultCandidNeuron,
          canisterId,
        }),
      ).toEqual(defaultNeuron);
    });

    it("should convert a voting power refreshed timestamp", () => {
      const timestamp = 1_333_444_999n;

      expect(
        toNeuron({
          neuron: {
            ...defaultCandidNeuron,
            voting_power_refreshed_timestamp_seconds: [timestamp],
          },
          canisterId,
        }),
      ).toEqual({
        ...defaultNeuron,
        votingPowerRefreshedTimestampSeconds: timestamp,
      });
    });

    it("should convert potential voting power", () => {
      const votingPower = 1_000_000n;

      expect(
        toNeuron({
          neuron: {
            ...defaultCandidNeuron,
            potential_voting_power: [votingPower],
          },
          canisterId,
        }),
      ).toEqual({
        ...defaultNeuron,
        potentialVotingPower: votingPower,
      });
    });

    it("should convert deciding voting power", () => {
      const votingPower = 1_001_000n;

      expect(
        toNeuron({
          neuron: {
            ...defaultCandidNeuron,
            deciding_voting_power: [votingPower],
          },
          canisterId,
        }),
      ).toEqual({
        ...defaultNeuron,
        decidingVotingPower: votingPower,
      });
    });

    it("should convert maturity disbursements in progress", () => {
      expect(
        toNeuron({
          neuron: {
            ...defaultCandidNeuron,
            maturity_disbursements_in_progress: [],
          },
          canisterId,
        }),
      ).toEqual({
        ...defaultNeuron,
        maturityDisbursementsInProgress: undefined,
      });

      expect(
        toNeuron({
          neuron: {
            ...defaultCandidNeuron,
            // Test against the outdated nns governance canister.
            maturity_disbursements_in_progress: undefined as unknown as [],
          },
          canisterId,
        }),
      ).toEqual({
        ...defaultNeuron,
        maturityDisbursementsInProgress: undefined,
      });

      expect(
        toNeuron({
          neuron: {
            ...defaultCandidNeuron,
            maturity_disbursements_in_progress: [[]],
          },
          canisterId,
        }),
      ).toEqual({
        ...defaultNeuron,
        maturityDisbursementsInProgress: [],
      });

      expect(
        toNeuron({
          neuron: {
            ...defaultCandidNeuron,
            maturity_disbursements_in_progress: [
              [
                {
                  timestamp_of_disbursement_seconds: [],
                  amount_e8s: [],
                  account_to_disburse_to: [],
                  account_identifier_to_disburse_to: [],
                  finalize_disbursement_timestamp_seconds: [],
                },
              ],
            ],
          },
          canisterId,
        }),
      ).toEqual({
        ...defaultNeuron,
        maturityDisbursementsInProgress: [
          {
            timestampOfDisbursementSeconds: undefined,
            amountE8s: undefined,
            accountToDisburseTo: undefined,
            finalizeDisbursementTimestampSeconds: undefined,
          },
        ],
      });

      expect(
        toNeuron({
          neuron: {
            ...defaultCandidNeuron,
            maturity_disbursements_in_progress: [
              [
                testRawMaturityDisbursementWithSubaccount,
                testRawMaturityDisbursementWithoutSubaccount,
              ],
            ],
          },
          canisterId,
        }),
      ).toEqual({
        ...defaultNeuron,
        maturityDisbursementsInProgress: [
          testMaturityDisbursementWithSubaccount,
          testMaturityDisbursementWithoutSubaccount,
        ],
      });

      expect(
        toNeuron({
          neuron: {
            ...defaultCandidNeuron,
            maturity_disbursements_in_progress: [
              [testRawMaturityDisbursementWithAccountIdentifier],
            ],
          },
          canisterId,
        }),
      ).toEqual({
        ...defaultNeuron,
        maturityDisbursementsInProgress: [
          testMaturityDisbursementWithAccountIdentifier,
        ],
      });
    });
  });

  describe("fromAccountIdentifier", () => {
    it("should convert account identifier hex string to bytes", () => {
      expect(fromAccountIdentifier(accountIdentifierHex)).toEqual(
        accountIdentifierWithoutChecksum,
      );
    });
  });

  describe("toRawNeuron", () => {
    it("should convert a default ic-js Neuron to candid Neuron", () => {
      expect(
        toRawNeuron({
          neuron: defaultNeuron,
          account: new Uint8Array(),
        }),
      ).toEqual(defaultCandidNeuron);
    });

    it("should convert a voting power refreshed timestamp", () => {
      const timestamp = 1_333_444_998n;

      expect(
        toRawNeuron({
          neuron: {
            ...defaultNeuron,
            votingPowerRefreshedTimestampSeconds: timestamp,
          },
          account: new Uint8Array(),
        }),
      ).toEqual({
        ...defaultCandidNeuron,
        voting_power_refreshed_timestamp_seconds: [timestamp],
      });
    });

    it("should convert maturity disbursements in progress", () => {
      expect(
        toRawNeuron({
          neuron: {
            ...defaultNeuron,
            maturityDisbursementsInProgress: undefined,
          },
          account: new Uint8Array(),
        }),
      ).toEqual({
        ...defaultCandidNeuron,
        maturity_disbursements_in_progress: [],
      });

      expect(
        toRawNeuron({
          neuron: {
            ...defaultNeuron,
            maturityDisbursementsInProgress: [],
          },
          account: new Uint8Array(),
        }),
      ).toEqual({
        ...defaultCandidNeuron,
        maturity_disbursements_in_progress: [[]],
      });

      expect(
        toRawNeuron({
          neuron: {
            ...defaultNeuron,
            maturityDisbursementsInProgress: [
              testMaturityDisbursementWithSubaccount,
              testMaturityDisbursementWithoutSubaccount,
            ],
          },
          account: new Uint8Array(),
        }),
      ).toEqual({
        ...defaultCandidNeuron,
        maturity_disbursements_in_progress: [
          [
            testRawMaturityDisbursementWithSubaccount,
            testRawMaturityDisbursementWithoutSubaccount,
          ],
        ],
      });

      expect(
        toRawNeuron({
          neuron: {
            ...defaultNeuron,
            maturityDisbursementsInProgress: [
              testMaturityDisbursementWithAccountIdentifier,
            ],
          },
          account: new Uint8Array(),
        }),
      ).toEqual({
        ...defaultCandidNeuron,
        maturity_disbursements_in_progress: [
          [
            {
              ...testRawMaturityDisbursementWithAccountIdentifier,
              account_identifier_to_disburse_to: [
                accountIdentifierWithoutChecksum,
              ],
            },
          ],
        ],
      });
    });
  });
  describe("toProposalInfo", () => {
    it("should convert BlessAlternativeGuestOsVersion action", () => {
      const chipIds = [Uint8Array.from([1, 2, 3])];
      const rootfsHash = "rootfs_hash";
      const measurement = Uint8Array.from([4, 5, 6]);
      const kernelCmdline = "kernel_cmdline";

      const candidProposalInfo: NnsGovernanceDid.ProposalInfo = {
        id: [{ id: 100n }],
        ballots: [],
        reject_cost_e8s: 100n,
        proposal_timestamp_seconds: 1234567890n,
        reward_event_round: 1n,
        failed_timestamp_seconds: 0n,
        deadline_timestamp_seconds: [],
        decided_timestamp_seconds: 0n,
        proposal: [
          {
            title: ["Proposal Title"],
            url: "https://example.com",
            action: [
              {
                BlessAlternativeGuestOsVersion: {
                  chip_ids: [chipIds],
                  rootfs_hash: [rootfsHash],
                  base_guest_launch_measurements: [
                    {
                      guest_launch_measurements: [
                        [
                          {
                            measurement: [measurement],
                            metadata: [
                              {
                                kernel_cmdline: [kernelCmdline],
                              },
                            ],
                          },
                        ],
                      ],
                    },
                  ],
                },
              },
            ],
            summary: "Proposal Summary",
            self_describing_action: [],
          },
        ],
        proposer: [{ id: 101n }],
        latest_tally: [],
        executed_timestamp_seconds: 0n,
        topic: 1,
        status: 1,
        reward_status: 1,
        total_potential_voting_power: [],
        failure_reason: [],
        derived_proposal_information: [],
      };

      const expectedProposalInfo = {
        id: 100n,
        ballots: [],
        rejectCost: 100n,
        proposalTimestampSeconds: 1234567890n,
        rewardEventRound: 1n,
        failedTimestampSeconds: 0n,
        deadlineTimestampSeconds: undefined,
        decidedTimestampSeconds: 0n,
        proposal: {
          title: "Proposal Title",
          url: "https://example.com",
          action: {
            BlessAlternativeGuestOsVersion: {
              chipIds,
              rootfsHash,
              baseGuestLaunchMeasurements: {
                guestLaunchMeasurements: [
                  {
                    measurement,
                    metadata: {
                      kernelCmdline,
                    },
                  },
                ],
              },
            },
          },
          summary: "Proposal Summary",
        },
        proposer: 101n,
        latestTally: undefined,
        executedTimestampSeconds: 0n,
        topic: 1,
        status: 1,
        rewardStatus: 1,
        totalPotentialVotingPower: undefined,
      };

      const result = toProposalInfo(candidProposalInfo);

      expect(result).toEqual(expectedProposalInfo);
    });
  });
});
