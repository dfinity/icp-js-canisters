import {
  assertPercentageNumber,
  createServices,
  fromNullable,
  isNullish,
  nonNullish,
  uint8ArrayToBigInt,
  type Nullable,
} from "@dfinity/utils";
import { Actor, type ActorSubclass, type Agent } from "@icp-sdk/core/agent";
import type { Principal } from "@icp-sdk/core/principal";
import {
  idlFactoryCertifiedNnsGovernance,
  idlFactoryNnsGovernance,
  type NnsGovernanceDid,
  type NnsGovernanceService,
} from "../declarations";
// This seems rather like a specific workaround that a proper common service therefore it's import points directly to the IDL
import { idlFactory as oldListNeuronsCertifiedIdlFactory } from "../declarations/nns/old_list_neurons_service.certified.idl";
import {
  AccountIdentifier,
  checkAccountId,
  type AccountIdentifierHex,
  type IcpLedgerCanister,
} from "../ledger/icp";
import {
  fromClaimOrRefreshNeuronRequest,
  fromListNeurons,
  fromListProposalsRequest,
  toAddHotkeyRequest,
  toAutoStakeMaturityRequest,
  toClaimOrRefreshRequest,
  toDisburseMaturityRequest,
  toDisburseNeuronRequest,
  toIncreaseDissolveDelayRequest,
  toJoinCommunityFundRequest,
  toLeaveCommunityFundRequest,
  toMakeProposalRawRequest,
  toManageNeuronsFollowRequest,
  toMergeMaturityRequest,
  toMergeRequest,
  toRefreshVotingPowerRequest,
  toRegisterVoteRequest,
  toRemoveHotkeyRequest,
  toSetDissolveDelayRequest,
  toSetFollowingRequest,
  toSetVisibilityRequest,
  toSpawnNeuronRequest,
  toSplitRawRequest,
  toStakeMaturityRequest,
  toStartDissolvingRequest,
  toStopDissolvingRequest,
} from "./canisters/governance/request.converters";
import {
  toArrayOfNeuronInfo,
  toListProposalsResponse,
  toMetrics,
  toNetworkEconomics,
  toNeuronInfo,
  toProposalInfo,
} from "./canisters/governance/response.converters";
import {
  getSuccessfulCommandFromResponse,
  manageNeuron,
  simulateManageNeuron,
} from "./canisters/governance/services";
import { MAINNET_GOVERNANCE_CANISTER_ID } from "./constants/canister_ids";
import { E8S_PER_TOKEN } from "./constants/constants";
import type { NeuronVisibility, Vote } from "./enums/governance.enums";
import {
  CouldNotClaimNeuronError,
  GovernanceError,
  InsufficientAmountError,
  UnrecognizedTypeError,
} from "./errors/governance.errors";
import type { E8s, NeuronId } from "./types/common";
import type { GovernanceCanisterOptions } from "./types/governance.options";
import type {
  Account,
  ClaimOrRefreshNeuronRequest,
  FollowRequest,
  FolloweesForTopic,
  GovernanceCachedMetrics,
  KnownNeuron,
  ListProposalsRequest,
  ListProposalsResponse,
  MakeProposalRequest,
  NetworkEconomics,
  NeuronInfo,
  ProposalId,
  ProposalInfo,
} from "./types/governance_converters";
import { memoToNeuronAccountIdentifier } from "./utils/neurons.utils";

export class GovernanceCanister {
  private constructor(
    private readonly canisterId: Principal,
    private readonly service: ActorSubclass<NnsGovernanceService>,
    private readonly certifiedService: ActorSubclass<NnsGovernanceService>,
    private readonly oldListNeuronsCertifiedService: ActorSubclass<NnsGovernanceService>,
    private readonly agent: Agent,
  ) {
    this.canisterId = canisterId;
    this.service = service;
    this.certifiedService = certifiedService;
    this.oldListNeuronsCertifiedService = oldListNeuronsCertifiedService;
    this.agent = agent;
  }

  public static create(options: GovernanceCanisterOptions = {}) {
    const canisterId: Principal =
      options.canisterId ?? MAINNET_GOVERNANCE_CANISTER_ID;

    const { service, certifiedService, agent } =
      createServices<NnsGovernanceService>({
        options: {
          ...options,
          canisterId,
        },
        idlFactory: idlFactoryNnsGovernance,
        certifiedIdlFactory: idlFactoryCertifiedNnsGovernance,
      });

    const oldListNeuronsCertifiedService =
      options.oldListNeuronsServiceOverride ??
      Actor.createActor<NnsGovernanceService>(
        oldListNeuronsCertifiedIdlFactory,
        {
          agent,
          canisterId,
        },
      );

    return new GovernanceCanister(
      canisterId,
      service,
      certifiedService,
      oldListNeuronsCertifiedService,
      agent,
    );
  }

  /**
   * Returns the list of neurons controlled by the caller.
   *
   * If an array of neuron IDs is provided, precisely those neurons will be fetched.
   *
   * If `certified` is true, the request is fetched as an update call, otherwise
   * it is fetched using a query call.
   *
   * The backend treats `includeEmptyNeurons` as false if absent.
   *
   * The response from the canister might be paginated. In this case, all pages will be fetched in parallel and
   * combined into a single return value.
   */
  public listNeurons = async ({
    certified = true,
    neuronIds,
    includeEmptyNeurons,
    includePublicNeurons,
    neuronSubaccounts,
  }: {
    certified: boolean;
    neuronIds?: NeuronId[];
    includeEmptyNeurons?: boolean;
    includePublicNeurons?: boolean;
    neuronSubaccounts?: NnsGovernanceDid.NeuronSubaccount[];
  }): Promise<NeuronInfo[]> => {
    const useOldMethod =
      isNullish(includeEmptyNeurons) &&
      isNullish(includePublicNeurons) &&
      certified;

    if (useOldMethod) {
      return this.fetchNeuronsWithOldMethodAndNoPagination({
        neuronIds,
      });
    }

    // Fetch the first page to get the total number of pages
    const firstPageResult = await this.fetchNeuronsPage({
      certified,
      neuronIds,
      includeEmptyNeurons,
      includePublicNeurons,
      neuronSubaccounts,
      pageNumber: 0n,
    });
    const { neurons: firstPageNeurons, totalPages } = firstPageResult;

    // https://github.com/dfinity/ic/blob/de17b0d718d6f279e9da8cd0f1b5de17036a6102/rs/nns/governance/api/src/ic_nns_governance.pb.v1.rs#L3543
    if (totalPages < 2n) {
      return firstPageNeurons;
    }

    const pagePromises: Promise<{
      neurons: NeuronInfo[];
      totalPages: bigint;
    }>[] = [];
    for (let pageNumber = 1n; pageNumber < totalPages; pageNumber++) {
      pagePromises.push(
        this.fetchNeuronsPage({
          certified,
          neuronIds,
          includeEmptyNeurons,
          includePublicNeurons,
          pageNumber,
          neuronSubaccounts,
        }),
      );
    }

    const pageResults = [firstPageResult, ...(await Promise.all(pagePromises))];
    const allNeurons = pageResults.flatMap(({ neurons }) => neurons);

    return allNeurons;
  };

  // The Ledger app version 2.4.9 does not support
  // include_empty_neurons_readable_by_caller nor include_public_neurons_in_full_neurons,
  // even when the field is absent,
  // so we use the old service (which does not have these fields) if possible,
  // in case the call will be signed by the Ledger device. We only have a
  // certified version of the old service.
  private fetchNeuronsWithOldMethodAndNoPagination = async ({
    neuronIds,
  }: {
    neuronIds?: NeuronId[];
  }): Promise<NeuronInfo[]> => {
    const rawRequest = fromListNeurons({
      neuronIds,
    });

    const service = this.oldListNeuronsCertifiedService;
    const rawResponse = await service.list_neurons(rawRequest);

    return toArrayOfNeuronInfo({
      response: rawResponse,
      canisterId: this.canisterId,
    });
  };

  private fetchNeuronsPage = async ({
    certified,
    neuronIds,
    includeEmptyNeurons,
    includePublicNeurons,
    pageNumber,
    neuronSubaccounts,
  }: {
    certified: boolean;
    neuronIds?: NeuronId[];
    includeEmptyNeurons?: boolean;
    includePublicNeurons?: boolean;
    pageNumber: bigint;
    neuronSubaccounts?: NnsGovernanceDid.NeuronSubaccount[];
  }): Promise<{ neurons: NeuronInfo[]; totalPages: bigint }> => {
    // https://github.com/dfinity/ic/blob/59c4b87a337f1bd52a076c0f3e99acf155b79803/rs/nns/governance/src/governance.rs#L223
    const PAGE_SIZE = 500n;

    const rawRequest = fromListNeurons({
      neuronIds,
      includeEmptyNeurons,
      includePublicNeurons,
      neuronSubaccounts,
      pageNumber,
      pageSize: PAGE_SIZE,
    });

    const service = this.getNnsGovernanceService(certified);
    const rawResponse = await service.list_neurons(rawRequest);
    const neurons = toArrayOfNeuronInfo({
      response: rawResponse,
      canisterId: this.canisterId,
    });

    const totalPages = fromNullable(rawResponse.total_pages_available) ?? 1n;

    return { neurons, totalPages };
  };

  /**
   * Returns the list of neurons who have been approved by the community to
   * appear as the default followee options.
   *
   * If `certified` is true, the request is fetched as an update call, otherwise
   * it is fetched using a query call.
   */
  public listKnownNeurons = async (
    certified = true,
  ): Promise<KnownNeuron[]> => {
    const response =
      await this.getNnsGovernanceService(certified).list_known_neurons();

    return response.known_neurons.map((n) => {
      const knownNeuronData = fromNullable(n.known_neuron_data);

      // Note: We are defaulting id and name to not the same values as the API.
      return {
        id: fromNullable(n.id)?.id ?? BigInt(0),
        name: knownNeuronData?.name ?? "",
        description: fromNullable(knownNeuronData?.description ?? []),
        links: fromNullable(knownNeuronData?.links ?? []),
        committed_topics: fromNullable(knownNeuronData?.committed_topics ?? []),
      };
    });
  };

  /**
   * Returns the latest reward event.
   *
   * If `certified` is true, the request is fetched as an update call, otherwise
   * it's fetched using a query call.
   *
   */
  public getLatestRewardEvent = (
    certified = true,
  ): Promise<NnsGovernanceDid.RewardEvent> =>
    this.getNnsGovernanceService(certified).get_latest_reward_event();

  /**
   * Returns the list of proposals made for the community to vote on,
   * paginated and filtered by the request.
   *
   * If `certified` is true (default), the request is fetched as an update call, otherwise
   * it is fetched using a query call.
   *
   * @param request the options to list the proposals (limit number of results, topics to search for, etc.)
   * @param certified query or update calls
   */
  public listProposals = async ({
    request,
    certified = true,
  }: {
    request: ListProposalsRequest;
    certified?: boolean;
  }): Promise<ListProposalsResponse> => {
    const rawRequest = fromListProposalsRequest(request);
    const rawResponse =
      await this.getNnsGovernanceService(certified).list_proposals(rawRequest);
    return toListProposalsResponse(rawResponse);
  };

  /**
   * @throws {@link InsufficientAmountError}
   * @throws {@link StakeNeuronTransferError}
   * @throws {@link CouldNotClaimNeuronError}
   * @throws {@link TransferError}
   */
  public stakeNeuron = async ({
    stake,
    principal,
    fromSubAccount,
    ledgerCanister,
    createdAt,
    fee,
  }: {
    stake: bigint;
    principal: Principal;
    fromSubAccount?: number[];
    ledgerCanister: IcpLedgerCanister;
    // Used for the TransferRequest parameters.
    // Check the TransferRequest type for more information.
    createdAt?: bigint;
    fee?: E8s;
  }): Promise<NeuronId> => {
    if (stake < E8S_PER_TOKEN) {
      throw new InsufficientAmountError(stake);
    }

    const nonceBytes = crypto.getRandomValues(new Uint8Array(8));
    const nonce = uint8ArrayToBigInt(nonceBytes);
    const accountIdentifier = memoToNeuronAccountIdentifier({
      controller: principal,
      memo: nonce,
      governanceCanisterId: this.canisterId,
    });

    // Send amount to the ledger.
    await ledgerCanister.transfer({
      memo: nonce,
      amount: stake,
      fromSubAccount,
      to: accountIdentifier,
      createdAt,
      fee,
    });

    // Notify the governance of the transaction so that the neuron is created.
    const neuronId: NeuronId | undefined =
      await this.claimOrRefreshNeuronFromAccount({
        controller: principal,
        memo: nonce,
      });

    // Typescript was complaining with `neuronId || new NeuronNotFound()`:
    // "Type 'undefined' is not assignable to type 'bigint | StakeNeuronError | TransferError'"
    // hence the explicit check.
    if (isNullish(neuronId)) {
      throw new CouldNotClaimNeuronError();
    }

    return neuronId;
  };

  /**
   * Increases dissolve delay of a neuron
   *
   * @throws {@link GovernanceError}
   */
  public increaseDissolveDelay = async ({
    neuronId,
    additionalDissolveDelaySeconds,
  }: {
    neuronId: NeuronId;
    additionalDissolveDelaySeconds: number;
  }): Promise<void> => {
    const request = toIncreaseDissolveDelayRequest({
      neuronId,
      additionalDissolveDelaySeconds,
    });

    await manageNeuron({
      request,
      service: this.certifiedService,
    });
  };

  /**
   * Sets dissolve delay of a neuron.
   * The new date is now + dissolveDelaySeconds.
   *
   * @param {NeuronId} neuronId
   * @param {number} dissolveDelaySeconds
   * @throws {@link GovernanceError}
   */
  public setDissolveDelay = async ({
    neuronId,
    dissolveDelaySeconds,
  }: {
    neuronId: NeuronId;
    dissolveDelaySeconds: number;
  }): Promise<void> => {
    const request = toSetDissolveDelayRequest({
      neuronId,
      dissolveDelaySeconds,
    });

    await manageNeuron({
      request,
      service: this.certifiedService,
    });
  };

  /**
   * Start dissolving process of a neuron
   *
   * @throws {@link GovernanceError}
   */
  public startDissolving = async (neuronId: NeuronId): Promise<void> => {
    const request = toStartDissolvingRequest(neuronId);

    await manageNeuron({
      request,
      service: this.certifiedService,
    });
  };

  /**
   * Stop dissolving process of a neuron
   *
   * @throws {@link GovernanceError}
   */
  public stopDissolving = async (neuronId: NeuronId): Promise<void> => {
    const request = toStopDissolvingRequest(neuronId);

    await manageNeuron({
      request,
      service: this.certifiedService,
    });
  };

  /**
   * Neuron joins the community fund
   *
   * @throws {@link GovernanceError}
   */
  public joinCommunityFund = async (neuronId: NeuronId): Promise<void> => {
    const request = toJoinCommunityFundRequest(neuronId);

    await manageNeuron({
      request,
      service: this.certifiedService,
    });
  };

  /**
   * Changes auto-stake maturity for this Neuron. While on, auto-stake maturity will cause all the maturity generated by voting rewards to this neuron to be automatically staked and contribute to the voting power of the neuron.
   *
   * @param {neuronId: NeuronId; autoStake: boolean;} params
   * @param {NeuronId} neuronId The id of the neuron for which to request a change of the auto stake feature
   * @param {number} autoStake `true` to enable the auto-stake maturity for this neuron, `false` to turn it off
   *
   * @throws {@link GovernanceError}
   */
  public autoStakeMaturity = async (params: {
    neuronId: NeuronId;
    autoStake: boolean;
  }): Promise<void> => {
    await manageNeuron({
      request: toAutoStakeMaturityRequest(params),
      service: this.certifiedService,
    });
  };

  /**
   * Neuron leaves the community fund
   *
   * @throws {@link GovernanceError}
   */
  public leaveCommunityFund = async (neuronId: NeuronId): Promise<void> => {
    const request = toLeaveCommunityFundRequest(neuronId);

    await manageNeuron({
      request,
      service: this.certifiedService,
    });
  };

  /**
   * Set visibility of a neuron
   *
   * @throws {@link GovernanceError}
   */
  // eslint-disable-next-line local-rules/prefer-object-params
  public setVisibility = async (
    neuronId: NeuronId,
    visibility: NeuronVisibility,
  ): Promise<void> => {
    const request = toSetVisibilityRequest({ neuronId, visibility });

    await manageNeuron({
      request,
      service: this.certifiedService,
    });
  };

  /**
   * Sets node provider reward account.
   * Where the reward is paid to.
   *
   * @param {string} accountIdentifier
   * @throws {@link GovernanceError}
   * @throws {@link InvalidAccountIDError}
   */
  public setNodeProviderAccount = async (
    accountIdentifier: string,
  ): Promise<void> => {
    // Might throw InvalidAccountIDError
    checkAccountId(accountIdentifier);
    const account = AccountIdentifier.fromHex(accountIdentifier);
    const response = await this.certifiedService.update_node_provider({
      reward_account: [account.toAccountIdentifierHash()],
    });

    if ("Err" in response) {
      throw new GovernanceError(response.Err);
    }
  };

  /**
   * Merge two neurons
   *
   * @throws {@link GovernanceError}
   */
  public mergeNeurons = async (request: {
    sourceNeuronId: NeuronId;
    targetNeuronId: NeuronId;
  }): Promise<void> => {
    const rawRequest = toMergeRequest(request);

    await manageNeuron({
      request: rawRequest,
      service: this.certifiedService,
    });
  };

  /**
   * Simulate merging two neurons
   *
   * @throws {@link GovernanceError}
   */
  public simulateMergeNeurons = async (request: {
    sourceNeuronId: NeuronId;
    targetNeuronId: NeuronId;
  }): Promise<NeuronInfo> => {
    const rawRequest = toMergeRequest(request);

    const command = await simulateManageNeuron({
      request: rawRequest,
      service: this.certifiedService,
    });

    let merge: NnsGovernanceDid.MergeResponse | undefined;
    let neuronInfo: NnsGovernanceDid.NeuronInfo | undefined;
    let rawNeuron: NnsGovernanceDid.Neuron | undefined;
    let neuronId: NeuronId | undefined;

    if (
      "Merge" in command &&
      nonNullish((merge = command.Merge)) &&
      nonNullish((neuronInfo = fromNullable(merge.target_neuron_info))) &&
      nonNullish((rawNeuron = fromNullable(merge.target_neuron))) &&
      nonNullish((neuronId = fromNullable(rawNeuron.id)?.id))
    ) {
      return toNeuronInfo({
        neuronId,
        neuronInfo,
        rawNeuron,
        canisterId: this.canisterId,
      });
    }

    // Edge case
    throw new UnrecognizedTypeError(
      `simulateMergeNeurons: Unrecognized Merge error in ${JSON.stringify(
        command,
      )}`,
    );
  };

  /**
   * Splits a neuron creating a new one
   *
   * @returns newNeuronId
   * @throws {@link GovernanceError}
   */
  public splitNeuron = async ({
    neuronId,
    amount,
    memo,
  }: {
    neuronId: NeuronId;
    amount: bigint;
    memo?: bigint;
  }): Promise<NeuronId> => {
    const request = toSplitRawRequest({
      neuronId,
      amount,
      memo,
    });

    const response = await this.certifiedService.manage_neuron(request);
    const command = getSuccessfulCommandFromResponse(response);

    if ("Split" in command) {
      const neuron = fromNullable(command.Split.created_neuron_id);
      if (isNullish(neuron)) {
        // Edge case
        throw new GovernanceError({
          error_message:
            "Unexpected error splitting neuron. No neuronId in Split response.",
          error_type: 0,
        });
      }
      return neuron.id;
    }

    // Edge case
    throw new UnrecognizedTypeError(
      `Unrecognized Split error in ${JSON.stringify(response)}`,
    );
  };

  /**
   * Returns single proposal info
   *
   * If `certified` is true (default), the request is fetched as an update call, otherwise
   * it is fetched using a query call.
   */
  public getProposal = async ({
    proposalId,
    certified = true,
  }: {
    proposalId: bigint;
    certified?: boolean;
  }): Promise<ProposalInfo | undefined> => {
    const [proposalInfo]: Nullable<NnsGovernanceDid.ProposalInfo> =
      await this.getNnsGovernanceService(certified).get_proposal_info(
        proposalId,
      );
    return proposalInfo ? toProposalInfo(proposalInfo) : undefined;
  };

  /**
   * Create new proposal
   *
   * @returns The newly created proposal ID or undefined if the success response returned by the Governance canister does not provide such information.
   * @throws {@link GovernanceError}
   */
  public makeProposal = async (
    request: MakeProposalRequest,
  ): Promise<NeuronId | undefined> => {
    const rawRequest = toMakeProposalRawRequest(request);

    const cmd = await manageNeuron({
      request: rawRequest,
      service: this.certifiedService,
    });

    return "MakeProposal" in cmd
      ? fromNullable(cmd.MakeProposal.proposal_id)?.id
      : undefined;
  };

  /**
   *
   * Registers vote for a proposal from the neuron passed.
   *
   * @throws {@link GovernanceError}
   */
  public registerVote = async ({
    neuronId,
    vote,
    proposalId,
  }: {
    neuronId: NeuronId;
    vote: Vote;
    proposalId: ProposalId;
  }): Promise<void> => {
    const request = toRegisterVoteRequest({ neuronId, vote, proposalId });

    await manageNeuron({
      request,
      service: this.certifiedService,
    });
  };

  /**
   * Edit neuron followees per topic
   *
   * @throws {@link GovernanceError}
   */
  public setFollowees = async (followRequest: FollowRequest): Promise<void> => {
    const request = toManageNeuronsFollowRequest(followRequest);

    await manageNeuron({
      request,
      service: this.certifiedService,
    });
  };

  /**
   * Disburse neuron on Account
   *
   * @throws {@link GovernanceError}
   * @throws {@link InvalidAccountIDError}
   */
  public disburse = async ({
    neuronId,
    toAccountId,
    amount,
  }: {
    neuronId: NeuronId;
    toAccountId?: string;
    amount?: E8s;
  }): Promise<void> => {
    if (nonNullish(toAccountId)) {
      // Might throw InvalidAccountIDError
      checkAccountId(toAccountId);
    }
    // TODO: Test that the new way also works for disbursements.
    const toAccountIdentifier = nonNullish(toAccountId)
      ? AccountIdentifier.fromHex(toAccountId)
      : undefined;
    const request = toDisburseNeuronRequest({
      neuronId,
      toAccountIdentifier,
      amount,
    });

    await manageNeuron({
      request,
      service: this.certifiedService,
    });
  };

  /**
   * Refreshes voting power of a neuron
   * (Resets the `votingPowerRefreshedTimestampSeconds`
   * parameter of the neuron to the current time).
   *
   * @throws {@link GovernanceError}
   */
  public refreshVotingPower = async ({
    neuronId,
  }: {
    neuronId: NeuronId;
  }): Promise<void> => {
    const request = toRefreshVotingPowerRequest({
      neuronId,
    });

    await manageNeuron({
      request,
      service: this.certifiedService,
    });
  };

  /**
   * Merge Maturity of a neuron
   *
   * @throws {@link GovernanceError}
   * @throws {@link InvalidPercentageError}
   *
   */
  public mergeMaturity = async ({
    neuronId,
    percentageToMerge,
  }: {
    neuronId: NeuronId;
    percentageToMerge: number;
  }): Promise<void> => {
    // Might throw InvalidPercentageError
    assertPercentageNumber(percentageToMerge);

    const request = toMergeMaturityRequest({ neuronId, percentageToMerge });

    await manageNeuron({
      request,
      service: this.certifiedService,
    });
  };

  /**
   * Stake the maturity of a neuron.
   *
   * @param {neuronId: NeuronId; percentageToStake: number;} params
   * @param {NeuronId} neuronId The id of the neuron for which to stake the maturity
   * @param {number} percentageToStake Optional. Percentage of the current maturity to stake. If not provided, all of the neuron's current maturity will be staked.
   *
   * @throws {@link GovernanceError}
   * @throws {@link InvalidPercentageError}
   *
   */
  public stakeMaturity = async ({
    neuronId,
    percentageToStake,
  }: {
    neuronId: NeuronId;
    percentageToStake?: number;
  }): Promise<void> => {
    assertPercentageNumber(percentageToStake ?? 100);

    await manageNeuron({
      request: toStakeMaturityRequest({ neuronId, percentageToStake }),
      service: this.certifiedService,
    });
  };

  /**
   * Merge Maturity of a neuron
   *
   * @throws {@link GovernanceError}
   * @throws {@link InvalidPercentageError}
   *
   */
  public spawnNeuron = async ({
    neuronId,
    percentageToSpawn,
    newController,
    nonce,
  }: {
    neuronId: NeuronId;
    percentageToSpawn?: number;
    newController?: Principal;
    nonce?: bigint;
  }): Promise<bigint> => {
    if (nonNullish(percentageToSpawn)) {
      // Migth throw InvalidPercentageError
      assertPercentageNumber(percentageToSpawn);
    }

    const request = toSpawnNeuronRequest({
      neuronId,
      percentageToSpawn,
      newController,
      nonce,
    });

    const response = await this.certifiedService.manage_neuron(request);
    const command = getSuccessfulCommandFromResponse(response);
    let createdNeuronId: NeuronId | undefined;

    if (
      "Spawn" in command &&
      nonNullish(
        (createdNeuronId = fromNullable(command.Spawn.created_neuron_id)?.id),
      )
    ) {
      return createdNeuronId;
    }

    // Edge case
    throw new UnrecognizedTypeError(
      `Unrecognized Spawn error in ${JSON.stringify(response)}`,
    );
  };

  /**
   * Add hotkey to neuron
   *
   * @throws {@link GovernanceError}
   */
  public addHotkey = async ({
    neuronId,
    principal,
  }: {
    neuronId: NeuronId;
    principal: Principal;
  }): Promise<void> => {
    const request = toAddHotkeyRequest({ neuronId, principal });

    await manageNeuron({
      request,
      service: this.certifiedService,
    });
  };

  /**
   * Remove hotkey to neuron
   *
   * @throws {@link GovernanceError}
   */
  public removeHotkey = async ({
    neuronId,
    principal,
  }: {
    neuronId: NeuronId;
    principal: Principal;
  }): Promise<void> => {
    const request = toRemoveHotkeyRequest({ neuronId, principal });

    await manageNeuron({
      request,
      service: this.certifiedService,
    });
  };

  /**
   * Gets the NeuronID of a newly created neuron.
   */
  public claimOrRefreshNeuronFromAccount = async ({
    memo,
    controller,
  }: {
    memo: bigint;
    controller?: Principal;
  }): Promise<NeuronId | undefined> => {
    const rawRequest = toClaimOrRefreshRequest({
      memo,
      controller,
    });
    const rawResponse = await this.certifiedService.manage_neuron(rawRequest);
    let command: NnsGovernanceDid.Command_1 | undefined;
    if (
      nonNullish((command = fromNullable(rawResponse.command))) &&
      "ClaimOrRefresh" in command
    ) {
      return fromNullable(command.ClaimOrRefresh.refreshed_neuron_id)?.id;
    }

    throw new UnrecognizedTypeError(
      `Unrecognized ClaimOrRefresh error in ${JSON.stringify(rawResponse)}`,
    );
  };

  /**
   * Refreshes neuron and returns neuronId when successful
   * Uses query call only.
   *
   * @throws {@link UnrecognizedTypeError}
   */
  public claimOrRefreshNeuron = async (
    request: ClaimOrRefreshNeuronRequest,
  ): Promise<NeuronId | undefined> => {
    const rawRequest = fromClaimOrRefreshNeuronRequest(request);
    const rawResponse = await this.service.manage_neuron(rawRequest);
    let command: NnsGovernanceDid.Command_1 | undefined;
    if (
      nonNullish((command = fromNullable(rawResponse.command))) &&
      "ClaimOrRefresh" in command
    ) {
      return fromNullable(command.ClaimOrRefresh.refreshed_neuron_id)?.id;
    }

    throw new UnrecognizedTypeError(
      `Unrecognized ClaimOrRefresh error in ${JSON.stringify(rawResponse)}`,
    );
  };

  private getNnsGovernanceService(certified: boolean): NnsGovernanceService {
    return certified ? this.certifiedService : this.service;
  }

  /**
   * Return the data of the neuron provided as id.
   */
  public getNeuron = async ({
    certified = true,
    neuronId,
  }: {
    certified: boolean;
    neuronId: NeuronId;
  }): Promise<NeuronInfo | undefined> => {
    // The governance canister exposes two functions "get_neuron_info" and "get_full_neuron" that could probably be used to fetch the neuron details too.
    // However historically this function has been resolved with a single call "list_neurons".

    const [neuron]: NeuronInfo[] = await this.listNeurons({
      certified,
      neuronIds: [neuronId],
    });

    return neuron;
  };

  /**
   * Return the [Network Economics](https://github.com/dfinity/ic/blob/d90e934eb440c730d44d9d9b1ece2cc3f9505d05/rs/nns/governance/proto/ic_nns_governance/pb/v1/governance.proto#L1847).
   */
  public getNetworkEconomicsParameters = async ({
    certified = true,
  }: {
    certified: boolean;
  }): Promise<NetworkEconomics> => {
    const rawResponse =
      await this.getNnsGovernanceService(
        certified,
      ).get_network_economics_parameters();
    return toNetworkEconomics(rawResponse);
  };

  /**
   * Disburses a neuron's maturity (always certified).
   * Reference: https://github.com/dfinity/ic/blob/ca2be53acf413bb92478ee7694ac0fb92af07030/rs/sns/governance/src/governance.rs#L1614
   *
   * @preconditions
   * - The neuron exists
   * - The caller is authorized to perform this neuron operation (NeuronPermissionType::DisburseMaturity)
   * - The given percentage_to_merge is between 1 and 100 (inclusive)
   * - The neuron's id is not yet in the list of neurons with ongoing operations
   * - The e8s equivalent of the amount of maturity to disburse is more than the transaction fee.
   *
   * @param {Object} params
   * @param {NeuronId} params.neuronId The id of the neuron for which to disburse maturity
   * @param {number} params.percentageToDisburse The percentage of the neuron's maturity to disburse, between 1 and 100 (inclusive).
   * @param {AccountIdentifierHex} [params.toAccountIdentifier] Optional. The account identifier to which the maturity will be disbursed. If not provided, the maturity will be disbursed to the caller's Main account.
   * @param {Account} [params.toAccount] Optional. The ICRC account to which the maturity will be disbursed. If not provided, the maturity will be disbursed to the caller's Main account.
   */
  public disburseMaturity = async ({
    neuronId,
    percentageToDisburse,
    toAccountIdentifier,
    toAccount,
  }: {
    neuronId: NeuronId;
    percentageToDisburse: number;
    toAccountIdentifier?: AccountIdentifierHex;
    toAccount?: Account;
  }): Promise<void> => {
    const request = toDisburseMaturityRequest({
      neuronId,
      percentageToDisburse,
      toAccountIdentifier,
      toAccount,
    });

    await manageNeuron({
      request,
      service: this.certifiedService,
    });
  };

  /**
   * Set the following topics for a neuron.
   *
   * @param {Object} params
   * @param {NeuronId} params.neuronId The id of the neuron for which to set the following topics
   * @param {Array<FolloweesForTopic>} params.topicFollowing The topics and the followees for each topic that the neuron should follow.
   */
  public setFollowing = async ({
    neuronId,
    topicFollowing,
  }: {
    neuronId: NeuronId;
    topicFollowing: Array<FolloweesForTopic>;
  }): Promise<void> => {
    const request = toSetFollowingRequest({ neuronId, topicFollowing });

    await manageNeuron({
      request,
      service: this.certifiedService,
    });
  };

  public getMetrics = async ({
    certified = true,
  }: {
    certified: boolean;
  }): Promise<GovernanceCachedMetrics> => {
    const response =
      await this.getNnsGovernanceService(certified).get_metrics();
    if ("Err" in response) {
      throw new GovernanceError(response.Err);
    }
    return toMetrics(response.Ok);
  };
}
