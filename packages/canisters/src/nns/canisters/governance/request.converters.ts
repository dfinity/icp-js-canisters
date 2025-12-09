import {
  arrayBufferToUint8Array,
  arrayOfNumberToUint8Array,
  isNullish,
  nonNullish,
  toNullable,
  type Nullable,
} from "@dfinity/utils";
import { Principal } from "@icp-sdk/core/principal";
import type {
  Amount,
  NeuronSubaccount,
  Account as RawAccount,
  AccountIdentifier as RawAccountIdentifier,
  ProposalActionRequest as RawAction,
  By as RawBy,
  CanisterSettings as RawCanisterSettings,
  Change as RawChange,
  ManageNeuronCommandRequest as RawCommand,
  Countries as RawCountries,
  CreateServiceNervousSystem as RawCreateServiceNervousSystem,
  Decimal as RawDecimal,
  DeveloperDistribution as RawDeveloperDistribution,
  Duration as RawDuration,
  GlobalTimeOfDay as RawGlobalTimeOfDay,
  GovernanceParameters as RawGovernanceParameters,
  Image as RawImage,
  InitialTokenDistribution as RawInitialTokenDistribution,
  InstallCodeRequest as RawInstallCode,
  LedgerParameters as RawLedgerParameters,
  ListNeurons as RawListNeurons,
  ListProposalInfoRequest as RawListProposalInfo,
  ManageNeuronRequest as RawManageNeuron,
  NeuronBasketConstructionParameters as RawNeuronBasketConstructionParameters,
  NeuronDistribution as RawNeuronDistribution,
  NeuronId as RawNeuronId,
  NeuronIdOrSubaccount as RawNeuronIdOrSubaccount,
  NeuronsFundEconomics as RawNeuronsFundEconomics,
  NeuronsFundMatchedFundingCurveCoefficients as RawNeuronsFundMatchedFundingCurveCoefficients,
  NodeProvider as RawNodeProvider,
  Operation as RawOperation,
  Percentage as RawPercentage,
  RewardMode as RawRewardMode,
  SwapDistribution as RawSwapDistribution,
  SwapParameters as RawSwapParameters,
  Tokens as RawTokens,
  VotingPowerEconomics as RawVotingPowerEconomics,
  VotingRewardParameters as RawVotingRewardParameters,
} from "../../../declarations/nns/governance";
import type {
  AccountIdentifier as AccountIdentifierClass,
  AccountIdentifierHex,
} from "../../../ledger/icp";
import type { NeuronVisibility, Vote } from "../../enums/governance.enums";
import { UnsupportedValueError } from "../../errors/governance.errors";
import type { E8s, NeuronId, Option } from "../../types/common";
import type {
  Account,
  By,
  CanisterSettings,
  Change,
  ClaimOrRefreshNeuronRequest,
  Countries,
  CreateServiceNervousSystem,
  Decimal,
  DeveloperDistribution,
  DisburseToNeuronRequest,
  Duration,
  FollowRequest,
  FolloweesForTopic,
  GlobalTimeOfDay,
  GovernanceParameters,
  Image,
  InitialTokenDistribution,
  InstallCodeRequest,
  LedgerParameters,
  ListProposalsRequest,
  MakeProposalRequest,
  ManageNeuronCommandRequest,
  ManageNeuronRequest,
  NeuronBasketConstructionParameters,
  NeuronDistribution,
  NeuronIdOrSubaccount,
  NeuronsFundEconomics,
  NeuronsFundMatchedFundingCurveCoefficients,
  NodeProvider,
  Operation,
  Percentage,
  ProposalActionRequest,
  ProposalId,
  RewardMode,
  SwapDistribution,
  SwapParameters,
  Tokens,
  VotingPowerEconomics,
  VotingRewardParameters,
} from "../../types/governance_converters";
import { accountIdentifierToBytes } from "../../utils/account_identifier.utils";

const fromProposalId = (proposalId: ProposalId): RawNeuronId => ({
  id: proposalId,
});

const fromNeuronId = (neuronId: NeuronId): RawNeuronId => ({
  id: neuronId,
});

const fromNeuronIdOrSubaccount = (
  neuronIdOrSubaccount: NeuronIdOrSubaccount,
): RawNeuronIdOrSubaccount => {
  if ("NeuronId" in neuronIdOrSubaccount) {
    return { NeuronId: { id: neuronIdOrSubaccount.NeuronId } };
  }
  if ("Subaccount" in neuronIdOrSubaccount) {
    return { Subaccount: Uint8Array.from(neuronIdOrSubaccount.Subaccount) };
  }
  throw new UnsupportedValueError(neuronIdOrSubaccount);
};

const fromPercentage = (percentage: Percentage): RawPercentage =>
  percentage.basisPoints !== undefined
    ? { basis_points: [percentage.basisPoints] }
    : { basis_points: [] };

const fromDuration = (duration: Duration): RawDuration =>
  duration.seconds !== undefined
    ? { seconds: [duration.seconds] }
    : { seconds: [] };

const fromGlobalTimeOfDay = (time: GlobalTimeOfDay): RawGlobalTimeOfDay =>
  time.secondsAfterUtcMidnight !== undefined
    ? { seconds_after_utc_midnight: [time.secondsAfterUtcMidnight] }
    : { seconds_after_utc_midnight: [] };

const fromCountries = (countries: Countries): RawCountries => ({
  iso_codes: countries.isoCodes,
});

const fromTokens = (tokens: Tokens): RawTokens =>
  tokens.e8s !== undefined ? { e8s: [tokens.e8s] } : { e8s: [] };

const fromImage = (image: Image): RawImage =>
  image.base64Encoding !== undefined
    ? { base64_encoding: [image.base64Encoding] }
    : { base64_encoding: [] };

const fromVotingRewardParameters = (
  votingRewardParameters: VotingRewardParameters,
): RawVotingRewardParameters => ({
  reward_rate_transition_duration:
    votingRewardParameters.rewardRateTransitionDuration !== undefined
      ? [fromDuration(votingRewardParameters.rewardRateTransitionDuration)]
      : [],
  initial_reward_rate:
    votingRewardParameters.initialRewardRate !== undefined
      ? [fromPercentage(votingRewardParameters.initialRewardRate)]
      : [],
  final_reward_rate:
    votingRewardParameters.finalRewardRate !== undefined
      ? [fromPercentage(votingRewardParameters.finalRewardRate)]
      : [],
});

const fromLedgerParameters = (
  ledgerParameters: LedgerParameters,
): RawLedgerParameters => ({
  transaction_fee:
    ledgerParameters.transactionFee !== undefined
      ? [fromTokens(ledgerParameters.transactionFee)]
      : [],
  token_symbol:
    ledgerParameters.tokenSymbol !== undefined
      ? [ledgerParameters.tokenSymbol]
      : [],
  token_logo:
    ledgerParameters.tokenLogo !== undefined
      ? [fromImage(ledgerParameters.tokenLogo)]
      : [],
  token_name:
    ledgerParameters.tokenName !== undefined
      ? [ledgerParameters.tokenName]
      : [],
});

const fromSwapParameters = (
  swapParameters: SwapParameters,
): RawSwapParameters => ({
  minimum_participants:
    swapParameters.minimumParticipants !== undefined
      ? [swapParameters.minimumParticipants]
      : [],
  duration:
    swapParameters.duration !== undefined
      ? [fromDuration(swapParameters.duration)]
      : [],
  neuron_basket_construction_parameters:
    swapParameters.neuronBasketConstructionParameters !== undefined
      ? [
          fromNeuronBasketConstructionParameters(
            swapParameters.neuronBasketConstructionParameters,
          ),
        ]
      : [],
  confirmation_text:
    swapParameters.confirmationText !== undefined
      ? [swapParameters.confirmationText]
      : [],
  maximum_participant_icp:
    swapParameters.maximumParticipantIcp !== undefined
      ? [fromTokens(swapParameters.maximumParticipantIcp)]
      : [],
  neurons_fund_investment_icp:
    swapParameters.neuronsFundInvestmentIcp !== undefined
      ? [fromTokens(swapParameters.neuronsFundInvestmentIcp)]
      : [],
  minimum_icp:
    swapParameters.minimumIcp !== undefined
      ? [fromTokens(swapParameters.minimumIcp)]
      : [],
  minimum_participant_icp:
    swapParameters.minimumParticipantIcp !== undefined
      ? [fromTokens(swapParameters.minimumParticipantIcp)]
      : [],
  start_time:
    swapParameters.startTime !== undefined
      ? [fromGlobalTimeOfDay(swapParameters.startTime)]
      : [],
  maximum_icp:
    swapParameters.maximumIcp !== undefined
      ? [fromTokens(swapParameters.maximumIcp)]
      : [],
  restricted_countries:
    swapParameters.restrictedCountries !== undefined
      ? [fromCountries(swapParameters.restrictedCountries)]
      : [],
  maximum_direct_participation_icp:
    swapParameters.maxDirectParticipationIcp !== undefined
      ? [fromTokens(swapParameters.maxDirectParticipationIcp)]
      : [],
  minimum_direct_participation_icp:
    swapParameters.minDirectParticipationIcp !== undefined
      ? [fromTokens(swapParameters.minDirectParticipationIcp)]
      : [],
  neurons_fund_participation: toNullable(
    swapParameters.neuronsFundParticipation,
  ),
});

const fromNeuronBasketConstructionParameters = (
  neuronBasketConstructionParameters: NeuronBasketConstructionParameters,
): RawNeuronBasketConstructionParameters => ({
  dissolve_delay_interval:
    neuronBasketConstructionParameters.dissolveDelayInterval !== undefined
      ? [fromDuration(neuronBasketConstructionParameters.dissolveDelayInterval)]
      : [],
  count:
    neuronBasketConstructionParameters.count !== undefined
      ? [neuronBasketConstructionParameters.count]
      : [],
});

const fromGovernanceParameters = (
  governanceParameters: GovernanceParameters,
): RawGovernanceParameters => ({
  neuron_maximum_dissolve_delay_bonus:
    governanceParameters.neuronMaximumDissolveDelayBonus !== undefined
      ? [fromPercentage(governanceParameters.neuronMaximumDissolveDelayBonus)]
      : [],
  neuron_maximum_age_for_age_bonus:
    governanceParameters.neuronMaximumAgeForAgeBonus !== undefined
      ? [fromDuration(governanceParameters.neuronMaximumAgeForAgeBonus)]
      : [],
  neuron_maximum_dissolve_delay:
    governanceParameters.neuronMaximumDissolveDelay !== undefined
      ? [fromDuration(governanceParameters.neuronMaximumDissolveDelay)]
      : [],
  neuron_minimum_dissolve_delay_to_vote:
    governanceParameters.neuronMinimumDissolveDelayToVote !== undefined
      ? [fromDuration(governanceParameters.neuronMinimumDissolveDelayToVote)]
      : [],
  neuron_maximum_age_bonus:
    governanceParameters.neuronMaximumAgeBonus !== undefined
      ? [fromPercentage(governanceParameters.neuronMaximumAgeBonus)]
      : [],
  neuron_minimum_stake:
    governanceParameters.neuronMinimumStake !== undefined
      ? [fromTokens(governanceParameters.neuronMinimumStake)]
      : [],
  proposal_wait_for_quiet_deadline_increase:
    governanceParameters.proposalWaitForQuietDeadlineIncrease !== undefined
      ? [
          fromDuration(
            governanceParameters.proposalWaitForQuietDeadlineIncrease,
          ),
        ]
      : [],
  proposal_initial_voting_period:
    governanceParameters.proposalInitialVotingPeriod !== undefined
      ? [fromDuration(governanceParameters.proposalInitialVotingPeriod)]
      : [],
  proposal_rejection_fee:
    governanceParameters.proposalRejectionFee !== undefined
      ? [fromTokens(governanceParameters.proposalRejectionFee)]
      : [],
  voting_reward_parameters:
    governanceParameters.votingRewardParameters !== undefined
      ? [
          fromVotingRewardParameters(
            governanceParameters.votingRewardParameters,
          ),
        ]
      : [],
});

const fromSwapDistribution = (
  swapDistribution: SwapDistribution,
): RawSwapDistribution => ({
  total:
    swapDistribution.total !== undefined
      ? [fromTokens(swapDistribution.total)]
      : [],
});

const fromInitialTokenDistribution = (
  initialTokenDistribution: InitialTokenDistribution,
): RawInitialTokenDistribution => ({
  treasury_distribution:
    initialTokenDistribution.treasuryDistribution !== undefined
      ? [fromSwapDistribution(initialTokenDistribution.treasuryDistribution)]
      : [],
  developer_distribution:
    initialTokenDistribution.developerDistribution !== undefined
      ? [
          fromDeveloperDistribution(
            initialTokenDistribution.developerDistribution,
          ),
        ]
      : [],
  swap_distribution:
    initialTokenDistribution.swapDistribution !== undefined
      ? [fromSwapDistribution(initialTokenDistribution.swapDistribution)]
      : [],
});

const fromNeuronDistribution = (
  neuronDistribution: NeuronDistribution,
): RawNeuronDistribution => ({
  controller:
    neuronDistribution.controller !== undefined
      ? [Principal.fromText(neuronDistribution.controller)]
      : [],
  dissolve_delay:
    neuronDistribution.dissolveDelay !== undefined
      ? [fromDuration(neuronDistribution.dissolveDelay)]
      : [],
  memo: neuronDistribution.memo !== undefined ? [neuronDistribution.memo] : [],
  vesting_period:
    neuronDistribution.vestingPeriod !== undefined
      ? [fromDuration(neuronDistribution.vestingPeriod)]
      : [],
  stake:
    neuronDistribution.stake !== undefined
      ? [fromTokens(neuronDistribution.stake)]
      : [],
});

const fromDeveloperDistribution = (
  developerDistribution: DeveloperDistribution,
): RawDeveloperDistribution => ({
  developer_neurons: developerDistribution.developerNeurons.map(
    fromNeuronDistribution,
  ),
});

const fromCreateServiceNervousSystem = (
  createServiceNervousSystem: CreateServiceNervousSystem,
): RawCreateServiceNervousSystem => ({
  url:
    createServiceNervousSystem.url !== undefined
      ? [createServiceNervousSystem.url]
      : [],
  governance_parameters:
    createServiceNervousSystem.governanceParameters !== undefined
      ? [
          fromGovernanceParameters(
            createServiceNervousSystem.governanceParameters,
          ),
        ]
      : [],
  fallback_controller_principal_ids:
    createServiceNervousSystem.fallbackControllerPrincipalIds.map((id) =>
      Principal.fromText(id),
    ),
  logo:
    createServiceNervousSystem.logo !== undefined
      ? [fromImage(createServiceNervousSystem.logo)]
      : [],
  name:
    createServiceNervousSystem.name !== undefined
      ? [createServiceNervousSystem.name]
      : [],
  ledger_parameters:
    createServiceNervousSystem.ledgerParameters !== undefined
      ? [fromLedgerParameters(createServiceNervousSystem.ledgerParameters)]
      : [],
  description:
    createServiceNervousSystem.description !== undefined
      ? [createServiceNervousSystem.description]
      : [],
  dapp_canisters: createServiceNervousSystem.dappCanisters.map(
    (principalId) => ({
      id: [Principal.fromText(principalId)],
    }),
  ),
  swap_parameters:
    createServiceNervousSystem.swapParameters !== undefined
      ? [fromSwapParameters(createServiceNervousSystem.swapParameters)]
      : [],
  initial_token_distribution:
    createServiceNervousSystem.initialTokenDistribution !== undefined
      ? [
          fromInitialTokenDistribution(
            createServiceNervousSystem.initialTokenDistribution,
          ),
        ]
      : [],
});

const fromInstallCode = (installCode: InstallCodeRequest): RawInstallCode => {
  if (installCode.wasmModule === undefined) {
    throw new Error("wasmModule not found");
  }

  return {
    arg: toNullable(
      arrayBufferToUint8Array(installCode.arg ?? new ArrayBuffer(0)),
    ),
    wasm_module: toNullable(arrayBufferToUint8Array(installCode.wasmModule)),
    skip_stopping_before_installing: toNullable(
      installCode.skipStoppingBeforeInstalling,
    ),
    canister_id: toNullable(
      nonNullish(installCode.canisterId)
        ? Principal.fromText(installCode.canisterId)
        : undefined,
    ),
    install_mode: toNullable(installCode.installMode as number),
  };
};

const fromCanisterSettings = (
  canisterSettings: Option<CanisterSettings>,
): Nullable<RawCanisterSettings> =>
  toNullable(
    canisterSettings === undefined
      ? undefined
      : {
          freezing_threshold: toNullable(canisterSettings.freezingThreshold),
          controllers: canisterSettings.controllers
            ? [
                {
                  controllers: canisterSettings.controllers.map((controller) =>
                    Principal.fromText(controller),
                  ),
                },
              ]
            : [],
          log_visibility: toNullable(canisterSettings.logVisibility as number),
          wasm_memory_limit: toNullable(canisterSettings.wasmMemoryLimit),
          compute_allocation: toNullable(canisterSettings.computeAllocation),
          memory_allocation: toNullable(canisterSettings.memoryAllocation),
          wasm_memory_threshold: toNullable(
            canisterSettings.wasmMemoryThreshold,
          ),
        },
  );

const fromAction = (action: ProposalActionRequest): RawAction => {
  if ("ExecuteNnsFunction" in action) {
    const executeNnsFunction = action.ExecuteNnsFunction;

    if (executeNnsFunction.payloadBytes === undefined) {
      throw new Error("payloadBytes not found");
    }

    return {
      ExecuteNnsFunction: {
        nns_function: executeNnsFunction.nnsFunctionId,
        payload: arrayBufferToUint8Array(executeNnsFunction.payloadBytes),
      },
    };
  }
  if ("ManageNeuron" in action) {
    const manageNeuron = action.ManageNeuron;
    return {
      ManageNeuron: fromManageNeuron(manageNeuron),
    };
  }
  if ("ApproveGenesisKyc" in action) {
    const approveGenesisKyc = action.ApproveGenesisKyc;
    return {
      ApproveGenesisKyc: {
        principals: approveGenesisKyc.principals.map(Principal.fromText),
      },
    };
  }
  if ("ManageNetworkEconomics" in action) {
    const networkEconomics = action.ManageNetworkEconomics;
    return {
      ManageNetworkEconomics: {
        neuron_minimum_stake_e8s: networkEconomics.neuronMinimumStake,
        max_proposals_to_keep_per_topic:
          networkEconomics.maxProposalsToKeepPerTopic,
        neuron_management_fee_per_proposal_e8s:
          networkEconomics.neuronManagementFeePerProposal,
        reject_cost_e8s: networkEconomics.rejectCost,
        transaction_fee_e8s: networkEconomics.transactionFee,
        neuron_spawn_dissolve_delay_seconds:
          networkEconomics.neuronSpawnDissolveDelaySeconds,
        minimum_icp_xdr_rate: networkEconomics.minimumIcpXdrRate,
        maximum_node_provider_rewards_e8s:
          networkEconomics.maximumNodeProviderRewards,
        neurons_fund_economics: fromNeuronsFundEconomics(
          networkEconomics.neuronsFundEconomics,
        ),
        voting_power_economics: fromVotingPowerEconomics(
          networkEconomics.votingPowerEconomics,
        ),
      },
    };
  }
  if ("RewardNodeProvider" in action) {
    const rewardNodeProvider = action.RewardNodeProvider;
    return {
      RewardNodeProvider: {
        node_provider: rewardNodeProvider.nodeProvider
          ? [fromNodeProvider(rewardNodeProvider.nodeProvider)]
          : [],
        amount_e8s: rewardNodeProvider.amountE8s,
        reward_mode:
          rewardNodeProvider.rewardMode != null
            ? [fromRewardMode(rewardNodeProvider.rewardMode)]
            : [],
      },
    };
  }
  if ("RewardNodeProviders" in action) {
    const rewardNodeProviders = action.RewardNodeProviders;
    return {
      RewardNodeProviders: {
        use_registry_derived_rewards:
          rewardNodeProviders.useRegistryDerivedRewards === undefined
            ? []
            : [rewardNodeProviders.useRegistryDerivedRewards],
        rewards: rewardNodeProviders.rewards.map((r) => ({
          node_provider: r.nodeProvider
            ? [fromNodeProvider(r.nodeProvider)]
            : [],
          amount_e8s: r.amountE8s,
          reward_mode:
            r.rewardMode != null ? [fromRewardMode(r.rewardMode)] : [],
        })),
      },
    };
  }
  if ("AddOrRemoveNodeProvider" in action) {
    const addOrRemoveNodeProvider = action.AddOrRemoveNodeProvider;
    return {
      AddOrRemoveNodeProvider: {
        change: addOrRemoveNodeProvider.change
          ? [fromChange(addOrRemoveNodeProvider.change)]
          : [],
      },
    };
  }
  if ("Motion" in action) {
    const motion = action.Motion;
    return {
      Motion: {
        motion_text: motion.motionText,
      },
    };
  }

  if ("RegisterKnownNeuron" in action) {
    const knownNeuron = action.RegisterKnownNeuron;
    return {
      RegisterKnownNeuron: {
        id: [{ id: knownNeuron.id }],
        known_neuron_data: [
          {
            name: knownNeuron.name,
            description:
              knownNeuron.description !== undefined
                ? [knownNeuron.description]
                : [],
            links: toNullable(knownNeuron.links),
            committed_topics: toNullable(knownNeuron.committed_topics),
          },
        ],
      },
    };
  }

  if ("DeregisterKnownNeuron" in action) {
    const knownNeuron = action.DeregisterKnownNeuron;
    return {
      DeregisterKnownNeuron: {
        id: knownNeuron.id === undefined ? [] : [{ id: knownNeuron.id }],
      },
    };
  }

  if ("CreateServiceNervousSystem" in action) {
    return {
      CreateServiceNervousSystem: fromCreateServiceNervousSystem(
        action.CreateServiceNervousSystem,
      ),
    };
  }

  if ("InstallCode" in action) {
    return {
      InstallCode: fromInstallCode(action.InstallCode),
    };
  }

  if ("StopOrStartCanister" in action) {
    const stopOrStartCanister = action.StopOrStartCanister;
    return {
      StopOrStartCanister: {
        canister_id: stopOrStartCanister.canisterId
          ? [Principal.fromText(stopOrStartCanister.canisterId)]
          : [],
        action: stopOrStartCanister.action
          ? [stopOrStartCanister.action as number]
          : [],
      },
    };
  }

  if ("UpdateCanisterSettings" in action) {
    const updateCanisterSettings = action.UpdateCanisterSettings;
    return {
      UpdateCanisterSettings: {
        canister_id: updateCanisterSettings.canisterId
          ? [Principal.fromText(updateCanisterSettings.canisterId)]
          : [],
        settings: fromCanisterSettings(updateCanisterSettings.settings),
      },
    };
  }

  // If there's a missing action, this line will cause a compiler error.
  throw new UnsupportedValueError(action);
};

const fromCommand = (command: ManageNeuronCommandRequest): RawCommand => {
  if ("Split" in command) {
    const split = command.Split;
    return {
      Split: {
        amount_e8s: split.amount,
        memo: toNullable(split.memo),
      },
    };
  }
  if ("Follow" in command) {
    const follow = command.Follow;
    return {
      Follow: {
        topic: follow.topic,
        followees: follow.followees.map(fromNeuronId),
      },
    };
  }
  if ("DisburseMaturity" in command) {
    const disburseMaturity = command.DisburseMaturity;
    return {
      DisburseMaturity: {
        to_account: disburseMaturity.toAccount
          ? [fromAccount(disburseMaturity.toAccount)]
          : [],
        to_account_identifier: nonNullish(disburseMaturity.toAccountIdentifier)
          ? [fromAccountIdentifier(disburseMaturity.toAccountIdentifier)]
          : [],
        percentage_to_disburse: disburseMaturity.percentageToDisburse,
      },
    };
  }
  if ("ClaimOrRefresh" in command) {
    const claimOrRefresh = command.ClaimOrRefresh;
    return {
      ClaimOrRefresh: {
        by: claimOrRefresh.by ? [fromClaimOrRefreshBy(claimOrRefresh.by)] : [],
      },
    };
  }
  if ("Configure" in command) {
    const configure = command.Configure;
    return {
      Configure: {
        operation: configure.operation
          ? [fromOperation(configure.operation)]
          : [],
      },
    };
  }
  if ("RegisterVote" in command) {
    const registerVote = command.RegisterVote;
    return {
      RegisterVote: {
        vote: registerVote.vote,
        proposal: registerVote.proposal
          ? [fromProposalId(registerVote.proposal)]
          : [],
      },
    };
  }
  if ("DisburseToNeuron" in command) {
    const disburseToNeuron = command.DisburseToNeuron;
    return {
      DisburseToNeuron: {
        dissolve_delay_seconds: disburseToNeuron.dissolveDelaySeconds,
        kyc_verified: disburseToNeuron.kycVerified,
        amount_e8s: disburseToNeuron.amount,
        new_controller: disburseToNeuron.newController
          ? [Principal.fromText(disburseToNeuron.newController)]
          : [],
        nonce: disburseToNeuron.nonce,
      },
    };
  }
  if ("SetFollowing" in command) {
    const { topicFollowing } = command.SetFollowing;
    return {
      SetFollowing: {
        topic_following: topicFollowing.length
          ? toNullable(
              topicFollowing.map(({ topic, followees }) => ({
                topic: toNullable(topic),
                followees: toNullable(followees.map(fromNeuronId)),
              })),
            )
          : [],
      },
    };
  }
  if ("MergeMaturity" in command) {
    const mergeMaturity = command.MergeMaturity;
    return {
      MergeMaturity: {
        percentage_to_merge: mergeMaturity.percentageToMerge,
      },
    };
  }
  if ("StakeMaturity" in command) {
    const { percentageToStake } = command.StakeMaturity;
    return {
      StakeMaturity: {
        percentage_to_stake: toNullable(percentageToStake),
      },
    };
  }
  if ("MakeProposal" in command) {
    const makeProposal = command.MakeProposal;
    return {
      MakeProposal: {
        url: makeProposal.url,
        title: [],
        action: makeProposal.action ? [fromAction(makeProposal.action)] : [],
        summary: makeProposal.summary,
      },
    };
  }
  if ("Disburse" in command) {
    const disburse = command.Disburse;
    return {
      Disburse: {
        to_account: disburse.toAccountId
          ? [fromAccountIdentifier(disburse.toAccountId)]
          : [],
        amount: disburse.amount ? [fromAmount(disburse.amount)] : [],
      },
    };
  }
  if ("Spawn" in command) {
    const spawn = command.Spawn;
    return {
      Spawn: {
        percentage_to_spawn:
          spawn.percentageToSpawn === undefined
            ? []
            : [spawn.percentageToSpawn],
        new_controller: spawn.newController
          ? [Principal.fromText(spawn.newController)]
          : [],
        nonce: [],
      },
    };
  }
  if ("Merge" in command) {
    const merge = command.Merge;
    return {
      Merge: {
        source_neuron_id: merge.sourceNeuronId
          ? [{ id: merge.sourceNeuronId }]
          : [],
      },
    };
  }

  // If there's a missing command above, this line will cause a compiler error.
  throw new UnsupportedValueError(command);
};

const fromOperation = (operation: Operation): RawOperation => {
  if ("RemoveHotKey" in operation) {
    const removeHotKey = operation.RemoveHotKey;
    return {
      RemoveHotKey: {
        hot_key_to_remove:
          removeHotKey.hotKeyToRemove != null
            ? [Principal.fromText(removeHotKey.hotKeyToRemove)]
            : [],
      },
    };
  }
  if ("AddHotKey" in operation) {
    const addHotKey = operation.AddHotKey;
    return {
      AddHotKey: {
        new_hot_key: addHotKey.newHotKey
          ? [Principal.fromText(addHotKey.newHotKey)]
          : [],
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
        additional_dissolve_delay_seconds:
          increaseDissolveDelay.additionalDissolveDelaySeconds,
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
        dissolve_timestamp_seconds:
          setDissolveTimestamp.dissolveTimestampSeconds,
      },
    };
  }
  if ("ChangeAutoStakeMaturity" in operation) {
    const { requestedSettingForAutoStakeMaturity } =
      operation.ChangeAutoStakeMaturity;
    return {
      ChangeAutoStakeMaturity: {
        requested_setting_for_auto_stake_maturity:
          requestedSettingForAutoStakeMaturity,
      },
    };
  }
  if ("SetVisibility" in operation) {
    const setVisibility = operation.SetVisibility;
    return {
      SetVisibility: {
        visibility: toNullable(setVisibility.visibility),
      },
    };
  }
  // If there's a missing operation above, this line will cause a compiler error.
  throw new UnsupportedValueError(operation);
};

const fromAccount = (account: Account): RawAccount => ({
  owner: toNullable(account.owner),
  subaccount: nonNullish(account.subaccount)
    ? [arrayOfNumberToUint8Array(account.subaccount)]
    : [],
});

const fromChange = (change: Change): RawChange => {
  if ("ToRemove" in change) {
    return {
      ToRemove: fromNodeProvider(change.ToRemove),
    };
  }
  if ("ToAdd" in change) {
    return {
      ToAdd: fromNodeProvider(change.ToAdd),
    };
  }
  // If there's a missing change above, this line will cause a compiler error.
  throw new UnsupportedValueError(change);
};

const fromNodeProvider = (nodeProvider: NodeProvider): RawNodeProvider => ({
  id: nodeProvider.id != null ? [Principal.fromText(nodeProvider.id)] : [],
  reward_account:
    nodeProvider.rewardAccount != null
      ? [fromAccountIdentifier(nodeProvider.rewardAccount)]
      : [],
});

const fromAmount = (amount: E8s): Amount => ({
  e8s: amount,
});

export const fromAccountIdentifier = (
  accountIdentifier: AccountIdentifierHex,
): RawAccountIdentifier => ({
  hash: accountIdentifierToBytes(accountIdentifier),
});

const fromNeuronsFundEconomics = (
  neuronsFundEconomics: Option<NeuronsFundEconomics>,
): Nullable<RawNeuronsFundEconomics> => {
  if (isNullish(neuronsFundEconomics)) {
    return [];
  }

  const {
    maximumIcpXdrRate,
    maxTheoreticalNeuronsFundParticipationAmountXdr,
    neuronsFundMatchedFundingCurveCoefficients,
    minimumIcpXdrRate,
  } = neuronsFundEconomics;

  const toRawPercentage = (
    percentage: Option<Percentage>,
  ): Nullable<RawPercentage> =>
    isNullish(percentage)
      ? []
      : [
          {
            basis_points: toNullable(percentage.basisPoints),
          },
        ];

  const toRawDecimals = (decimal: Option<Decimal>): Nullable<RawDecimal> =>
    isNullish(decimal)
      ? []
      : [
          {
            human_readable: toNullable(decimal.humanReadable),
          },
        ];

  const toRawNeuronsFundMatchedFundingCurveCoefficients = (
    neuronsFundMatchedFundingCurveCoefficients: Option<NeuronsFundMatchedFundingCurveCoefficients>,
  ): Nullable<RawNeuronsFundMatchedFundingCurveCoefficients> =>
    isNullish(neuronsFundMatchedFundingCurveCoefficients)
      ? []
      : [
          {
            contribution_threshold_xdr: toRawDecimals(
              neuronsFundMatchedFundingCurveCoefficients.contributionThresholdXdr,
            ),
            full_participation_milestone_xdr: toRawDecimals(
              neuronsFundMatchedFundingCurveCoefficients.fullParticipationMilestoneXdr,
            ),
            one_third_participation_milestone_xdr: toRawDecimals(
              neuronsFundMatchedFundingCurveCoefficients.oneThirdParticipationMilestoneXdr,
            ),
          },
        ];

  return [
    {
      maximum_icp_xdr_rate: toRawPercentage(maximumIcpXdrRate),
      neurons_fund_matched_funding_curve_coefficients:
        toRawNeuronsFundMatchedFundingCurveCoefficients(
          neuronsFundMatchedFundingCurveCoefficients,
        ),
      minimum_icp_xdr_rate: toRawPercentage(minimumIcpXdrRate),
      max_theoretical_neurons_fund_participation_amount_xdr: toRawDecimals(
        maxTheoreticalNeuronsFundParticipationAmountXdr,
      ),
    },
  ];
};

const fromVotingPowerEconomics = (
  votingPowerEconomics: Option<VotingPowerEconomics>,
): Nullable<RawVotingPowerEconomics> => {
  if (isNullish(votingPowerEconomics)) {
    return [];
  }
  return [
    {
      start_reducing_voting_power_after_seconds: toNullable(
        votingPowerEconomics.startReducingVotingPowerAfterSeconds,
      ),
      neuron_minimum_dissolve_delay_to_vote_seconds: toNullable(
        votingPowerEconomics.neuronMinimumDissolveDelayToVoteSeconds,
      ),
      clear_following_after_seconds: toNullable(
        votingPowerEconomics.clearFollowingAfterSeconds,
      ),
    },
  ];
};

const fromRewardMode = (rewardMode: RewardMode): RawRewardMode => {
  if ("RewardToNeuron" in rewardMode) {
    return {
      RewardToNeuron: {
        dissolve_delay_seconds: rewardMode.RewardToNeuron.dissolveDelaySeconds,
      },
    };
  }
  if ("RewardToAccount" in rewardMode) {
    return {
      RewardToAccount: {
        to_account:
          rewardMode.RewardToAccount.toAccount != null
            ? [fromAccountIdentifier(rewardMode.RewardToAccount.toAccount)]
            : [],
      },
    };
  }
  // If there's a missing rewardMode above, this line will cause a compiler error.
  throw new UnsupportedValueError(rewardMode);
};

const fromClaimOrRefreshBy = (by: By): RawBy => {
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
        controller: by.MemoAndController.controller
          ? [by.MemoAndController.controller]
          : [],
      },
    };
  }
  // Ensures all cases are covered at compile-time.
  throw new UnsupportedValueError(by);
};

export const fromListNeurons = ({
  neuronIds,
  includeEmptyNeurons,
  includePublicNeurons,
  neuronSubaccounts,
  pageNumber,
  pageSize,
}: {
  neuronIds?: NeuronId[];
  includeEmptyNeurons?: boolean;
  includePublicNeurons?: boolean;
  neuronSubaccounts?: NeuronSubaccount[];
  pageNumber?: bigint;
  pageSize?: bigint;
}): RawListNeurons => ({
  neuron_ids: BigUint64Array.from(neuronIds ?? []),
  include_neurons_readable_by_caller: neuronIds ? false : true,
  include_empty_neurons_readable_by_caller: toNullable(includeEmptyNeurons),
  include_public_neurons_in_full_neurons: toNullable(includePublicNeurons),
  neuron_subaccounts: toNullable(neuronSubaccounts),
  page_number: toNullable(pageNumber),
  page_size: toNullable(pageSize),
});

export const fromManageNeuron = ({
  id,
  command,
  neuronIdOrSubaccount,
}: ManageNeuronRequest): RawManageNeuron => ({
  id: id ? [fromNeuronId(id)] : [],
  command: command ? [fromCommand(command)] : [],
  neuron_id_or_subaccount: neuronIdOrSubaccount
    ? [fromNeuronIdOrSubaccount(neuronIdOrSubaccount)]
    : [],
});

export const fromListProposalsRequest = ({
  includeRewardStatus,
  beforeProposal,
  excludeTopic,
  includeStatus,
  limit,
  includeAllManageNeuronProposals,
  omitLargeFields,
  returnSelfDescribingAction,
}: ListProposalsRequest): RawListProposalInfo => ({
  include_reward_status: Int32Array.from(includeRewardStatus),
  before_proposal: beforeProposal ? [fromProposalId(beforeProposal)] : [],
  limit,
  exclude_topic: Int32Array.from(excludeTopic),
  include_all_manage_neuron_proposals:
    includeAllManageNeuronProposals !== undefined
      ? [includeAllManageNeuronProposals]
      : [],
  include_status: Int32Array.from(includeStatus),
  omit_large_fields: toNullable(omitLargeFields),
  return_self_describing_action: toNullable(returnSelfDescribingAction),
});

/* Protobuf is not supported yet
export const fromAddHotKeyRequest = (request: AddHotKeyRequest): PbManageNeuron => {
  const hotkeyPrincipal = new PbPrincipalId();
  hotkeyPrincipal.setSerializedId(
    Principal.fromText(request.principal).toUint8Array()
  );

  const hotkey = new PbManageNeuron.AddHotKey();
  hotkey.setNewHotKey(hotkeyPrincipal);

  const configure = new PbManageNeuron.Configure();
  configure.setAddHotKey(hotkey);

  const result = new PbManageNeuron();
  result.setConfigure(configure);
  const neuronId = new PbNeuronId();
  neuronId.setId(request.neuronId.toString());
  result.setNeuronId(neuronId);

  return result;
};
*/

export const fromClaimOrRefreshNeuronRequest = (
  request: ClaimOrRefreshNeuronRequest,
): RawManageNeuron => {
  const rawCommand: RawCommand = {
    ClaimOrRefresh: { by: [{ NeuronIdOrSubaccount: {} }] },
  };

  return {
    id: [],
    command: [rawCommand],
    neuron_id_or_subaccount: [{ NeuronId: { id: request.neuronId } }],
  };
};

export const toClaimOrRefreshRequest = ({
  memo,
  controller,
}: {
  memo: bigint;
  controller?: Principal;
}): RawManageNeuron => {
  const rawCommand: RawCommand = {
    ClaimOrRefresh: {
      by: [
        {
          MemoAndController: {
            controller: controller == undefined ? [] : [controller],
            memo,
          },
        },
      ],
    },
  };

  return {
    id: [],
    command: [rawCommand],
    neuron_id_or_subaccount: [],
  };
};

/* Protobuf is not supported yet
export const fromMergeMaturityRequest = (
  request: MergeMaturityRequest
): PbManageNeuron => {
  const mergeMaturity = new PbManageNeuron.MergeMaturity();
  mergeMaturity.setPercentageToMerge(request.percentageToMerge);
  const manageNeuron = new PbManageNeuron();
  const neuronId = new PbNeuronId();
  neuronId.setId(request.neuronId.toString());
  manageNeuron.setNeuronId(neuronId);
  manageNeuron.setMergeMaturity(mergeMaturity);
  return manageNeuron;
};
*/

/* Protobuf is not supported yet
export const fromRemoveHotKeyRequest = (
  request: RemoveHotKeyRequest
): PbManageNeuron => {
  const hotkeyPrincipal = new PbPrincipalId();
  hotkeyPrincipal.setSerializedId(
    Principal.fromText(request.principal).toUint8Array()
  );

  const command = new PbManageNeuron.RemoveHotKey();
  command.setHotKeyToRemove(hotkeyPrincipal);

  const configure = new PbManageNeuron.Configure();
  configure.setRemoveHotKey(command);

  const result = new PbManageNeuron();
  result.setConfigure(configure);

  const neuronId = new PbNeuronId();
  neuronId.setId(request.neuronId.toString());
  result.setNeuronId(neuronId);

  return result;
};

export const fromStartDissolvingRequest = (
  request: StartDissolvingRequest
): PbManageNeuron => {
  const configure = new PbManageNeuron.Configure();
  configure.setStartDissolving(new PbManageNeuron.StartDissolving());

  const result = new PbManageNeuron();
  result.setConfigure(configure);

  const neuronId = new PbNeuronId();
  neuronId.setId(request.neuronId.toString());
  result.setNeuronId(neuronId);

  return result;
};

export const fromStopDissolvingRequest = (
  request: StopDissolvingRequest
): PbManageNeuron => {
  const configure = new PbManageNeuron.Configure();
  configure.setStopDissolving(new PbManageNeuron.StopDissolving());

  const result = new PbManageNeuron();
  result.setConfigure(configure);

  const neuronId = new PbNeuronId();
  neuronId.setId(request.neuronId.toString());
  result.setNeuronId(neuronId);

  return result;
};

export const fromIncreaseDissolveDelayRequest = (
  request: IncreaseDissolveDelayRequest
): PbManageNeuron => {
  const command = new PbManageNeuron.IncreaseDissolveDelay();
  command.setAdditionalDissolveDelaySeconds(
    request.additionalDissolveDelaySeconds
  );

  const configure = new PbManageNeuron.Configure();
  configure.setIncreaseDissolveDelay(command);

  const result = new PbManageNeuron();
  result.setConfigure(configure);

  const neuronId = new PbNeuronId();
  neuronId.setId(request.neuronId.toString());
  result.setNeuronId(neuronId);

  return result;
};

export const fromFollowRequest = (request: FollowRequest): PbManageNeuron => {
  const follow = new PbManageNeuron.Follow();
  follow.setTopic(request.topic);
  follow.setFolloweesList(
    request.followees.map((followee) => {
      const neuronId = new PbNeuronId();
      neuronId.setId(followee.toString());
      return neuronId;
    })
  );
  const manageNeuron = new PbManageNeuron();
  const neuronId = new PbNeuronId();
  neuronId.setId(request.neuronId.toString());
  manageNeuron.setNeuronId(neuronId);
  manageNeuron.setFollow(follow);
  return manageNeuron;
};

export const fromRegisterVoteRequest = (
  request: RegisterVoteRequest
): PbManageNeuron => {
  const registerVote = new PbManageNeuron.RegisterVote();
  registerVote.setVote(request.vote);
  const proposal = new PbProposalId();
  proposal.setId(request.proposal.toString());
  registerVote.setProposal(proposal);
  const manageNeuron = new PbManageNeuron();
  const neuronId = new PbNeuronId();
  neuronId.setId(request.neuronId.toString());
  manageNeuron.setNeuronId(neuronId);
  manageNeuron.setRegisterVote(registerVote);
  return manageNeuron;
};

export const fromSpawnRequest = (request: SpawnRequest): PbManageNeuron => {
  const spawn = new PbManageNeuron.Spawn();

  if (request.newController) {
    const newController = new PbPrincipalId();
    newController.setSerializedId(
      Principal.fromText(request.newController).toUint8Array().slice(4)
    );
    spawn.setNewController(newController);
  }

  const manageNeuron = new PbManageNeuron();
  manageNeuron.setSpawn(spawn);

  const neuronId = new PbNeuronId();
  neuronId.setId(request.neuronId.toString());
  manageNeuron.setNeuronId(neuronId);
  return manageNeuron;
};
*/

export const toSplitRawRequest = ({
  neuronId,
  amount,
  memo,
}: {
  neuronId: NeuronId;
  amount: E8s;
  memo?: bigint;
}): RawManageNeuron => {
  const rawCommand: RawCommand = {
    Split: {
      amount_e8s: amount,
      memo: toNullable(memo),
    },
  };

  return {
    id: [],
    command: [rawCommand],
    neuron_id_or_subaccount: [{ NeuronId: { id: neuronId } }],
  };
};

/* Protobuf is not supported yet
export const fromDisburseRequest = (request: DisburseRequest): PbManageNeuron => {
  const disburse = new PbManageNeuron.Disburse();

  if (request.toAccountId) {
    const toAccountIdentifier = new PbAccountIdentifier();
    toAccountIdentifier.setHash(
      uint8ArrayToHexString(request.toAccountId)
    );
    disburse.setToAccount(toAccountIdentifier);
  }

  if (request.amount != null) {
    const amount = new PbManageNeuron.Disburse.Amount();
    amount.setE8s(request.amount.toString());
    disburse.setAmount(amount);
  }

  const manageNeuron = new PbManageNeuron();
  manageNeuron.setDisburse(disburse);

  const neuronId = new PbNeuronId();
  neuronId.setId(request.neuronId.toString());
  manageNeuron.setNeuronId(neuronId);
  return manageNeuron;
};
*/

export const fromDisburseToNeuronRequest = (
  request: DisburseToNeuronRequest,
): RawManageNeuron => {
  const rawCommand: RawCommand = {
    DisburseToNeuron: {
      dissolve_delay_seconds: request.dissolveDelaySeconds,
      kyc_verified: request.kycVerified,
      amount_e8s: request.amount,
      new_controller:
        request.newController != null
          ? [Principal.fromText(request.newController)]
          : [],
      nonce: request.nonce,
    },
  };

  return {
    id: [],
    command: [rawCommand],
    neuron_id_or_subaccount: [{ NeuronId: { id: request.neuronId } }],
  };
};

export const fromMakeProposalRequest = (
  request: MakeProposalRequest,
): RawManageNeuron => {
  const rawCommand: RawCommand = {
    MakeProposal: {
      url: request.url,
      title: request.title != null ? [request.title] : [],
      summary: request.summary,
      action: [fromAction(request.action)],
    },
  };

  return {
    id: [],
    command: [rawCommand],
    neuron_id_or_subaccount: [{ NeuronId: { id: request.neuronId } }],
  };
};

export const toRegisterVoteRequest = ({
  neuronId,
  vote,
  proposalId,
}: {
  neuronId: NeuronId;
  vote: Vote;
  proposalId: ProposalId;
}): RawManageNeuron =>
  toCommand({
    neuronId,
    command: {
      RegisterVote: {
        vote,
        proposal: [{ id: proposalId }],
      },
    },
  });

export const toMakeProposalRawRequest = (
  request: MakeProposalRequest,
): RawManageNeuron => {
  const rawCommand: RawCommand = {
    MakeProposal: {
      url: request.url,
      title: request.title != null ? [request.title] : [],
      summary: request.summary,
      action: [fromAction(request.action)],
    },
  };
  return {
    id: [],
    command: [rawCommand],
    neuron_id_or_subaccount: [{ NeuronId: { id: request.neuronId } }],
  };
};

export const toManageNeuronsFollowRequest = ({
  neuronId,
  topic,
  followees,
}: FollowRequest): RawManageNeuron =>
  toCommand({
    neuronId,
    command: {
      Follow: {
        topic,
        followees: followees.map((followeeId) => ({ id: followeeId })),
      },
    },
  });

export const toDisburseNeuronRequest = ({
  neuronId,
  toAccountIdentifier,
  amount,
}: {
  neuronId: NeuronId;
  toAccountIdentifier?: AccountIdentifierClass;
  amount?: E8s;
}): RawManageNeuron =>
  toCommand({
    neuronId,
    command: {
      Disburse: {
        to_account:
          toAccountIdentifier !== undefined
            ? [toAccountIdentifier.toAccountIdentifierHash()]
            : [],
        amount: amount !== undefined ? [fromAmount(amount)] : [],
      },
    },
  });

export const toDisburseMaturityRequest = ({
  neuronId,
  percentageToDisburse,
  toAccountIdentifier,
  toAccount,
}: {
  neuronId: NeuronId;
  percentageToDisburse: number;
  toAccountIdentifier?: AccountIdentifierHex;
  toAccount?: Account;
}): RawManageNeuron =>
  toCommand({
    neuronId,
    command: {
      DisburseMaturity: {
        percentage_to_disburse: percentageToDisburse,
        to_account: nonNullish(toAccount) ? [fromAccount(toAccount)] : [],
        to_account_identifier: nonNullish(toAccountIdentifier)
          ? [fromAccountIdentifier(toAccountIdentifier)]
          : [],
      },
    },
  });

export const toSetFollowingRequest = ({
  neuronId,
  topicFollowing,
}: {
  neuronId: NeuronId;
  topicFollowing: Array<FolloweesForTopic>;
}): RawManageNeuron =>
  toCommand({
    neuronId,
    command: {
      SetFollowing: {
        topic_following: topicFollowing.length
          ? toNullable(
              topicFollowing.map(({ topic, followees }) => ({
                topic: toNullable(topic),
                followees: toNullable(followees.map(fromNeuronId)),
              })),
            )
          : [],
      },
    },
  });

export const toRefreshVotingPowerRequest = ({
  neuronId,
}: {
  neuronId: NeuronId;
}): RawManageNeuron =>
  toCommand({
    neuronId,
    command: {
      RefreshVotingPower: {
        // Intentionally left blank.
      },
    },
  });

export const toMergeMaturityRequest = ({
  neuronId,
  percentageToMerge,
}: {
  neuronId: NeuronId;
  percentageToMerge: number;
}): RawManageNeuron =>
  toCommand({
    neuronId,
    command: {
      MergeMaturity: {
        percentage_to_merge: percentageToMerge,
      },
    },
  });

export const toStakeMaturityRequest = ({
  neuronId,
  percentageToStake,
}: {
  neuronId: NeuronId;
  percentageToStake?: number;
}): RawManageNeuron =>
  toCommand({
    neuronId,
    command: {
      StakeMaturity: {
        percentage_to_stake: toNullable(percentageToStake),
      },
    },
  });

export const toSpawnNeuronRequest = ({
  neuronId,
  percentageToSpawn,
  newController,
  nonce,
}: {
  neuronId: NeuronId;
  percentageToSpawn?: number;
  newController?: Principal;
  nonce?: bigint;
}): RawManageNeuron =>
  toCommand({
    neuronId,
    command: {
      Spawn: {
        percentage_to_spawn:
          percentageToSpawn === undefined ? [] : [percentageToSpawn],
        new_controller: newController === undefined ? [] : [newController],
        nonce: nonce === undefined ? [] : [nonce],
      },
    },
  });

export const toAddHotkeyRequest = ({
  neuronId,
  principal,
}: {
  neuronId: NeuronId;
  principal: Principal;
}): RawManageNeuron =>
  toConfigureOperation({
    neuronId,
    operation: {
      AddHotKey: {
        new_hot_key: [principal],
      },
    },
  });

export const toRemoveHotkeyRequest = ({
  neuronId,
  principal,
}: {
  neuronId: NeuronId;
  principal: Principal;
}): RawManageNeuron =>
  toConfigureOperation({
    neuronId,
    operation: {
      RemoveHotKey: {
        hot_key_to_remove: [principal],
      },
    },
  });

export const toIncreaseDissolveDelayRequest = ({
  neuronId,
  additionalDissolveDelaySeconds,
}: {
  neuronId: NeuronId;
  additionalDissolveDelaySeconds: number;
}): RawManageNeuron =>
  toConfigureOperation({
    neuronId,
    operation: {
      IncreaseDissolveDelay: {
        additional_dissolve_delay_seconds: additionalDissolveDelaySeconds,
      },
    },
  });

export const toSetDissolveDelayRequest = ({
  neuronId,
  dissolveDelaySeconds,
}: {
  neuronId: NeuronId;
  dissolveDelaySeconds: number;
}): RawManageNeuron =>
  toConfigureOperation({
    neuronId,
    operation: {
      SetDissolveTimestamp: {
        dissolve_timestamp_seconds: BigInt(dissolveDelaySeconds),
      },
    },
  });

export const toJoinCommunityFundRequest = (
  neuronId: NeuronId,
): RawManageNeuron =>
  toConfigureOperation({
    neuronId,
    operation: {
      JoinCommunityFund: {},
    },
  });

export const toAutoStakeMaturityRequest = ({
  neuronId,
  autoStake,
}: {
  neuronId: NeuronId;
  autoStake: boolean;
}): RawManageNeuron =>
  toConfigureOperation({
    neuronId,
    operation: {
      ChangeAutoStakeMaturity: {
        requested_setting_for_auto_stake_maturity: autoStake,
      },
    },
  });

export const toLeaveCommunityFundRequest = (
  neuronId: NeuronId,
): RawManageNeuron =>
  toConfigureOperation({
    neuronId,
    operation: {
      LeaveCommunityFund: {},
    },
  });

export const toSetVisibilityRequest = ({
  neuronId,
  visibility,
}: {
  neuronId: NeuronId;
  visibility: NeuronVisibility;
}): RawManageNeuron =>
  toConfigureOperation({
    neuronId,
    operation: {
      SetVisibility: {
        visibility: [visibility as number],
      },
    },
  });

export const toMergeRequest = ({
  sourceNeuronId,
  targetNeuronId,
}: {
  sourceNeuronId: NeuronId;
  targetNeuronId: NeuronId;
}): RawManageNeuron =>
  toCommand({
    neuronId: targetNeuronId,
    command: {
      Merge: { source_neuron_id: [{ id: sourceNeuronId }] },
    },
  });

export const toStartDissolvingRequest = (neuronId: NeuronId): RawManageNeuron =>
  toConfigureOperation({
    neuronId,
    operation: {
      StartDissolving: {},
    },
  });

export const toStopDissolvingRequest = (neuronId: NeuronId): RawManageNeuron =>
  toConfigureOperation({
    neuronId,
    operation: {
      StopDissolving: {},
    },
  });

export const toCommand = ({
  neuronId,
  command,
}: {
  neuronId: NeuronId;
  command: RawCommand;
}): RawManageNeuron => ({
  id: [{ id: neuronId }],
  command: [command],
  neuron_id_or_subaccount: [],
});

export const toConfigureOperation = ({
  neuronId,
  operation,
}: {
  neuronId: NeuronId;
  operation: RawOperation;
}): RawManageNeuron =>
  toCommand({
    neuronId,
    command: {
      Configure: {
        operation: [operation],
      },
    },
  });
