import { arrayBufferToUint8Array, toNullable } from "@dfinity/utils";
import { Principal } from "@icp-sdk/core/principal";
import type { NnsGovernanceDid } from "../../../declarations";
import {
  CanisterAction,
  CanisterInstallMode,
  LogVisibility,
} from "../../enums/governance.enums";
import type {
  GovernanceParameters,
  MakeProposalRequest,
} from "../../types/governance_converters";
import { toMakeProposalRawRequest } from "./request.converters";

describe("request.converters", () => {
  describe("should convert MakeProposalRequest to NnsGovernanceDid.ManageNeuronRequest", () => {
    const url = "https://test.com";
    const title = "Example Proposal";
    const summary = "This is a summary of the proposal.";
    const nnsFunctionId = 1;
    const payloadBytes = new ArrayBuffer(8);
    const neuronId = 12345n;

    it("ExecuteNnsFunction", () => {
      const mockRequest = {
        url,
        title,
        summary,
        action: {
          ExecuteNnsFunction: {
            nnsFunctionId,
            payloadBytes,
          },
        },
        neuronId,
      };

      const expectedOutput = {
        id: [],
        command: [
          {
            MakeProposal: {
              url,
              title: toNullable(title),
              summary,
              action: [
                {
                  ExecuteNnsFunction: {
                    nns_function: nnsFunctionId,
                    payload: arrayBufferToUint8Array(payloadBytes),
                  },
                },
              ],
            },
          },
        ],
        neuron_id_or_subaccount: [
          {
            NeuronId: {
              id: neuronId,
            },
          },
        ],
      };

      const result = toMakeProposalRawRequest(mockRequest);

      expect(result).toEqual(expectedOutput);
    });

    it("CreateServiceNervousSystem", () => {
      const principalId =
        "xlmdg-vkosz-ceopx-7wtgu-g3xmd-koiyc-awqaq-7modz-zf6r6-364rh-oqe";
      const canisterId = "ktxdj-qiaaa-aaaaa-aacqa-cai";
      const name = "Example SNS";
      const url = "https://example.com";
      const governanceParameters: GovernanceParameters = {
        neuronMaximumDissolveDelayBonus: { basisPoints: 15n },
        neuronMaximumAgeForAgeBonus: { seconds: 60n },
        neuronMaximumDissolveDelay: { seconds: 200n },
        neuronMinimumDissolveDelayToVote: { seconds: 100n },
        neuronMaximumAgeBonus: { basisPoints: 5n },
        neuronMinimumStake: { e8s: 100_000n },
        proposalWaitForQuietDeadlineIncrease: { seconds: 4n },
        proposalInitialVotingPeriod: { seconds: 40000n },
        proposalRejectionFee: { e8s: 100n },
        votingRewardParameters: {
          rewardRateTransitionDuration: { seconds: 1n },
          initialRewardRate: { basisPoints: 1n },
          finalRewardRate: { basisPoints: 2n },
        },
        customProposalCriticality: {
          additionalCriticalNativeActionIds: [1n, 2n, 3n],
        },
      };
      const logo = {
        base64Encoding: "base64string",
      };
      const ledgerParameters = {
        tokenName: "MyToken",
        tokenSymbol: "MTK",
        tokenLogo: logo,
        transactionFee: { e8s: 100n },
      };
      const description = "This is a description of the SNS.";
      const swapParameters = {
        minimumParticipants: 100n,
        duration: {
          seconds: 1234567890n,
        },
        neuronBasketConstructionParameters: {
          dissolveDelayInterval: {
            seconds: 1000000n,
          },
          count: 1n,
        },
        confirmationText: "Example confirmation text",
        maximumParticipantIcp: {
          e8s: 1000000n,
        },
        neuronsFundInvestmentIcp: {
          e8s: 500000n,
        },
        minimumIcp: {
          e8s: 1000n,
        },
        minimumParticipantIcp: {
          e8s: 1000n,
        },
        startTime: {
          secondsAfterUtcMidnight: 0n,
        },
        maximumIcp: {
          e8s: 1000000000n,
        },
        restrictedCountries: {
          isoCodes: ["US", "CA"],
        },
        maxDirectParticipationIcp: {
          e8s: 500000n,
        },
        minDirectParticipationIcp: {
          e8s: 500n,
        },
        neuronsFundParticipation: true,
      };
      const initialTokenDistribution = {
        treasuryDistribution: {
          total: {
            e8s: 500000000n,
          },
        },
        developerDistribution: {
          developerNeurons: [
            {
              controller: principalId,
              dissolveDelay: {
                seconds: 1000000n,
              },
              memo: 123456n,
              vestingPeriod: {
                seconds: 1234567890n,
              },
              stake: {
                e8s: 100000000n,
              },
            },
          ],
        },
        swapDistribution: {
          total: {
            e8s: 200000000n,
          },
        },
      };

      const mockRequest = {
        url,
        title,
        summary: description,
        action: {
          CreateServiceNervousSystem: {
            url,
            governanceParameters,
            fallbackControllerPrincipalIds: [principalId],
            logo,
            name,
            ledgerParameters,
            description,
            dappCanisters: [canisterId],
            swapParameters,
            initialTokenDistribution,
          },
        },
        neuronId,
      };

      const expectedOutput: NnsGovernanceDid.ManageNeuronRequest = {
        id: [],
        command: [
          {
            MakeProposal: {
              url,
              title: toNullable(title),
              summary: description,
              action: [
                {
                  CreateServiceNervousSystem: {
                    url: toNullable(url),
                    governance_parameters: [
                      {
                        neuron_maximum_dissolve_delay_bonus: [
                          {
                            basis_points: toNullable(
                              governanceParameters
                                .neuronMaximumDissolveDelayBonus?.basisPoints,
                            ),
                          },
                        ],
                        neuron_maximum_age_for_age_bonus: [
                          {
                            seconds: toNullable(
                              governanceParameters.neuronMaximumAgeForAgeBonus
                                ?.seconds,
                            ),
                          },
                        ],
                        neuron_maximum_dissolve_delay: [
                          {
                            seconds: toNullable(
                              governanceParameters.neuronMaximumDissolveDelay
                                ?.seconds,
                            ),
                          },
                        ],
                        neuron_minimum_dissolve_delay_to_vote: [
                          {
                            seconds: toNullable(
                              governanceParameters
                                .neuronMinimumDissolveDelayToVote?.seconds,
                            ),
                          },
                        ],
                        neuron_maximum_age_bonus: [
                          {
                            basis_points: toNullable(
                              governanceParameters.neuronMaximumAgeBonus
                                ?.basisPoints,
                            ),
                          },
                        ],
                        neuron_minimum_stake: [
                          {
                            e8s: toNullable(
                              governanceParameters.neuronMinimumStake?.e8s,
                            ),
                          },
                        ],
                        proposal_wait_for_quiet_deadline_increase: [
                          {
                            seconds: toNullable(
                              governanceParameters
                                .proposalWaitForQuietDeadlineIncrease?.seconds,
                            ),
                          },
                        ],
                        proposal_initial_voting_period: [
                          {
                            seconds: toNullable(
                              governanceParameters.proposalInitialVotingPeriod
                                ?.seconds,
                            ),
                          },
                        ],
                        proposal_rejection_fee: [
                          {
                            e8s: toNullable(
                              governanceParameters.proposalRejectionFee?.e8s,
                            ),
                          },
                        ],
                        voting_reward_parameters: [
                          {
                            reward_rate_transition_duration: [
                              {
                                seconds: toNullable(
                                  governanceParameters.votingRewardParameters
                                    ?.rewardRateTransitionDuration?.seconds,
                                ),
                              },
                            ],
                            initial_reward_rate: [
                              {
                                basis_points: toNullable(
                                  governanceParameters.votingRewardParameters
                                    ?.initialRewardRate?.basisPoints,
                                ),
                              },
                            ],
                            final_reward_rate: [
                              {
                                basis_points: toNullable(
                                  governanceParameters.votingRewardParameters
                                    ?.finalRewardRate?.basisPoints,
                                ),
                              },
                            ],
                          },
                        ],
                        custom_proposal_criticality: [
                          {
                            additional_critical_native_action_ids: [
                              BigUint64Array.from([1n, 2n, 3n]),
                            ],
                          },
                        ],
                      },
                    ],
                    fallback_controller_principal_ids: [
                      Principal.fromText(principalId),
                    ],
                    logo: [
                      {
                        base64_encoding: [logo.base64Encoding],
                      },
                    ],
                    name: toNullable(name),
                    ledger_parameters: [
                      {
                        token_name: toNullable(ledgerParameters.tokenName),
                        token_symbol: toNullable(ledgerParameters.tokenSymbol),
                        transaction_fee: [
                          { e8s: [ledgerParameters.transactionFee.e8s] },
                        ],
                        token_logo: [
                          {
                            base64_encoding: [
                              ledgerParameters.tokenLogo.base64Encoding,
                            ],
                          },
                        ],
                      },
                    ],
                    description: toNullable(description),
                    dapp_canisters: [{ id: [Principal.fromText(canisterId)] }],
                    swap_parameters: [
                      {
                        minimum_participants: toNullable(
                          swapParameters.minimumParticipants,
                        ),
                        duration: [
                          {
                            seconds: [swapParameters.duration.seconds],
                          },
                        ],
                        neuron_basket_construction_parameters: [
                          {
                            count: [
                              swapParameters.neuronBasketConstructionParameters
                                .count,
                            ],
                            dissolve_delay_interval: [
                              {
                                seconds: [
                                  swapParameters
                                    .neuronBasketConstructionParameters
                                    .dissolveDelayInterval.seconds,
                                ],
                              },
                            ],
                          },
                        ],
                        confirmation_text: toNullable(
                          swapParameters.confirmationText,
                        ),
                        maximum_participant_icp: [
                          {
                            e8s: toNullable(
                              swapParameters.maximumParticipantIcp.e8s,
                            ),
                          },
                        ],
                        neurons_fund_investment_icp: [
                          {
                            e8s: toNullable(
                              swapParameters.neuronsFundInvestmentIcp.e8s,
                            ),
                          },
                        ],
                        minimum_icp: [
                          {
                            e8s: toNullable(swapParameters.minimumIcp.e8s),
                          },
                        ],
                        minimum_participant_icp: [
                          {
                            e8s: toNullable(
                              swapParameters.minimumParticipantIcp.e8s,
                            ),
                          },
                        ],
                        start_time: [
                          {
                            seconds_after_utc_midnight: toNullable(
                              swapParameters.startTime.secondsAfterUtcMidnight,
                            ),
                          },
                        ],
                        maximum_icp: [
                          {
                            e8s: toNullable(swapParameters.maximumIcp.e8s),
                          },
                        ],
                        restricted_countries: [
                          {
                            iso_codes:
                              swapParameters.restrictedCountries.isoCodes,
                          },
                        ],
                        maximum_direct_participation_icp: [
                          {
                            e8s: toNullable(
                              swapParameters.maxDirectParticipationIcp.e8s,
                            ),
                          },
                        ],
                        minimum_direct_participation_icp: [
                          {
                            e8s: toNullable(
                              swapParameters.minDirectParticipationIcp.e8s,
                            ),
                          },
                        ],
                        neurons_fund_participation: toNullable(
                          swapParameters.neuronsFundParticipation,
                        ),
                      },
                    ],
                    initial_token_distribution: [
                      {
                        treasury_distribution: [
                          {
                            total: [
                              {
                                e8s: toNullable(
                                  initialTokenDistribution.treasuryDistribution
                                    .total.e8s,
                                ),
                              },
                            ],
                          },
                        ],
                        developer_distribution: [
                          {
                            developer_neurons: [
                              {
                                controller: [Principal.fromText(principalId)],
                                dissolve_delay: [
                                  {
                                    seconds: toNullable(
                                      initialTokenDistribution
                                        .developerDistribution
                                        .developerNeurons[0].dissolveDelay
                                        .seconds,
                                    ),
                                  },
                                ],
                                memo: toNullable(
                                  initialTokenDistribution.developerDistribution
                                    .developerNeurons[0].memo,
                                ),
                                vesting_period: [
                                  {
                                    seconds: toNullable(
                                      initialTokenDistribution
                                        .developerDistribution
                                        .developerNeurons[0].vestingPeriod
                                        .seconds,
                                    ),
                                  },
                                ],
                                stake: [
                                  {
                                    e8s: toNullable(
                                      initialTokenDistribution
                                        .developerDistribution
                                        .developerNeurons[0].stake.e8s,
                                    ),
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                        swap_distribution: [
                          {
                            total: [
                              {
                                e8s: toNullable(
                                  initialTokenDistribution.swapDistribution
                                    .total.e8s,
                                ),
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
        neuron_id_or_subaccount: [
          {
            NeuronId: {
              id: neuronId,
            },
          },
        ],
      };

      const result = toMakeProposalRawRequest(mockRequest);

      expect(result).toEqual(expectedOutput);
    });

    it("InstallCode", () => {
      const summary = "Proposal summary";

      const mockRequest: MakeProposalRequest = {
        url,
        title,
        summary,
        action: {
          InstallCode: {
            arg: Uint8Array.from([1, 2, 3]).buffer,
            wasmModule: Uint8Array.from([4, 5, 6]).buffer,
            skipStoppingBeforeInstalling: true,
            canisterId: "miw6j-knlcl-xq",
            installMode: CanisterInstallMode.Reinstall,
          },
        },
        neuronId,
      };

      const expectedOutput: NnsGovernanceDid.ManageNeuronRequest = {
        id: [],
        command: [
          {
            MakeProposal: {
              url,
              title: toNullable(title),
              summary,
              action: [
                {
                  InstallCode: {
                    arg: [Uint8Array.from([1, 2, 3])],
                    wasm_module: [Uint8Array.from([4, 5, 6])],
                    skip_stopping_before_installing: [true],
                    canister_id: [Principal.fromText("miw6j-knlcl-xq")],
                    install_mode: [2],
                  },
                },
              ],
            },
          },
        ],
        neuron_id_or_subaccount: [
          {
            NeuronId: {
              id: neuronId,
            },
          },
        ],
      };

      const result = toMakeProposalRawRequest(mockRequest);

      expect(result).toEqual(expectedOutput);
    });

    it("StopOrStartCanister", () => {
      const summary = "Proposal summary";

      const mockRequest = {
        url,
        title,
        summary,
        action: {
          StopOrStartCanister: {
            canisterId: "miw6j-knlcl-xq",
            action: CanisterAction.Stop,
          },
        },
        neuronId,
      };

      const expectedOutput: NnsGovernanceDid.ManageNeuronRequest = {
        id: [],
        command: [
          {
            MakeProposal: {
              url,
              title: toNullable(title),
              summary,
              action: [
                {
                  StopOrStartCanister: {
                    canister_id: [Principal.fromText("miw6j-knlcl-xq")],
                    action: [1],
                  },
                },
              ],
            },
          },
        ],
        neuron_id_or_subaccount: [
          {
            NeuronId: {
              id: neuronId,
            },
          },
        ],
      };

      const result = toMakeProposalRawRequest(mockRequest);

      expect(result).toEqual(expectedOutput);
    });

    it("UpdateCanisterSettings", () => {
      const summary = "Proposal summary";
      const wasmMemoryThreshold = 222222n;

      const mockRequest = {
        url,
        title,
        summary,
        action: {
          UpdateCanisterSettings: {
            canisterId: "miw6j-knlcl-xq",
            settings: {
              controllers: ["miw6j-knlcl-xq"],
              freezingThreshold: 100n,
              memoryAllocation: 234567n,
              computeAllocation: 1n,
              wasmMemoryLimit: 123456n,
              wasmMemoryThreshold,
              logVisibility: LogVisibility.Controllers,
            },
          },
        },
        neuronId,
      };

      const expectedOutput: NnsGovernanceDid.ManageNeuronRequest = {
        id: [],
        command: [
          {
            MakeProposal: {
              url,
              title: toNullable(title),
              summary,
              action: [
                {
                  UpdateCanisterSettings: {
                    canister_id: [Principal.fromText("miw6j-knlcl-xq")],
                    settings: [
                      {
                        controllers: [
                          {
                            controllers: [Principal.fromText("miw6j-knlcl-xq")],
                          },
                        ],
                        freezing_threshold: [100n],
                        memory_allocation: [234567n],
                        compute_allocation: [1n],
                        wasm_memory_limit: [123456n],
                        wasm_memory_threshold: [wasmMemoryThreshold],
                        log_visibility: [1],
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
        neuron_id_or_subaccount: [
          {
            NeuronId: {
              id: neuronId,
            },
          },
        ],
      };

      const result = toMakeProposalRawRequest(mockRequest);

      expect(result).toEqual(expectedOutput);
    });

    it("BlessAlternativeGuestOsVersion", () => {
      const summary = "Proposal summary";
      const chipIds = [Uint8Array.from([1, 2, 3])];
      const rootfsHash = "rootfs_hash";
      const baseGuestLaunchMeasurements = {
        guestLaunchMeasurements: [
          {
            measurement: Uint8Array.from([4, 5, 6]),
            metadata: {
              kernelCmdline: "kernel_cmdline",
            },
          },
        ],
      };

      const mockRequest: MakeProposalRequest = {
        url,
        title,
        summary,
        action: {
          BlessAlternativeGuestOsVersion: {
            chipIds,
            rootfsHash,
            baseGuestLaunchMeasurements,
          },
        },
        neuronId,
      };

      const expectedOutput: NnsGovernanceDid.ManageNeuronRequest = {
        id: [],
        command: [
          {
            MakeProposal: {
              url,
              title: toNullable(title),
              summary,
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
                              measurement: [Uint8Array.from([4, 5, 6])],
                              metadata: [
                                {
                                  kernel_cmdline: ["kernel_cmdline"],
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
            },
          },
        ],
        neuron_id_or_subaccount: [
          {
            NeuronId: {
              id: neuronId,
            },
          },
        ],
      };

      const result = toMakeProposalRawRequest(mockRequest);

      expect(result).toEqual(expectedOutput);
    });

    it("TakeCanisterSnapshot", () => {
      const summary = "Proposal summary";
      const replaceSnapshot = Uint8Array.from([1, 2, 3]);
      const canisterId = "miw6j-knlcl-xq";

      const mockRequest: MakeProposalRequest = {
        url,
        title,
        summary,
        action: {
          TakeCanisterSnapshot: {
            replaceSnapshot,
            canisterId,
          },
        },
        neuronId,
      };

      const expectedOutput: NnsGovernanceDid.ManageNeuronRequest = {
        id: [],
        command: [
          {
            MakeProposal: {
              url,
              title: toNullable(title),
              summary,
              action: [
                {
                  TakeCanisterSnapshot: {
                    canister_id: [Principal.fromText(canisterId)],
                    replace_snapshot: [replaceSnapshot],
                  },
                },
              ],
            },
          },
        ],
        neuron_id_or_subaccount: [
          {
            NeuronId: {
              id: neuronId,
            },
          },
        ],
      };

      const result = toMakeProposalRawRequest(mockRequest);

      expect(result).toEqual(expectedOutput);
    });

    it("LoadCanisterSnapshot", () => {
      const summary = "Proposal summary";
      const snapshotId = Uint8Array.from([1, 2, 3]);
      const canisterId = "miw6j-knlcl-xq";

      const mockRequest: MakeProposalRequest = {
        url,
        title,
        summary,
        action: {
          LoadCanisterSnapshot: {
            snapshotId,
            canisterId,
          },
        },
        neuronId,
      };

      const expectedOutput: NnsGovernanceDid.ManageNeuronRequest = {
        id: [],
        command: [
          {
            MakeProposal: {
              url,
              title: toNullable(title),
              summary,
              action: [
                {
                  LoadCanisterSnapshot: {
                    canister_id: [Principal.fromText(canisterId)],
                    snapshot_id: [snapshotId],
                  },
                },
              ],
            },
          },
        ],
        neuron_id_or_subaccount: [
          {
            NeuronId: {
              id: neuronId,
            },
          },
        ],
      };

      const result = toMakeProposalRawRequest(mockRequest);

      expect(result).toEqual(expectedOutput);
    });
  });
});
