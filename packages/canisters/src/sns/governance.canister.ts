import {
  Canister,
  assertPercentageNumber,
  createServices,
  fromNullable,
  toNullable,
  type QueryParams,
} from "@dfinity/utils";
import type { Principal } from "@icp-sdk/core/principal";
import type {
  GetMetadataResponse,
  ListNervousSystemFunctionsResponse,
  ListProposalsResponse,
  ListTopicsResponse,
  ManageNeuron,
  ManageNeuronResponse,
  NervousSystemParameters,
  Neuron,
  NeuronId,
  ProposalData,
  _SERVICE as SnsGovernanceService,
} from "../declarations/sns/governance";
import { idlFactory as certifiedIdlFactory } from "../declarations/sns/governance.certified.idl";
import { idlFactory } from "../declarations/sns/governance.idl";
import { MAX_LIST_NEURONS_RESULTS } from "./constants/governance.constants";
import {
  toAddPermissionsRequest,
  toAutoStakeMaturityNeuronRequest,
  toClaimOrRefreshRequest,
  toDisburseMaturityRequest,
  toDisburseNeuronRequest,
  toFollowRequest,
  toIncreaseDissolveDelayRequest,
  toListProposalRequest,
  toRegisterVoteRequest,
  toRemovePermissionsRequest,
  toSetDissolveTimestampRequest,
  toSetFollowingRequest,
  toSplitNeuronRequest,
  toStakeMaturityRequest,
  toStartDissolvingNeuronRequest,
  toStopDissolvingNeuronRequest,
} from "./converters/governance.converters";
import { SnsGovernanceError } from "./errors/governance.errors";
import type { SnsCanisterOptions } from "./types/canister.options";
import type {
  SnsClaimNeuronParams,
  SnsDisburseNeuronParams,
  SnsGetNeuronParams,
  SnsGetProposalParams,
  SnsIncreaseDissolveDelayParams,
  SnsListNeuronsParams,
  SnsListProposalsParams,
  SnsListTopicsParams,
  SnsNeuronAutoStakeMaturityParams,
  SnsNeuronDisburseMaturityParams,
  SnsNeuronPermissionsParams,
  SnsNeuronStakeMaturityParams,
  SnsRegisterVoteParams,
  SnsSetDissolveTimestampParams,
  SnsSetFollowingParams,
  SnsSetTopicFollowees,
  SnsSplitNeuronParams,
} from "./types/governance.params";

export class SnsGovernanceCanister extends Canister<SnsGovernanceService> {
  /**
   * Instantiate a canister to interact with the governance of a Sns project.
   *
   * @param {SnsCanisterOptions} options Miscellaneous options to initialize the canister. Its ID being the only mandatory parammeter.
   */
  static create(options: SnsCanisterOptions<SnsGovernanceService>) {
    const { service, certifiedService, canisterId } =
      createServices<SnsGovernanceService>({
        options,
        idlFactory,
        certifiedIdlFactory,
      });

    return new SnsGovernanceCanister(canisterId, service, certifiedService);
  }

  /**
   * List the neurons of the Sns
   */
  listNeurons = async (params: SnsListNeuronsParams): Promise<Neuron[]> => {
    const { principal, limit, beforeNeuronId } = params;

    const { neurons } = await this.caller(params).list_neurons({
      of_principal: toNullable<Principal>(principal),
      limit: limit ?? MAX_LIST_NEURONS_RESULTS,
      start_page_at: toNullable<NeuronId>(beforeNeuronId),
    });
    return neurons;
  };

  /**
   * List the proposals of the Sns
   */
  listProposals = async (
    params: SnsListProposalsParams,
  ): Promise<ListProposalsResponse> => {
    const { certified } = params;

    const response = await this.caller({ certified }).list_proposals(
      toListProposalRequest(params),
    );
    return response;
  };

  /**
   *
   * List the topics of the Sns
   */
  listTopics = async (
    params: SnsListTopicsParams,
  ): Promise<ListTopicsResponse> => {
    const { certified } = params;
    const response = await this.caller({ certified }).list_topics({});
    return response;
  };

  /**
   * Get the proposal of the Sns
   */
  getProposal = async (params: SnsGetProposalParams): Promise<ProposalData> => {
    const { proposalId } = params;

    const { result } = await this.caller(params).get_proposal({
      proposal_id: toNullable(proposalId),
    });
    const data = fromNullable(result);
    if (data === undefined || "Error" in data) {
      throw new SnsGovernanceError(
        data?.Error.error_message ?? "Response type not supported",
      );
    }
    return data.Proposal;
  };

  /**
   * List Nervous System Functions
   * Neurons can follow other neurons in specific Nervous System Functions.
   */
  listNervousSystemFunctions = (
    params: QueryParams,
  ): Promise<ListNervousSystemFunctionsResponse> =>
    this.caller(params).list_nervous_system_functions();

  /**
   * Get the Sns metadata (title, description, etc.)
   */
  metadata = (params: QueryParams): Promise<GetMetadataResponse> =>
    this.caller(params).get_metadata({});

  /**
   * Get the Sns nervous system parameters (default followees, max dissolve delay, max number of neurons, etc.)
   */
  nervousSystemParameters = (
    params: QueryParams,
  ): Promise<NervousSystemParameters> =>
    this.caller(params).get_nervous_system_parameters(null);

  /**
   * Get the neuron of the Sns
   */
  getNeuron = async (params: SnsGetNeuronParams): Promise<Neuron> => {
    const { neuronId } = params;

    const { result } = await this.caller(params).get_neuron({
      neuron_id: toNullable(neuronId),
    });
    const data = fromNullable(result);
    if (data === undefined || "Error" in data) {
      throw new SnsGovernanceError(
        data?.Error.error_message ?? "Response type not supported",
      );
    }
    return data.Neuron;
  };

  /**
   * Same as `getNeuron` but returns undefined instead of raising error when not found.
   */
  queryNeuron = async (
    params: SnsGetNeuronParams,
  ): Promise<Neuron | undefined> => {
    try {
      return await this.getNeuron(params);
    } catch (error: unknown) {
      // Source: https://github.com/dfinity/ic/blob/master/rs/sns/governance/src/governance.rs#L914
      if (
        error instanceof Error &&
        error.message.includes("No neuron for given NeuronId")
      ) {
        return undefined;
      }
      throw error;
    }
  };

  /**
   * Manage neuron. For advanced users.
   */
  manageNeuron = async (
    request: ManageNeuron,
  ): Promise<ManageNeuronResponse> => {
    const response = await this.caller({ certified: true }).manage_neuron(
      request,
    );
    this.assertManageNeuronError(response);
    return response;
  };

  /**
   * Add permissions to a neuron for a specific principal
   */
  addNeuronPermissions = async (
    params: SnsNeuronPermissionsParams,
  ): Promise<void> => {
    const request: ManageNeuron = toAddPermissionsRequest(params);
    await this.manageNeuron(request);
  };

  /**
   * Remove permissions to a neuron for a specific principal
   */
  removeNeuronPermissions = async (
    params: SnsNeuronPermissionsParams,
  ): Promise<void> => {
    const request: ManageNeuron = toRemovePermissionsRequest(params);
    await this.manageNeuron(request);
  };

  /**
   * Split neuron
   */
  public splitNeuron = async (
    params: SnsSplitNeuronParams,
  ): Promise<NeuronId | undefined> => {
    const request: ManageNeuron = toSplitNeuronRequest(params);
    const { command } = await this.manageNeuron(request);
    const response = fromNullable(command);
    const errorMessage = (details: string) =>
      `Split neuron failed (${details})`;

    // Validate response
    if (response === undefined) {
      throw new SnsGovernanceError(errorMessage("no response"));
    }

    if ("Split" in response) {
      const split = response.Split;
      const neuronId = fromNullable(split.created_neuron_id) as NeuronId;

      if (neuronId !== undefined) {
        return neuronId;
      }

      throw new SnsGovernanceError(errorMessage("no id"));
    }

    throw new SnsGovernanceError(errorMessage("unknown"));
  };

  /**
   * Disburse neuron on Account
   */
  disburse = async (params: SnsDisburseNeuronParams): Promise<void> => {
    const request: ManageNeuron = toDisburseNeuronRequest(params);
    await this.manageNeuron(request);
  };

  /**
   * Start dissolving process of a neuron
   */
  startDissolving = async (neuronId: NeuronId): Promise<void> => {
    const request: ManageNeuron = toStartDissolvingNeuronRequest(neuronId);
    await this.manageNeuron(request);
  };

  /**
   * Stop dissolving process of a neuron
   */
  stopDissolving = async (neuronId: NeuronId): Promise<void> => {
    const request: ManageNeuron = toStopDissolvingNeuronRequest(neuronId);
    await this.manageNeuron(request);
  };

  /**
   * Stake the maturity of a neuron.
   *
   * @param {neuronId: NeuronId; percentageToStake: number;} params
   * @param {NeuronId} neuronId The id of the neuron for which to stake the maturity
   * @param {number} percentageToStake Optional. Percentage of the current maturity to stake. If not provided, all of the neuron's current maturity will be staked.
   */
  stakeMaturity = async ({
    neuronId,
    percentageToStake,
  }: SnsNeuronStakeMaturityParams): Promise<void> => {
    assertPercentageNumber(percentageToStake ?? 100);

    const request: ManageNeuron = toStakeMaturityRequest({
      neuronId,
      percentageToStake,
    });
    await this.manageNeuron(request);
  };

  /**
   * Disburse the maturity of a neuron.
   *
   * @param {neuronId: NeuronId; toAccount?: IcrcAccount; percentageToDisburse: number; } params
   * @param {IcrcAccount} toAccount. Account to disburse maturity.
   * @param {NeuronId} neuronId The id of the neuron for which to disburse the maturity
   * @param {number} percentageToDisburse What percentage of the available maturity to disburse.
   */
  disburseMaturity = async (
    params: SnsNeuronDisburseMaturityParams,
  ): Promise<void> => {
    assertPercentageNumber(params.percentageToDisburse);

    const request: ManageNeuron = toDisburseMaturityRequest(params);
    await this.manageNeuron(request);
  };

  /**
   * Changes auto-stake maturity for a Neuron.
   *
   * @param {neuronId: NeuronId; autoStake: boolean;} params
   * @param {NeuronId} neuronId The id of the neuron for which to request a change of the auto stake feature
   * @param {number} autoStake `true` to enable the auto-stake maturity for this neuron, `false` to turn it off
   */
  autoStakeMaturity = async (
    params: SnsNeuronAutoStakeMaturityParams,
  ): Promise<void> => {
    const request: ManageNeuron = toAutoStakeMaturityNeuronRequest(params);
    await this.manageNeuron(request);
  };

  /**
   * Increase dissolve delay of a neuron
   */
  setDissolveTimestamp = async (
    params: SnsSetDissolveTimestampParams,
  ): Promise<void> => {
    const request: ManageNeuron = toSetDissolveTimestampRequest(params);
    await this.manageNeuron(request);
  };

  /**
   * Increase dissolve delay of a neuron
   */
  increaseDissolveDelay = async (
    params: SnsIncreaseDissolveDelayParams,
  ): Promise<void> => {
    const request: ManageNeuron = toIncreaseDissolveDelayRequest(params);
    await this.manageNeuron(request);
  };

  /**
   * Sets followees of a neuron for a specific Nervous System Function
   * @deprecated will be replaced by `setFollowing` in the future.
   */
  setTopicFollowees = async (params: SnsSetTopicFollowees): Promise<void> => {
    const request: ManageNeuron = toFollowRequest(params);
    await this.manageNeuron(request);
  };

  /**
   * Sets followees of a neuron for topics
   */
  setFollowing = async (params: SnsSetFollowingParams): Promise<void> => {
    const request: ManageNeuron = toSetFollowingRequest(params);
    await this.manageNeuron(request);
  };

  /**
   * Registers vote for a proposal from the neuron passed.
   */
  registerVote = async (params: SnsRegisterVoteParams): Promise<void> => {
    const request: ManageNeuron = toRegisterVoteRequest(params);
    await this.manageNeuron(request);
  };

  /**
   * Refresh neuron
   */
  refreshNeuron = async (neuronId: NeuronId): Promise<void> => {
    const request: ManageNeuron = toClaimOrRefreshRequest({
      subaccount: neuronId.id,
    });
    await this.manageNeuron(request);
  };

  /**
   * Claim neuron
   */
  claimNeuron = async ({
    memo,
    controller,
    subaccount,
  }: SnsClaimNeuronParams): Promise<NeuronId> => {
    const request: ManageNeuron = toClaimOrRefreshRequest({
      subaccount,
      memo,
      controller,
    });
    const { command } = await this.manageNeuron(request);
    const response = fromNullable(command);
    // Edge case. This should not happen
    if (response === undefined) {
      throw new SnsGovernanceError("Claim neuron failed");
    }
    if ("ClaimOrRefresh" in response) {
      const neuronId = fromNullable(
        response.ClaimOrRefresh.refreshed_neuron_id,
      );
      // This might happen.
      if (neuronId === undefined) {
        throw new SnsGovernanceError("Claim neuron failed");
      }
      return neuronId;
    }
    // Edge case. manage_neuron for ClaimOrRefresh returns only ClaimOrRefresh response.
    throw new SnsGovernanceError("Claim neuron failed");
  };

  /**
   *
   * @param response ManageNeuronResponse
   * @throws SnsGovernanceError
   */
  private assertManageNeuronError = ({
    command,
  }: ManageNeuronResponse): void => {
    // TODO: use upcoming fromDefinedNullable
    const [firstCommand] = command;
    if (firstCommand !== undefined && "Error" in firstCommand) {
      throw new SnsGovernanceError(firstCommand.Error.error_message);
    }
  };
}
