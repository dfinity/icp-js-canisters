import {
  fromDefinedNullable,
  fromNullable,
  isNullish,
  nonNullish,
  toNullable,
  uint8ArrayToArrayOfNumber,
  uint8ArrayToHexString,
  type Nullable,
} from "@dfinity/utils";
import { Principal } from "@icp-sdk/core/principal";
import type { AccountIdentifierHex } from "../../../ledger/icp";

import type { NnsGovernanceDid } from "../../../declarations";
import type {
  CanisterAction,
  CanisterInstallMode,
  LogVisibility,
  NeuronType,
  NeuronVisibility,
} from "../../enums/governance.enums";
import { UnsupportedValueError } from "../../errors/governance.errors";
import type {
  CanisterIdString,
  E8s,
  NeuronId,
  Option,
} from "../../types/common";
import type {
  Account,
  Action,
  Ballot,
  BallotInfo,
  By,
  CanisterSettings,
  Change,
  Command,
  Countries,
  Decimal,
  DeveloperDistribution,
  DissolveState,
  Duration,
  Followees,
  GlobalTimeOfDay,
  GovernanceCachedMetrics,
  GovernanceParameters,
  Image,
  InitialTokenDistribution,
  KnownNeuron,
  LedgerParameters,
  ListProposalsResponse,
  MaturityDisbursement,
  NetworkEconomics,
  Neuron,
  NeuronBasketConstructionParameters,
  NeuronDistribution,
  NeuronIdOrSubaccount,
  NeuronInfo,
  NeuronSubsetMetrics,
  NeuronsFundEconomics,
  NeuronsFundMatchedFundingCurveCoefficients,
  NodeProvider,
  Operation,
  Percentage,
  Proposal,
  ProposalInfo,
  RewardMode,
  SwapDistribution,
  SwapParameters,
  Tally,
  Tokens,
  VotingPowerEconomics,
  VotingRewardParameters,
} from "../../types/governance_converters";
import {
  accountIdentifierFromBytes,
  principalToAccountIdentifier,
} from "../../utils/account_identifier.utils";
import { fromAccountIdentifier } from "./request.converters";

export const toNeuronInfo = ({
  neuronId,
  neuronInfo,
  rawNeuron,
  canisterId,
}: {
  neuronId: bigint;
  neuronInfo: NnsGovernanceDid.NeuronInfo;
  rawNeuron?: NnsGovernanceDid.Neuron;
  canisterId: Principal;
}): NeuronInfo => {
  const fullNeuron = rawNeuron
    ? toNeuron({ neuron: rawNeuron, canisterId })
    : undefined;
  return {
    neuronId,
    dissolveDelaySeconds: neuronInfo.dissolve_delay_seconds,
    recentBallots: neuronInfo.recent_ballots.map(toBallotInfo),
    neuronType: fromNullable(neuronInfo.neuron_type) as NeuronType | undefined,
    createdTimestampSeconds: neuronInfo.created_timestamp_seconds,
    state: neuronInfo.state,
    joinedCommunityFundTimestampSeconds: neuronInfo
      .joined_community_fund_timestamp_seconds.length
      ? neuronInfo.joined_community_fund_timestamp_seconds[0]
      : undefined,
    retrievedAtTimestampSeconds: neuronInfo.retrieved_at_timestamp_seconds,
    /** @deprecated */
    votingPower: neuronInfo.voting_power,
    votingPowerRefreshedTimestampSeconds: fromNullable(
      neuronInfo.voting_power_refreshed_timestamp_seconds,
    ),
    decidingVotingPower: fromNullable(neuronInfo.deciding_voting_power),
    potentialVotingPower: fromNullable(neuronInfo.potential_voting_power),
    ageSeconds: neuronInfo.age_seconds,
    visibility: fromNullable(neuronInfo.visibility) as
      | NeuronVisibility
      | undefined,
    fullNeuron,
  };
};

export const toNeuron = ({
  neuron,
  canisterId,
}: {
  neuron: NnsGovernanceDid.Neuron;
  canisterId: Principal;
}): Neuron => ({
  id: neuron.id.length ? toNeuronId(neuron.id[0]) : undefined,
  stakedMaturityE8sEquivalent: fromNullable(
    neuron.staked_maturity_e8s_equivalent,
  ),
  controller: neuron.controller.length
    ? neuron.controller[0].toString()
    : undefined,
  recentBallots: neuron.recent_ballots.map(toBallotInfo),
  neuronType: fromNullable(neuron.neuron_type) as NeuronType | undefined,
  kycVerified: neuron.kyc_verified,
  notForProfit: neuron.not_for_profit,
  cachedNeuronStake: neuron.cached_neuron_stake_e8s,
  createdTimestampSeconds: neuron.created_timestamp_seconds,
  autoStakeMaturity: fromNullable(neuron.auto_stake_maturity),
  maturityE8sEquivalent: neuron.maturity_e8s_equivalent,
  agingSinceTimestampSeconds: neuron.aging_since_timestamp_seconds,
  neuronFees: neuron.neuron_fees_e8s,
  hotKeys: neuron.hot_keys.map((p) => p.toString()),
  accountIdentifier: principalToAccountIdentifier(
    canisterId,
    Uint8Array.from(neuron.account),
  ),
  joinedCommunityFundTimestampSeconds: neuron
    .joined_community_fund_timestamp_seconds.length
    ? neuron.joined_community_fund_timestamp_seconds[0]
    : undefined,
  maturityDisbursementsInProgress: fromNullable(
    neuron.maturity_disbursements_in_progress,
  )?.map(toMaturityDisbursementInProgress),
  dissolveState: neuron.dissolve_state.length
    ? toDissolveState(neuron.dissolve_state[0])
    : undefined,
  spawnAtTimesSeconds: neuron.spawn_at_timestamp_seconds[0],
  followees: neuron.followees.map(([topic, followees]) =>
    toFollowees({ topic, followees }),
  ),
  visibility: fromNullable(neuron.visibility) as NeuronVisibility | undefined,
  votingPowerRefreshedTimestampSeconds: fromNullable(
    neuron.voting_power_refreshed_timestamp_seconds,
  ),
  potentialVotingPower: fromNullable(neuron.potential_voting_power),
  decidingVotingPower: fromNullable(neuron.deciding_voting_power),
});

export const toRawNeuron = ({
  neuron,
  account,
}: {
  neuron: Neuron;
  account: Uint8Array;
}): NnsGovernanceDid.Neuron => ({
  id: nonNullish(neuron.id) ? toNullable({ id: neuron.id }) : [],
  staked_maturity_e8s_equivalent: toNullable(
    neuron.stakedMaturityE8sEquivalent,
  ),
  controller: nonNullish(neuron.controller)
    ? toNullable(Principal.from(neuron.controller))
    : [],
  recent_ballots: neuron.recentBallots.map((ballot) => ({
    vote: ballot.vote,
    proposal_id: nonNullish(ballot.proposalId)
      ? toNullable({ id: ballot.proposalId })
      : [],
  })),
  kyc_verified: neuron.kycVerified,
  neuron_type: toNullable(neuron.neuronType),
  not_for_profit: neuron.notForProfit,
  cached_neuron_stake_e8s: neuron.cachedNeuronStake,
  created_timestamp_seconds: neuron.createdTimestampSeconds,
  auto_stake_maturity: toNullable(neuron.autoStakeMaturity),
  maturity_e8s_equivalent: neuron.maturityE8sEquivalent,
  aging_since_timestamp_seconds: neuron.agingSinceTimestampSeconds,
  neuron_fees_e8s: neuron.neuronFees,
  hot_keys: neuron.hotKeys.map((p) => Principal.from(p)),
  account,
  joined_community_fund_timestamp_seconds: toNullable(
    neuron.joinedCommunityFundTimestampSeconds,
  ),
  maturity_disbursements_in_progress: toNullable(
    neuron.maturityDisbursementsInProgress?.map(
      toRawMaturityDisbursementInProgress,
    ),
  ),
  dissolve_state: nonNullish(neuron.dissolveState)
    ? [neuron.dissolveState]
    : [],
  spawn_at_timestamp_seconds: toNullable(neuron.spawnAtTimesSeconds),
  followees: neuron.followees.map((followeesTopic) => [
    followeesTopic.topic as number,
    {
      followees: followeesTopic.followees.map((followee) => ({ id: followee })),
    },
  ]),
  visibility: toNullable(neuron.visibility),
  // Not kept when converted to Neuron.
  transfer: [],
  // Not kept when converted to Neuron.
  known_neuron_data: [],
  voting_power_refreshed_timestamp_seconds: toNullable(
    neuron.votingPowerRefreshedTimestampSeconds,
  ),
  potential_voting_power: toNullable(neuron.potentialVotingPower),
  deciding_voting_power: toNullable(neuron.decidingVotingPower),
});

const toBallotInfo = ({
  vote,
  proposal_id,
}: NnsGovernanceDid.BallotInfo): BallotInfo => ({
  vote,
  proposalId: proposal_id.length ? toNeuronId(proposal_id[0]) : undefined,
});

const toDissolveState = (
  dissolveState: NnsGovernanceDid.DissolveState,
): DissolveState => {
  if ("DissolveDelaySeconds" in dissolveState) {
    return {
      DissolveDelaySeconds: dissolveState.DissolveDelaySeconds,
    };
  }
  return {
    WhenDissolvedTimestampSeconds: dissolveState.WhenDissolvedTimestampSeconds,
  };
};

const toMaturityDisbursementInProgress = (
  maturityDisbursement: NnsGovernanceDid.MaturityDisbursement,
): MaturityDisbursement => {
  const accountToDisburseTo = fromNullable(
    maturityDisbursement.account_to_disburse_to,
  );
  return {
    timestampOfDisbursementSeconds: fromNullable(
      maturityDisbursement.timestamp_of_disbursement_seconds,
    ),
    amountE8s: fromNullable(maturityDisbursement.amount_e8s),
    accountToDisburseTo: nonNullish(accountToDisburseTo)
      ? toAccount(accountToDisburseTo)
      : undefined,
    accountIdentifierToDisburseTo: maturityDisbursement
      .account_identifier_to_disburse_to?.length
      ? toAccountIdentifier(
          maturityDisbursement.account_identifier_to_disburse_to[0],
        )
      : undefined,
    finalizeDisbursementTimestampSeconds: fromNullable(
      maturityDisbursement.finalize_disbursement_timestamp_seconds,
    ),
  };
};

const toRawMaturityDisbursementInProgress = (
  maturityDisbursement: MaturityDisbursement,
): NnsGovernanceDid.MaturityDisbursement => ({
  timestamp_of_disbursement_seconds: toNullable(
    maturityDisbursement.timestampOfDisbursementSeconds,
  ),
  amount_e8s: toNullable(maturityDisbursement.amountE8s),
  account_to_disburse_to: nonNullish(maturityDisbursement.accountToDisburseTo)
    ? toNullable(toRawAccount(maturityDisbursement.accountToDisburseTo))
    : [],
  account_identifier_to_disburse_to: nonNullish(
    maturityDisbursement.accountIdentifierToDisburseTo,
  )
    ? [
        fromAccountIdentifier(
          maturityDisbursement.accountIdentifierToDisburseTo,
        ),
      ]
    : [],
  finalize_disbursement_timestamp_seconds: toNullable(
    maturityDisbursement.finalizeDisbursementTimestampSeconds,
  ),
});

const toFollowees = ({
  topic,
  followees,
}: {
  topic: number;
  followees: NnsGovernanceDid.Followees;
}): Followees => ({
  topic,
  followees: followees.followees.map(toNeuronId),
});

const toNeuronId = ({ id }: NnsGovernanceDid.NeuronId): NeuronId => id;

const toNeuronIdOrSubaccount = (
  neuronIdOrSubaccount: NnsGovernanceDid.NeuronIdOrSubaccount,
): NeuronIdOrSubaccount => {
  if ("NeuronId" in neuronIdOrSubaccount) {
    return { NeuronId: neuronIdOrSubaccount.NeuronId.id };
  }
  if ("Subaccount" in neuronIdOrSubaccount) {
    return {
      Subaccount: uint8ArrayToArrayOfNumber(
        Uint8Array.from(neuronIdOrSubaccount.Subaccount),
      ),
    };
  }
  throw new UnsupportedValueError(neuronIdOrSubaccount);
};

const toBallot = ({
  neuronId,
  ballot,
}: {
  neuronId: bigint;
  ballot: NnsGovernanceDid.Ballot;
}): Ballot => {
  const { vote, voting_power: votingPower } = ballot;

  return {
    neuronId,
    vote,
    votingPower,
  };
};

const toAccount = ({
  subaccount,
  owner,
}: NnsGovernanceDid.Account): Account => {
  const unwrappedSubaccount = fromNullable(subaccount);
  return {
    owner: fromNullable(owner),
    subaccount: nonNullish(unwrappedSubaccount)
      ? uint8ArrayToArrayOfNumber(Uint8Array.from(unwrappedSubaccount))
      : undefined,
  };
};

const toRawAccount = ({
  owner,
  subaccount,
}: Account): NnsGovernanceDid.Account => ({
  owner: toNullable(owner),
  subaccount: nonNullish(subaccount)
    ? toNullable(Uint8Array.from(subaccount))
    : [],
});

const toProposal = ({
  title,
  url,
  action,
  summary,
}: NnsGovernanceDid.Proposal): Proposal => ({
  title: title.length ? title[0] : undefined,
  url,
  action: action.length ? toAction(action[0]) : undefined,
  summary,
});

const toAction = (action: NnsGovernanceDid.Action): Action => {
  if ("ExecuteNnsFunction" in action) {
    const executeNnsFunction = action.ExecuteNnsFunction;

    return {
      ExecuteNnsFunction: {
        nnsFunctionId: executeNnsFunction.nns_function,
      },
    };
  }
  if ("ManageNeuron" in action) {
    const manageNeuron = action.ManageNeuron;
    return {
      ManageNeuron: {
        id: manageNeuron.id.length ? toNeuronId(manageNeuron.id[0]) : undefined,
        command: manageNeuron.command.length
          ? toCommand(manageNeuron.command[0])
          : undefined,
        neuronIdOrSubaccount: manageNeuron.neuron_id_or_subaccount.length
          ? toNeuronIdOrSubaccount(manageNeuron.neuron_id_or_subaccount[0])
          : undefined,
      },
    };
  }
  if ("ApproveGenesisKyc" in action) {
    const approveKyc = action.ApproveGenesisKyc;
    return {
      ApproveGenesisKyc: {
        principals: approveKyc.principals.map((p) => p.toString()),
      },
    };
  }
  if ("ManageNetworkEconomics" in action) {
    const networkEconomics = action.ManageNetworkEconomics;
    return {
      ManageNetworkEconomics: toNetworkEconomics(networkEconomics),
    };
  }
  if ("RewardNodeProvider" in action) {
    const rewardNodeProvider = action.RewardNodeProvider;
    return {
      RewardNodeProvider: {
        nodeProvider: rewardNodeProvider.node_provider.length
          ? toNodeProvider(rewardNodeProvider.node_provider[0])
          : undefined,
        amountE8s: rewardNodeProvider.amount_e8s,
        rewardMode: rewardNodeProvider.reward_mode.length
          ? toRewardMode(rewardNodeProvider.reward_mode[0])
          : undefined,
      },
    };
  }
  if ("RewardNodeProviders" in action) {
    const rewardNodeProviders = action.RewardNodeProviders;
    return {
      RewardNodeProviders: {
        useRegistryDerivedRewards: rewardNodeProviders
          .use_registry_derived_rewards.length
          ? rewardNodeProviders.use_registry_derived_rewards[0]
          : undefined,
        rewards: rewardNodeProviders.rewards.map((r) => ({
          nodeProvider: r.node_provider.length
            ? toNodeProvider(r.node_provider[0])
            : undefined,
          amountE8s: r.amount_e8s,
          rewardMode: r.reward_mode.length
            ? toRewardMode(r.reward_mode[0])
            : undefined,
        })),
      },
    };
  }
  if ("AddOrRemoveNodeProvider" in action) {
    const addOrRemoveNodeProvider = action.AddOrRemoveNodeProvider;
    return {
      AddOrRemoveNodeProvider: {
        change: addOrRemoveNodeProvider.change.length
          ? toChange(addOrRemoveNodeProvider.change[0])
          : undefined,
      },
    };
  }
  if ("Motion" in action) {
    const motion = action.Motion;
    return {
      Motion: {
        motionText: motion.motion_text,
      },
    };
  }
  if ("SetDefaultFollowees" in action) {
    const setDefaultFollowees = action.SetDefaultFollowees;
    return {
      SetDefaultFollowees: {
        defaultFollowees: setDefaultFollowees.default_followees.map(
          ([topic, followees]) => toFollowees({ topic, followees }),
        ),
      },
    };
  }
  if ("RegisterKnownNeuron" in action) {
    const knownNeuron = action.RegisterKnownNeuron;
    return {
      RegisterKnownNeuron: toKnownNeuron(knownNeuron),
    };
  }

  if ("DeregisterKnownNeuron" in action) {
    const { DeregisterKnownNeuron } = action;
    return {
      DeregisterKnownNeuron: {
        id: DeregisterKnownNeuron.id[0]?.id,
      },
    };
  }

  if ("SetSnsTokenSwapOpenTimeWindow" in action) {
    const { SetSnsTokenSwapOpenTimeWindow } = action;
    const request = SetSnsTokenSwapOpenTimeWindow.request?.length
      ? {
          openTimeWindow: SetSnsTokenSwapOpenTimeWindow.request[0]
            .open_time_window.length
            ? {
                startTimestampSeconds:
                  SetSnsTokenSwapOpenTimeWindow.request[0].open_time_window[0]
                    .start_timestamp_seconds,
                endTimestampSeconds:
                  SetSnsTokenSwapOpenTimeWindow.request[0].open_time_window[0]
                    .end_timestamp_seconds,
              }
            : undefined,
        }
      : undefined;

    const swapCanisterId = SetSnsTokenSwapOpenTimeWindow?.swap_canister_id
      .length
      ? SetSnsTokenSwapOpenTimeWindow.swap_canister_id[0].toString()
      : undefined;

    return {
      SetSnsTokenSwapOpenTimeWindow: {
        request,
        swapCanisterId,
      },
    };
  }

  if ("OpenSnsTokenSwap" in action) {
    const { OpenSnsTokenSwap } = action;
    const params: NnsGovernanceDid.Params | undefined = fromNullable(
      OpenSnsTokenSwap.params,
    );

    return {
      OpenSnsTokenSwap: {
        communityFundInvestmentE8s: fromNullable(
          OpenSnsTokenSwap.community_fund_investment_e8s,
        ),
        targetSwapCanisterId: fromNullable(
          OpenSnsTokenSwap.target_swap_canister_id,
        ),
        params: params && {
          minParticipantIcpE8s: params.min_participant_icp_e8s,
          maxIcpE8s: params.max_icp_e8s,
          swapDueTimestampSeconds: params.swap_due_timestamp_seconds,
          minParticipants: params.min_participants,
          snsTokenE8s: params.sns_token_e8s,
          maxParticipantIcpE8s: params.max_participant_icp_e8s,
          minIcpE8s: params.min_icp_e8s,
          saleDelaySeconds: fromNullable(params.sale_delay_seconds),
          neuronBasketConstructionParameters: fromNullable(
            params.neuron_basket_construction_parameters,
          ),
          maxDirectParticipationIcpE8s: fromNullable(
            params.max_direct_participation_icp_e8s,
          ),
          minDirectParticipationIcpE8s: fromNullable(
            params.min_direct_participation_icp_e8s,
          ),
        },
      },
    };
  }

  if ("CreateServiceNervousSystem" in action) {
    const createServiceNervousSystem = action.CreateServiceNervousSystem;
    return {
      CreateServiceNervousSystem: {
        url: fromNullable(createServiceNervousSystem.url),
        governanceParameters: toGovernanceParameters(
          fromNullable(createServiceNervousSystem.governance_parameters),
        ),
        fallbackControllerPrincipalIds:
          createServiceNervousSystem.fallback_controller_principal_ids.map(
            (principalId) => principalId.toString(),
          ),
        logo: toImage(fromNullable(createServiceNervousSystem.logo)),
        name: fromNullable(createServiceNervousSystem.name),
        ledgerParameters: toLedgerParameters(
          fromNullable(createServiceNervousSystem.ledger_parameters),
        ),
        description: fromNullable(createServiceNervousSystem.description),
        dappCanisters:
          (createServiceNervousSystem.dapp_canisters.map(
            toCanisterIdString,
          ) as CanisterIdString[]) ?? [],
        swapParameters: toSwapParameters(
          fromNullable(createServiceNervousSystem.swap_parameters),
        ),
        initialTokenDistribution: toInitialTokenDistribution(
          fromNullable(createServiceNervousSystem.initial_token_distribution),
        ),
      },
    };
  }

  if ("InstallCode" in action) {
    const installCode = action.InstallCode;
    return {
      InstallCode: {
        skipStoppingBeforeInstalling: fromNullable(
          installCode.skip_stopping_before_installing,
        ),
        canisterId: installCode.canister_id.length
          ? installCode.canister_id[0].toString()
          : undefined,
        installMode: fromNullable(installCode.install_mode) as
          | CanisterInstallMode
          | undefined,
        wasmModuleHash: uint8ArrayToHexString(
          fromDefinedNullable(installCode.wasm_module_hash),
        ),
        argHash: uint8ArrayToHexString(
          fromDefinedNullable(installCode.arg_hash),
        ),
      },
    };
  }

  if ("StopOrStartCanister" in action) {
    const stopOrStartCanister = action.StopOrStartCanister;
    return {
      StopOrStartCanister: {
        canisterId: stopOrStartCanister.canister_id.length
          ? stopOrStartCanister.canister_id[0].toString()
          : undefined,
        action: fromNullable(stopOrStartCanister.action) as
          | CanisterAction
          | undefined,
      },
    };
  }

  if ("UpdateCanisterSettings" in action) {
    return {
      UpdateCanisterSettings: {
        canisterId: action.UpdateCanisterSettings.canister_id.length
          ? action.UpdateCanisterSettings.canister_id[0].toString()
          : undefined,
        settings: toCanisterSettings(
          fromDefinedNullable(action.UpdateCanisterSettings.settings),
        ),
      },
    };
  }

  if ("FulfillSubnetRentalRequest" in action) {
    return {
      FulfillSubnetRentalRequest: {
        user: fromNullable(action.FulfillSubnetRentalRequest.user),
        replicaVersionId: fromNullable(
          action.FulfillSubnetRentalRequest.replica_version_id,
        ),
        nodeIds: fromNullable(action.FulfillSubnetRentalRequest.node_ids),
      },
    };
  }

  if ("BlessAlternativeGuestOsVersion" in action) {
    const { base_guest_launch_measurements, chip_ids, rootfs_hash } =
      action.BlessAlternativeGuestOsVersion;

    const baseGuestLaunchMeasurements = fromNullable(
      base_guest_launch_measurements,
    );
    const guestLaunchMeasurements = fromNullable(
      baseGuestLaunchMeasurements?.guest_launch_measurements ?? [],
    );

    return {
      BlessAlternativeGuestOsVersion: {
        rootfsHash: fromNullable(rootfs_hash),
        chipIds: fromNullable(chip_ids),
        baseGuestLaunchMeasurements: nonNullish(baseGuestLaunchMeasurements)
          ? {
              guestLaunchMeasurements: guestLaunchMeasurements?.map((m) => {
                const metadata = fromNullable(m.metadata);
                return {
                  measurement: fromNullable(m.measurement),
                  metadata: nonNullish(metadata)
                    ? { kernelCmdline: fromNullable(metadata.kernel_cmdline) }
                    : undefined,
                };
              }),
            }
          : undefined,
      },
    };
  }

  throw new UnsupportedValueError(action);
};

const toTally = (tally: NnsGovernanceDid.Tally): Tally => ({
  no: tally.no,
  yes: tally.yes,
  total: tally.total,
  timestampSeconds: tally.timestamp_seconds,
});

const toCommand = (
  command: NnsGovernanceDid.ManageNeuronProposalCommand,
): Command => {
  if ("Spawn" in command) {
    const spawn = command.Spawn;
    return {
      Spawn: {
        newController: spawn.new_controller.length
          ? spawn.new_controller[0].toString()
          : undefined,
        percentageToSpawn: spawn.percentage_to_spawn.length
          ? spawn.percentage_to_spawn[0]
          : 0,
      },
    };
  }
  if ("Split" in command) {
    const split = command.Split;
    return {
      Split: {
        amount: split.amount_e8s,
        memo: split.memo?.[0],
      },
    };
  }
  if ("Follow" in command) {
    const follow = command.Follow;
    return {
      Follow: {
        topic: follow.topic,
        followees: follow.followees.map(toNeuronId),
      },
    };
  }
  if ("DisburseMaturity" in command) {
    const disburseMaturity = command.DisburseMaturity;
    return {
      DisburseMaturity: {
        toAccount: disburseMaturity.to_account.length
          ? toAccount(disburseMaturity.to_account[0])
          : undefined,
        toAccountIdentifier: disburseMaturity.to_account_identifier.length
          ? toAccountIdentifier(disburseMaturity.to_account_identifier[0])
          : undefined,
        percentageToDisburse: disburseMaturity.percentage_to_disburse,
      },
    };
  }
  if ("ClaimOrRefresh" in command) {
    const claimOrRefresh = command.ClaimOrRefresh;
    return {
      ClaimOrRefresh: {
        by: claimOrRefresh.by.length
          ? toClaimOrRefreshBy(claimOrRefresh.by[0])
          : undefined,
      },
    };
  }
  if ("Configure" in command) {
    const configure = command.Configure;
    return {
      Configure: {
        operation: configure.operation.length
          ? toOperation(configure.operation[0])
          : undefined,
      },
    };
  }
  if ("RegisterVote" in command) {
    const registerVote = command.RegisterVote;
    return {
      RegisterVote: {
        vote: registerVote.vote,
        proposal: registerVote.proposal.length
          ? toNeuronId(registerVote.proposal[0])
          : undefined,
      },
    };
  }
  if ("DisburseToNeuron" in command) {
    const disburseToNeuron = command.DisburseToNeuron;
    return {
      DisburseToNeuron: {
        dissolveDelaySeconds: disburseToNeuron.dissolve_delay_seconds,
        kycVerified: disburseToNeuron.kyc_verified,
        amount: disburseToNeuron.amount_e8s,
        newController: disburseToNeuron.new_controller.length
          ? disburseToNeuron.new_controller[0].toString()
          : undefined,
        nonce: disburseToNeuron.nonce,
      },
    };
  }
  if ("SetFollowing" in command) {
    const setFollowing = command.SetFollowing;
    return {
      SetFollowing: {
        topicFollowing: fromDefinedNullable(setFollowing.topic_following).map(
          ({ topic, followees }) => ({
            topic: fromDefinedNullable(topic),
            followees: fromDefinedNullable(followees).map(
              (followee) => followee.id,
            ),
          }),
        ),
      },
    };
  }
  if ("MergeMaturity" in command) {
    const mergeMaturity = command.MergeMaturity;
    return {
      MergeMaturity: {
        percentageToMerge: mergeMaturity.percentage_to_merge,
      },
    };
  }
  if ("StakeMaturity" in command) {
    const { percentage_to_stake } = command.StakeMaturity;
    return {
      StakeMaturity: {
        percentageToStake: fromNullable(percentage_to_stake),
      },
    };
  }
  if ("MakeProposal" in command) {
    const makeProposal = command.MakeProposal;
    return {
      MakeProposal: {
        title: makeProposal.title.length ? makeProposal.title[0] : undefined,
        url: makeProposal.url,
        action: makeProposal.action.length
          ? toAction(makeProposal.action[0])
          : undefined,
        summary: makeProposal.summary,
      },
    };
  }
  if ("Disburse" in command) {
    const disburse = command.Disburse;
    return {
      Disburse: {
        toAccountId: disburse.to_account.length
          ? toAccountIdentifier(disburse.to_account[0])
          : undefined,
        amount: disburse.amount.length
          ? toAmount(disburse.amount[0])
          : undefined,
      },
    };
  }
  if ("Merge" in command) {
    const merge = command.Merge;
    return {
      Merge: {
        sourceNeuronId: merge.source_neuron_id.length
          ? merge.source_neuron_id[0].id
          : undefined,
      },
    };
  }
  if ("RefreshVotingPower" in command) {
    return {
      RefreshVotingPower: {
        // Intentionally left blank.
      },
    };
  }

  throw new UnsupportedValueError(command);
};

const toOperation = (operation: NnsGovernanceDid.Operation): Operation => {
  if ("RemoveHotKey" in operation) {
    const removeHotKey = operation.RemoveHotKey;
    return {
      RemoveHotKey: {
        hotKeyToRemove: removeHotKey.hot_key_to_remove.length
          ? removeHotKey.hot_key_to_remove[0].toString()
          : undefined,
      },
    };
  }
  if ("AddHotKey" in operation) {
    const addHotKey = operation.AddHotKey;
    return {
      AddHotKey: {
        newHotKey: addHotKey.new_hot_key.length
          ? addHotKey.new_hot_key[0].toString()
          : undefined,
      },
    };
  }
  if ("StopDissolving" in operation) {
    return {
      StopDissolving: {},
    };
  }
  if ("StartDissolving" in operation) {
    return {
      StartDissolving: {},
    };
  }
  if ("IncreaseDissolveDelay" in operation) {
    const increaseDissolveDelay = operation.IncreaseDissolveDelay;
    return {
      IncreaseDissolveDelay: {
        additionalDissolveDelaySeconds:
          increaseDissolveDelay.additional_dissolve_delay_seconds,
      },
    };
  }
  if ("JoinCommunityFund" in operation) {
    return operation;
  }
  if ("LeaveCommunityFund" in operation) {
    return operation;
  }
  if ("SetDissolveTimestamp" in operation) {
    const setDissolveTimestamp = operation.SetDissolveTimestamp;
    return {
      SetDissolveTimestamp: {
        dissolveTimestampSeconds:
          setDissolveTimestamp.dissolve_timestamp_seconds,
      },
    };
  }
  if ("ChangeAutoStakeMaturity" in operation) {
    const {
      requested_setting_for_auto_stake_maturity:
        requestedSettingForAutoStakeMaturity,
    } = operation.ChangeAutoStakeMaturity;
    return {
      ChangeAutoStakeMaturity: {
        requestedSettingForAutoStakeMaturity,
      },
    };
  }
  if ("SetVisibility" in operation) {
    const setVisibility = operation.SetVisibility;
    return {
      SetVisibility: {
        visibility: fromNullable(setVisibility.visibility) as
          | NeuronVisibility
          | undefined,
      },
    };
  }
  throw new UnsupportedValueError(operation);
};

const toChange = (change: NnsGovernanceDid.Change): Change => {
  if ("ToRemove" in change) {
    return {
      ToRemove: toNodeProvider(change.ToRemove),
    };
  }
  if ("ToAdd" in change) {
    return {
      ToAdd: toNodeProvider(change.ToAdd),
    };
  }
  throw new UnsupportedValueError(change);
};

const toNeuronsFundEconomics = (
  neuronsFundEconomics: Nullable<NnsGovernanceDid.NeuronsFundEconomics>,
): Option<NeuronsFundEconomics> => {
  const rawNeuronsFundEconomics = fromNullable(neuronsFundEconomics);

  if (isNullish(rawNeuronsFundEconomics)) {
    return undefined;
  }

  const {
    maximum_icp_xdr_rate,
    neurons_fund_matched_funding_curve_coefficients,
    max_theoretical_neurons_fund_participation_amount_xdr,
    minimum_icp_xdr_rate,
  } = rawNeuronsFundEconomics;

  const toPercentage = (
    percentage: Nullable<NnsGovernanceDid.Percentage>,
  ): Option<Percentage> => {
    const rawPercentage = fromNullable(percentage);

    if (isNullish(rawPercentage)) {
      return undefined;
    }

    const { basis_points } = rawPercentage;

    const rawBasisPoints = fromNullable(basis_points);

    return nonNullish(rawBasisPoints)
      ? { basisPoints: rawBasisPoints }
      : undefined;
  };

  const toDecimal = (
    decimal: Nullable<NnsGovernanceDid.Decimal>,
  ): Option<Decimal> => {
    const rawDecimal = fromNullable(decimal);

    if (isNullish(rawDecimal)) {
      return undefined;
    }

    const { human_readable } = rawDecimal;

    const rawHumanReadable = fromNullable(human_readable);

    return nonNullish(rawHumanReadable)
      ? { humanReadable: rawHumanReadable }
      : undefined;
  };

  const toNeuronsFundMatchedFundingCurveCoefficients = (
    neurons_fund_matched_funding_curve_coefficients:
      | []
      | [NnsGovernanceDid.NeuronsFundMatchedFundingCurveCoefficients],
  ): Option<NeuronsFundMatchedFundingCurveCoefficients> => {
    const rawNeuronsFundMatchedFundingCurveCoefficients = fromNullable(
      neurons_fund_matched_funding_curve_coefficients,
    );

    if (isNullish(rawNeuronsFundMatchedFundingCurveCoefficients)) {
      return undefined;
    }

    const {
      full_participation_milestone_xdr,
      one_third_participation_milestone_xdr,
      contribution_threshold_xdr,
    } = rawNeuronsFundMatchedFundingCurveCoefficients;

    return {
      fullParticipationMilestoneXdr: toDecimal(
        full_participation_milestone_xdr,
      ),
      oneThirdParticipationMilestoneXdr: toDecimal(
        one_third_participation_milestone_xdr,
      ),
      contributionThresholdXdr: toDecimal(contribution_threshold_xdr),
    };
  };

  return {
    maximumIcpXdrRate: toPercentage(maximum_icp_xdr_rate),
    neuronsFundMatchedFundingCurveCoefficients:
      toNeuronsFundMatchedFundingCurveCoefficients(
        neurons_fund_matched_funding_curve_coefficients,
      ),
    maxTheoreticalNeuronsFundParticipationAmountXdr: toDecimal(
      max_theoretical_neurons_fund_participation_amount_xdr,
    ),
    minimumIcpXdrRate: toPercentage(minimum_icp_xdr_rate),
  };
};

const toVotingPowerEconomics = (
  votingPowerEconomics: Nullable<NnsGovernanceDid.VotingPowerEconomics>,
): Option<VotingPowerEconomics> => {
  const rawVotingPowerEconomics = fromNullable(votingPowerEconomics);

  if (isNullish(rawVotingPowerEconomics)) {
    return undefined;
  }

  return {
    startReducingVotingPowerAfterSeconds: fromNullable(
      rawVotingPowerEconomics.start_reducing_voting_power_after_seconds,
    ),
    neuronMinimumDissolveDelayToVoteSeconds: fromNullable(
      rawVotingPowerEconomics.neuron_minimum_dissolve_delay_to_vote_seconds,
    ),
    clearFollowingAfterSeconds: fromNullable(
      rawVotingPowerEconomics.clear_following_after_seconds,
    ),
  };
};

export const toNetworkEconomics = (
  networkEconomics: NnsGovernanceDid.NetworkEconomics,
): NetworkEconomics => ({
  neuronMinimumStake: networkEconomics.neuron_minimum_stake_e8s,
  maxProposalsToKeepPerTopic: networkEconomics.max_proposals_to_keep_per_topic,
  neuronManagementFeePerProposal:
    networkEconomics.neuron_management_fee_per_proposal_e8s,
  rejectCost: networkEconomics.reject_cost_e8s,
  transactionFee: networkEconomics.transaction_fee_e8s,
  neuronSpawnDissolveDelaySeconds:
    networkEconomics.neuron_spawn_dissolve_delay_seconds,
  minimumIcpXdrRate: networkEconomics.minimum_icp_xdr_rate,
  maximumNodeProviderRewards:
    networkEconomics.maximum_node_provider_rewards_e8s,
  neuronsFundEconomics: toNeuronsFundEconomics(
    networkEconomics.neurons_fund_economics,
  ),
  votingPowerEconomics: toVotingPowerEconomics(
    networkEconomics.voting_power_economics,
  ),
});

const toNeuronSubsetMetrics = (
  rawNeuronSubsetMetrics: Nullable<NnsGovernanceDid.NeuronSubsetMetrics>,
): Option<NeuronSubsetMetrics> => {
  const neuronSubsetMetrics = fromNullable(rawNeuronSubsetMetrics);

  if (isNullish(neuronSubsetMetrics)) {
    return undefined;
  }

  return {
    totalMaturityE8sEquivalent: fromNullable(
      neuronSubsetMetrics.total_maturity_e8s_equivalent,
    ),
    maturityE8sEquivalentBuckets:
      neuronSubsetMetrics.maturity_e8s_equivalent_buckets,
    votingPowerBuckets: neuronSubsetMetrics.voting_power_buckets,
    totalStakedE8s: fromNullable(neuronSubsetMetrics.total_staked_e8s),
    count: fromNullable(neuronSubsetMetrics.count),
    decidingVotingPowerBuckets:
      neuronSubsetMetrics.deciding_voting_power_buckets,
    totalStakedMaturityE8sEquivalent: fromNullable(
      neuronSubsetMetrics.total_staked_maturity_e8s_equivalent,
    ),
    totalPotentialVotingPower: fromNullable(
      neuronSubsetMetrics.total_potential_voting_power,
    ),
    totalDecidingVotingPower: fromNullable(
      neuronSubsetMetrics.total_deciding_voting_power,
    ),
    stakedMaturityE8sEquivalentBuckets:
      neuronSubsetMetrics.staked_maturity_e8s_equivalent_buckets,
    stakedE8sBuckets: neuronSubsetMetrics.staked_e8s_buckets,
    totalVotingPower: fromNullable(neuronSubsetMetrics.total_voting_power),
    potentialVotingPowerBuckets:
      neuronSubsetMetrics.potential_voting_power_buckets,
    countBuckets: neuronSubsetMetrics.count_buckets,
  };
};

export const toMetrics = (
  metrics: NnsGovernanceDid.GovernanceCachedMetrics,
): GovernanceCachedMetrics => ({
  totalMaturityE8sEquivalent: metrics.total_maturity_e8s_equivalent,
  notDissolvingNeuronsE8sBuckets: metrics.not_dissolving_neurons_e8s_buckets,
  dissolvingNeuronsStakedMaturityE8sEquivalentSum:
    metrics.dissolving_neurons_staked_maturity_e8s_equivalent_sum,
  garbageCollectableNeuronsCount: metrics.garbage_collectable_neurons_count,
  dissolvingNeuronsStakedMaturityE8sEquivalentBuckets:
    metrics.dissolving_neurons_staked_maturity_e8s_equivalent_buckets,
  neuronsWithInvalidStakeCount: metrics.neurons_with_invalid_stake_count,
  notDissolvingNeuronsCountBuckets:
    metrics.not_dissolving_neurons_count_buckets,
  ectNeuronCount: metrics.ect_neuron_count,
  totalSupplyIcp: metrics.total_supply_icp,
  neuronsWithLessThan6MonthsDissolveDelayCount:
    metrics.neurons_with_less_than_6_months_dissolve_delay_count,
  dissolvedNeuronsCount: metrics.dissolved_neurons_count,
  communityFundTotalMaturityE8sEquivalent:
    metrics.community_fund_total_maturity_e8s_equivalent,
  totalStakedE8sSeed: metrics.total_staked_e8s_seed,
  totalStakedMaturityE8sEquivalentEct:
    metrics.total_staked_maturity_e8s_equivalent_ect,
  totalStakedE8s: metrics.total_staked_e8s,
  fullyLostVotingPowerNeuronSubsetMetrics: toNeuronSubsetMetrics(
    metrics.fully_lost_voting_power_neuron_subset_metrics,
  ),
  notDissolvingNeuronsCount: metrics.not_dissolving_neurons_count,
  totalLockedE8s: metrics.total_locked_e8s,
  neuronsFundTotalActiveNeurons: metrics.neurons_fund_total_active_neurons,
  totalVotingPowerNonSelfAuthenticatingController: fromNullable(
    metrics.total_voting_power_non_self_authenticating_controller,
  ),
  totalStakedMaturityE8sEquivalent:
    metrics.total_staked_maturity_e8s_equivalent,
  notDissolvingNeuronsE8sBucketsEct:
    metrics.not_dissolving_neurons_e8s_buckets_ect,
  decliningVotingPowerNeuronSubsetMetrics: toNeuronSubsetMetrics(
    metrics.declining_voting_power_neuron_subset_metrics,
  ),
  spawningNeuronsCount: metrics.spawning_neurons_count,
  totalStakedE8sEct: metrics.total_staked_e8s_ect,
  notDissolvingNeuronsStakedMaturityE8sEquivalentSum:
    metrics.not_dissolving_neurons_staked_maturity_e8s_equivalent_sum,
  dissolvedNeuronsE8s: metrics.dissolved_neurons_e8s,
  totalStakedE8sNonSelfAuthenticatingController: fromNullable(
    metrics.total_staked_e8s_non_self_authenticating_controller,
  ),
  dissolvingNeuronsE8sBucketsSeed: metrics.dissolving_neurons_e8s_buckets_seed,
  neuronsWithLessThan6MonthsDissolveDelayE8s:
    metrics.neurons_with_less_than_6_months_dissolve_delay_e8s,
  notDissolvingNeuronsStakedMaturityE8sEquivalentBuckets:
    metrics.not_dissolving_neurons_staked_maturity_e8s_equivalent_buckets,
  dissolvingNeuronsCountBuckets: metrics.dissolving_neurons_count_buckets,
  dissolvingNeuronsE8sBucketsEct: metrics.dissolving_neurons_e8s_buckets_ect,
  nonSelfAuthenticatingControllerNeuronSubsetMetrics: toNeuronSubsetMetrics(
    metrics.non_self_authenticating_controller_neuron_subset_metrics,
  ),
  dissolvingNeuronsCount: metrics.dissolving_neurons_count,
  dissolvingNeuronsE8sBuckets: metrics.dissolving_neurons_e8s_buckets,
  totalStakedMaturityE8sEquivalentSeed:
    metrics.total_staked_maturity_e8s_equivalent_seed,
  communityFundTotalStakedE8s: metrics.community_fund_total_staked_e8s,
  notDissolvingNeuronsE8sBucketsSeed:
    metrics.not_dissolving_neurons_e8s_buckets_seed,
  publicNeuronSubsetMetrics: toNeuronSubsetMetrics(
    metrics.public_neuron_subset_metrics,
  ),
  timestampSeconds: metrics.timestamp_seconds,
  seedNeuronCount: metrics.seed_neuron_count,
});

const toNodeProvider = (
  nodeProvider: NnsGovernanceDid.NodeProvider,
): NodeProvider => ({
  id: nodeProvider.id.length ? nodeProvider.id[0].toString() : undefined,
  rewardAccount: nodeProvider.reward_account.length
    ? toAccountIdentifier(nodeProvider.reward_account[0])
    : undefined,
});

const toAmount = (amount: NnsGovernanceDid.Amount): E8s => amount.e8s;

const toAccountIdentifier = (
  accountIdentifier: NnsGovernanceDid.AccountIdentifier,
): AccountIdentifierHex =>
  accountIdentifierFromBytes(new Uint8Array(accountIdentifier.hash));

const toRewardMode = (rewardMode: NnsGovernanceDid.RewardMode): RewardMode => {
  if ("RewardToNeuron" in rewardMode) {
    return {
      RewardToNeuron: {
        dissolveDelaySeconds: rewardMode.RewardToNeuron.dissolve_delay_seconds,
      },
    };
  }
  if ("RewardToAccount" in rewardMode) {
    return {
      RewardToAccount: {
        toAccount:
          rewardMode.RewardToAccount.to_account != undefined &&
          rewardMode.RewardToAccount.to_account.length
            ? toAccountIdentifier(rewardMode.RewardToAccount.to_account[0])
            : undefined,
      },
    };
  }
  // Ensures all cases are covered at compile-time.
  throw new UnsupportedValueError(rewardMode);
};

const toClaimOrRefreshBy = (by: NnsGovernanceDid.By): By => {
  if ("NeuronIdOrSubaccount" in by) {
    return {
      NeuronIdOrSubaccount: {},
    };
  }
  if ("Memo" in by) {
    return {
      Memo: by.Memo,
    };
  }
  if ("MemoAndController" in by) {
    return {
      MemoAndController: {
        memo: by.MemoAndController.memo,
        controller: by.MemoAndController.controller.length
          ? by.MemoAndController.controller[0]
          : undefined,
      },
    };
  }
  // Ensures all cases are covered at compile-time.
  throw new UnsupportedValueError(by);
};

export const toProposalInfo = (
  proposalInfo: NnsGovernanceDid.ProposalInfo,
): ProposalInfo => ({
  id: proposalInfo.id.length ? toNeuronId(proposalInfo.id[0]) : undefined,
  ballots: proposalInfo.ballots.map((b) =>
    toBallot({ neuronId: b[0], ballot: b[1] }),
  ),
  rejectCost: proposalInfo.reject_cost_e8s,
  proposalTimestampSeconds: proposalInfo.proposal_timestamp_seconds,
  rewardEventRound: proposalInfo.reward_event_round,
  failedTimestampSeconds: proposalInfo.failed_timestamp_seconds,
  deadlineTimestampSeconds: fromNullable(
    proposalInfo.deadline_timestamp_seconds,
  ),
  decidedTimestampSeconds: proposalInfo.decided_timestamp_seconds,
  proposal: proposalInfo.proposal.length
    ? toProposal(proposalInfo.proposal[0])
    : undefined,
  proposer: proposalInfo.proposer.length
    ? toNeuronId(proposalInfo.proposer[0])
    : undefined,
  latestTally: proposalInfo.latest_tally.length
    ? toTally(proposalInfo.latest_tally[0])
    : undefined,
  executedTimestampSeconds: proposalInfo.executed_timestamp_seconds,
  topic: proposalInfo.topic,
  status: proposalInfo.status,
  rewardStatus: proposalInfo.reward_status,
  totalPotentialVotingPower: fromNullable(
    proposalInfo.total_potential_voting_power,
  ),
});

export const toArrayOfNeuronInfo = ({
  response: { neuron_infos, full_neurons },
  canisterId,
}: {
  response: NnsGovernanceDid.ListNeuronsResponse;
  canisterId: Principal;
}): Array<NeuronInfo> =>
  neuron_infos.map(([id, neuronInfo]) =>
    toNeuronInfo({
      neuronId: id,
      neuronInfo,
      rawNeuron: full_neurons.find(
        (neuron) => neuron.id.length && neuron.id[0].id === id,
      ),
      canisterId,
    }),
  );

export const toListProposalsResponse = ({
  proposal_info,
}: NnsGovernanceDid.ListProposalInfoResponse): ListProposalsResponse => ({
  proposals: proposal_info.map(toProposalInfo),
});

export const toKnownNeuron = ({
  id,
  known_neuron_data,
}: NnsGovernanceDid.KnownNeuron): KnownNeuron => ({
  id: id[0]?.id ?? BigInt(0),
  name: known_neuron_data[0]?.name ?? "",
  description: known_neuron_data[0]?.description[0] ?? "",
  links: fromNullable(known_neuron_data[0]?.links ?? []),
  committed_topics: fromNullable(known_neuron_data[0]?.committed_topics ?? []),
});

const toPercentage = (
  percentage: NnsGovernanceDid.Percentage | undefined,
): Percentage | undefined =>
  percentage === undefined
    ? undefined
    : {
        basisPoints: fromNullable(percentage.basis_points),
      };

const toDuration = (
  duration: NnsGovernanceDid.Duration | undefined,
): Duration | undefined =>
  duration === undefined
    ? undefined
    : {
        seconds: fromNullable(duration.seconds),
      };

const toGlobalTimeOfDay = (
  time: NnsGovernanceDid.GlobalTimeOfDay | undefined,
): GlobalTimeOfDay | undefined =>
  time === undefined
    ? undefined
    : {
        secondsAfterUtcMidnight: fromNullable(time.seconds_after_utc_midnight),
      };

const toCountries = (
  countries: NnsGovernanceDid.Countries | undefined,
): Countries | undefined =>
  countries === undefined
    ? undefined
    : ({
        isoCodes: countries.iso_codes,
      } as Countries);

const toTokens = (
  tokens: NnsGovernanceDid.Tokens | undefined,
): Tokens | undefined =>
  tokens === undefined
    ? undefined
    : {
        e8s: fromNullable(tokens.e8s),
      };

const toCanisterIdString = (
  canister: NnsGovernanceDid.Canister | undefined,
): CanisterIdString | undefined =>
  canister === undefined
    ? undefined
    : canister.id.length === 0
      ? undefined
      : fromDefinedNullable(canister.id).toString();

const toImage = (
  image: NnsGovernanceDid.Image | undefined,
): Image | undefined =>
  image === undefined
    ? undefined
    : {
        base64Encoding: fromNullable(image.base64_encoding),
      };

const toLedgerParameters = (
  ledgerParameters: NnsGovernanceDid.LedgerParameters | undefined,
): LedgerParameters | undefined =>
  ledgerParameters === undefined
    ? undefined
    : {
        transactionFee: toTokens(
          fromNullable(ledgerParameters.transaction_fee),
        ),
        tokenSymbol: fromNullable(ledgerParameters.token_symbol),
        tokenLogo: toImage(fromNullable(ledgerParameters.token_logo)),
        tokenName: fromNullable(ledgerParameters.token_name),
      };

const toVotingRewardParameters = (
  votingRewardParameters: NnsGovernanceDid.VotingRewardParameters | undefined,
): VotingRewardParameters | undefined =>
  votingRewardParameters === undefined
    ? undefined
    : {
        rewardRateTransitionDuration: toDuration(
          fromNullable(votingRewardParameters.reward_rate_transition_duration),
        ),
        initialRewardRate: toPercentage(
          fromNullable(votingRewardParameters.initial_reward_rate),
        ),
        finalRewardRate: toPercentage(
          fromNullable(votingRewardParameters.final_reward_rate),
        ),
      };

const toGovernanceParameters = (
  governanceParameters: NnsGovernanceDid.GovernanceParameters | undefined,
): GovernanceParameters | undefined =>
  governanceParameters === undefined
    ? undefined
    : {
        neuronMaximumDissolveDelayBonus: toPercentage(
          fromNullable(
            governanceParameters.neuron_maximum_dissolve_delay_bonus,
          ),
        ),
        neuronMaximumAgeForAgeBonus: toDuration(
          fromNullable(governanceParameters.neuron_maximum_age_for_age_bonus),
        ),
        neuronMaximumDissolveDelay: toDuration(
          fromNullable(governanceParameters.neuron_maximum_dissolve_delay),
        ),
        neuronMinimumDissolveDelayToVote: toDuration(
          fromNullable(
            governanceParameters.neuron_minimum_dissolve_delay_to_vote,
          ),
        ),
        neuronMaximumAgeBonus: toPercentage(
          fromNullable(governanceParameters.neuron_maximum_age_bonus),
        ),
        neuronMinimumStake: toTokens(
          fromNullable(governanceParameters.neuron_minimum_stake),
        ),
        proposalWaitForQuietDeadlineIncrease: toDuration(
          fromNullable(
            governanceParameters.proposal_wait_for_quiet_deadline_increase,
          ),
        ),
        proposalInitialVotingPeriod: toDuration(
          fromNullable(governanceParameters.proposal_initial_voting_period),
        ),
        proposalRejectionFee: toTokens(
          fromNullable(governanceParameters.proposal_rejection_fee),
        ),
        votingRewardParameters: toVotingRewardParameters(
          fromNullable(governanceParameters.voting_reward_parameters),
        ),
      };

const toNeuronBasketConstructionParameters = (
  neuronBasketConstructionParameters:
    | NnsGovernanceDid.NeuronBasketConstructionParameters
    | undefined,
): NeuronBasketConstructionParameters | undefined =>
  neuronBasketConstructionParameters === undefined
    ? undefined
    : {
        dissolveDelayInterval: toDuration(
          fromNullable(
            neuronBasketConstructionParameters.dissolve_delay_interval,
          ),
        ),
        count: fromNullable(neuronBasketConstructionParameters.count),
      };

const toSwapParameters = (
  swapParameters: NnsGovernanceDid.SwapParameters | undefined,
): SwapParameters | undefined =>
  swapParameters === undefined
    ? undefined
    : {
        minimumParticipants: fromNullable(swapParameters.minimum_participants),
        duration: toDuration(fromNullable(swapParameters.duration)),
        neuronBasketConstructionParameters:
          toNeuronBasketConstructionParameters(
            fromNullable(swapParameters.neuron_basket_construction_parameters),
          ),
        confirmationText: fromNullable(swapParameters.confirmation_text),
        maximumParticipantIcp: toTokens(
          fromNullable(swapParameters.maximum_participant_icp),
        ),
        neuronsFundInvestmentIcp: toTokens(
          fromNullable(swapParameters.neurons_fund_investment_icp),
        ),
        minimumIcp: toTokens(fromNullable(swapParameters.minimum_icp)),
        minimumParticipantIcp: toTokens(
          fromNullable(swapParameters.minimum_participant_icp),
        ),
        startTime: toGlobalTimeOfDay(fromNullable(swapParameters.start_time)),
        maximumIcp: toTokens(fromNullable(swapParameters.maximum_icp)),
        restrictedCountries: toCountries(
          fromNullable(swapParameters.restricted_countries),
        ),
        maxDirectParticipationIcp: toTokens(
          fromNullable(swapParameters.maximum_direct_participation_icp),
        ),
        minDirectParticipationIcp: toTokens(
          fromNullable(swapParameters.minimum_direct_participation_icp),
        ),
        neuronsFundParticipation: fromNullable(
          swapParameters.neurons_fund_participation,
        ),
      };

const toSwapDistribution = (
  swapDistribution: NnsGovernanceDid.SwapDistribution | undefined,
): SwapDistribution | undefined =>
  swapDistribution === undefined
    ? undefined
    : {
        total: toTokens(fromNullable(swapDistribution.total)),
      };

const toNeuronDistribution = (
  neuronDistribution: NnsGovernanceDid.NeuronDistribution | undefined,
): NeuronDistribution | undefined =>
  neuronDistribution === undefined
    ? undefined
    : {
        controller:
          neuronDistribution.controller.length === 0
            ? undefined
            : neuronDistribution.controller[0].toString(),
        dissolveDelay: toDuration(
          fromNullable(neuronDistribution.dissolve_delay),
        ),
        memo: fromNullable(neuronDistribution.memo),
        vestingPeriod: toDuration(
          fromNullable(neuronDistribution.vesting_period),
        ),
        stake: toTokens(fromNullable(neuronDistribution.stake)),
      };

const toDeveloperDistribution = (
  developerDistribution: NnsGovernanceDid.DeveloperDistribution | undefined,
): DeveloperDistribution | undefined =>
  developerDistribution === undefined
    ? undefined
    : {
        developerNeurons: developerDistribution.developer_neurons.map(
          toNeuronDistribution,
        ) as Array<NeuronDistribution>,
      };

const toInitialTokenDistribution = (
  initialTokenDistribution:
    | NnsGovernanceDid.InitialTokenDistribution
    | undefined,
): InitialTokenDistribution | undefined =>
  initialTokenDistribution === undefined
    ? undefined
    : {
        treasuryDistribution: toSwapDistribution(
          fromNullable(initialTokenDistribution.treasury_distribution),
        ),
        developerDistribution: toDeveloperDistribution(
          fromNullable(initialTokenDistribution.developer_distribution),
        ),
        swapDistribution: toSwapDistribution(
          fromNullable(initialTokenDistribution.swap_distribution),
        ),
      };

const toCanisterSettings = (
  canisterSettings: NnsGovernanceDid.CanisterSettings | undefined,
): CanisterSettings | undefined =>
  canisterSettings === undefined
    ? undefined
    : {
        freezingThreshold: fromNullable(canisterSettings.freezing_threshold),
        controllers: fromNullable(
          canisterSettings.controllers,
        )?.controllers.map((controller) => controller.toString()),
        logVisibility: fromNullable(canisterSettings.log_visibility) as
          | LogVisibility
          | undefined,
        wasmMemoryLimit: fromNullable(canisterSettings.wasm_memory_limit),
        computeAllocation: fromNullable(canisterSettings.compute_allocation),
        memoryAllocation: fromNullable(canisterSettings.memory_allocation),
        wasmMemoryThreshold: fromNullable(
          canisterSettings.wasm_memory_threshold,
        ),
      };
