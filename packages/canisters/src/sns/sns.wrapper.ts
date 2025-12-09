import type {
  BalanceParams,
  GetAccountTransactionsParams,
  IcrcAccount,
  IcrcBlockIndex,
  IcrcGetTransactions,
  IcrcIndexCanister,
  IcrcLedgerCanister,
  IcrcTokenMetadataResponse,
  IcrcTokens,
  TransferParams,
} from "@dfinity/ledger-icrc";
import {
  bigIntToUint8Array,
  toNullable,
  type QueryParams,
} from "@dfinity/utils";
import type { Principal } from "@icp-sdk/core/principal";
import type {
  GetMetadataResponse,
  ListNervousSystemFunctionsResponse,
  ListProposalsResponse,
  NervousSystemParameters,
  Neuron,
  NeuronId,
  ProposalData,
} from "../declarations/sns/governance";
import type {
  BuyerState,
  GetAutoFinalizationStatusResponse,
  GetBuyerStateRequest,
  GetDerivedStateResponse,
  GetLifecycleResponse,
  GetSaleParametersResponse,
  GetStateResponse,
  RefreshBuyerTokensRequest,
  RefreshBuyerTokensResponse,
  Ticket,
} from "../declarations/sns/swap";
import { MAX_NEURONS_SUBACCOUNTS } from "./constants/governance.constants";
import { SnsGovernanceError } from "./errors/governance.errors";
import type { SnsGovernanceCanister } from "./governance.canister";
import type { SnsRootCanister } from "./root.canister";
import type { SnsSwapCanister } from "./swap.canister";
import type {
  SnsClaimNeuronParams,
  SnsDisburseNeuronParams,
  SnsGetNeuronParams,
  SnsGetProposalParams,
  SnsIncreaseDissolveDelayParams,
  SnsIncreaseStakeNeuronParams,
  SnsListNeuronsParams,
  SnsListProposalsParams,
  SnsNeuronAutoStakeMaturityParams,
  SnsNeuronDisburseMaturityParams,
  SnsNeuronPermissionsParams,
  SnsNeuronStakeMaturityParams,
  SnsRegisterVoteParams,
  SnsSetDissolveTimestampParams,
  SnsSetFollowingParams,
  SnsSetTopicFollowees,
  SnsSplitNeuronParams,
  SnsStakeNeuronParams,
} from "./types/governance.params";
import type { NewSaleTicketParams } from "./types/swap.params";
import { neuronSubaccount } from "./utils/governance.utils";

interface SnsWrapperOptions {
  /** The wrapper for the "root" canister of the particular Sns */
  root: SnsRootCanister;
  /** The wrapper for the "governance" canister of the particular Sns */
  governance: SnsGovernanceCanister;
  /** The wrapper for the "ledger" canister of the particular Sns */
  ledger: IcrcLedgerCanister;
  /** The wrapper for the "swap" canister of the particular Sns */
  swap: SnsSwapCanister;
  /** The wrapper for the "index" canister of the particular Sns */
  index: IcrcIndexCanister;

  /** The wrapper has been instantiated and should perform query or update calls */
  certified: boolean;
}

/**
 * Sns wrapper - notably used by NNS-dapp - ease the access to a particular Sns.
 * It knows all the Sns' canisters, wrap and enhance their available features.
 * A wrapper either performs query or update calls.
 */
export class SnsWrapper {
  private readonly root: SnsRootCanister;
  private readonly governance: SnsGovernanceCanister;
  private readonly ledger: IcrcLedgerCanister;
  private readonly swap: SnsSwapCanister;
  private readonly index: IcrcIndexCanister;
  private readonly certified: boolean;

  /**
   * Constructor to instantiate a Sns
   */
  constructor({
    root,
    governance,
    ledger,
    swap,
    index,
    certified,
  }: SnsWrapperOptions) {
    this.root = root;
    this.governance = governance;
    this.ledger = ledger;
    this.swap = swap;
    this.index = index;
    this.certified = certified;
  }

  /**
   * Binds the list of canister ids of the Sns.
   */
  get canisterIds(): {
    rootCanisterId: Principal;
    ledgerCanisterId: Principal;
    governanceCanisterId: Principal;
    swapCanisterId: Principal;
    indexCanisterId: Principal;
  } {
    return {
      rootCanisterId: this.root.canisterId,
      ledgerCanisterId: this.ledger.canisterId,
      governanceCanisterId: this.governance.canisterId,
      swapCanisterId: this.swap.canisterId,
      indexCanisterId: this.index.canisterId,
    };
  }

  listNeurons = (
    params: Omit<SnsListNeuronsParams, "certified">,
  ): Promise<Neuron[]> => this.governance.listNeurons(this.mergeParams(params));

  listProposals = (
    params: Omit<SnsListProposalsParams, "certified">,
  ): Promise<ListProposalsResponse> =>
    this.governance.listProposals(this.mergeParams(params));

  getProposal = (
    params: Omit<SnsGetProposalParams, "certified">,
  ): Promise<ProposalData> =>
    this.governance.getProposal(this.mergeParams(params));

  listNervousSystemFunctions = (
    params: Omit<QueryParams, "certified">,
  ): Promise<ListNervousSystemFunctionsResponse> =>
    this.governance.listNervousSystemFunctions(this.mergeParams(params));

  metadata = (
    params: Omit<QueryParams, "certified">,
  ): Promise<[GetMetadataResponse, IcrcTokenMetadataResponse]> =>
    Promise.all([
      this.governance.metadata(this.mergeParams(params)),
      this.ledger.metadata(this.mergeParams(params)),
    ]);

  nervousSystemParameters = (
    params: Omit<QueryParams, "certified">,
  ): Promise<NervousSystemParameters> =>
    this.governance.nervousSystemParameters(this.mergeParams(params));

  ledgerMetadata = (
    params: Omit<QueryParams, "certified">,
  ): Promise<IcrcTokenMetadataResponse> =>
    this.ledger.metadata(this.mergeParams(params));

  transactionFee = (
    params: Omit<QueryParams, "certified">,
  ): Promise<IcrcTokens> =>
    this.ledger.transactionFee(this.mergeParams(params));

  totalTokensSupply = (
    params: Omit<QueryParams, "certified">,
  ): Promise<IcrcTokens> =>
    this.ledger.totalTokensSupply(this.mergeParams(params));

  balance = (params: Omit<BalanceParams, "certified">): Promise<IcrcTokens> =>
    this.ledger.balance(this.mergeParams(params));

  // Always certified
  transfer = (params: TransferParams): Promise<IcrcBlockIndex> =>
    this.ledger.transfer(params);

  getNeuron = (
    params: Omit<SnsGetNeuronParams, "certified">,
  ): Promise<Neuron> => this.governance.getNeuron(this.mergeParams(params));

  queryNeuron = (
    params: Omit<SnsGetNeuronParams, "certified">,
  ): Promise<Neuron | undefined> =>
    this.governance.queryNeuron(this.mergeParams(params));

  /**
   * Returns the subaccount of the next neuron to be created.
   *
   * The neuron account is a subaccount of the governance canister.
   * The subaccount is derived from the controller and an ascending index.
   *
   * ‼️ The id of the neuron is the subaccount (neuron ID = subaccount) ‼️.
   *
   * If the neuron does not exist for that subaccount, then we use it for the next neuron.
   *
   * The index is used in the memo of the transfer and when claiming the neuron.
   * This is how the backend can identify which neuron is being claimed.
   *
   * @param controller
   * @returns
   */
  nextNeuronAccount = async (
    controller: Principal,
  ): Promise<{ account: IcrcAccount; index: bigint }> => {
    // TODO: try parallilizing requests to improve performance
    // OR use binary search https://dfinity.atlassian.net/browse/FOLLOW-825
    for (let index = 0; index < MAX_NEURONS_SUBACCOUNTS; index++) {
      const subaccount = neuronSubaccount({ index, controller });

      const neuronId: NeuronId = { id: subaccount };
      let neuron = await this.governance.queryNeuron({
        neuronId,
        certified: false,
      });
      if (neuron === undefined) {
        // Recheck with update call whether the neuron does not exist
        neuron = await this.governance.queryNeuron({
          neuronId,
          certified: true,
        });
        // If the neuron does not exist, we can use this subaccount
        if (neuron === undefined) {
          return {
            account: {
              ...this.owner,
              subaccount,
            },
            index: BigInt(index),
          };
        }
      }
    }
    throw new SnsGovernanceError("No more neuron accounts available");
  };

  /**
   * Stakes a neuron.
   *
   * This is a convenient method that transfers the stake to the neuron subaccount and then claims the neuron.
   *
   * ⚠️ This feature is provided as it without warranty. It does not implement any additional checks of the validity of the payment flow - e.g. it does not handle refund nor retries claiming the neuron in case of errors.
   *
   * @param {SnsStakeNeuronParams} params
   * @param {Principal} params.controller
   * @param {bigint} params.stakeE8s
   * @param {source} params.source
   * @returns {NeuronId}
   */
  stakeNeuron = async ({
    stakeE8s,
    source,
    controller,
    createdAt,
    fee,
  }: SnsStakeNeuronParams): Promise<NeuronId> => {
    this.assertCertified("stakeNeuron");
    const { account: neuronAccount, index } =
      await this.nextNeuronAccount(controller);
    // This should not happen. The neuron account is always a subaccount of the SNS governance canister.
    if (neuronAccount.subaccount === undefined) {
      throw new SnsGovernanceError(
        "There was an error creating the neuron subaccount",
      );
    }
    await this.ledger.transfer({
      amount: stakeE8s,
      to: {
        owner: neuronAccount.owner,
        subaccount: toNullable(neuronAccount.subaccount),
      },
      from_subaccount: source.subaccount,
      memo: bigIntToUint8Array(index),
      created_at_time: createdAt,
      fee,
    });
    return this.governance.claimNeuron({
      memo: BigInt(index),
      controller,
      subaccount: neuronAccount.subaccount,
    });
  };

  /**
   * Increase the stake of a neuron.
   *
   * This is a convenient method that transfers the stake to the neuron subaccount and then refresh the neuron.
   *
   * ⚠️ This feature is provided as it without warranty. It does not implement any additional checks of the validity of the payment flow - e.g. it does not handle refund nor calls refresh again in case of errors.
   *
   * @param {SnsStakeNeuronParams} params
   * @param {Principal} params.controller
   * @param {bigint} params.stakeE8s
   * @param {source} params.source
   * @returns {NeuronId}
   */
  increaseStakeNeuron = async ({
    stakeE8s,
    source,
    neuronId,
  }: SnsIncreaseStakeNeuronParams): Promise<void> => {
    this.assertCertified("stakeNeuron");

    await this.ledger.transfer({
      amount: stakeE8s,
      to: {
        ...this.owner,
        subaccount: toNullable(Uint8Array.from(neuronId.id)),
      },
      from_subaccount: source.subaccount,
    });

    return this.governance.refreshNeuron(neuronId);
  };

  getNeuronBalance = (neuronId: NeuronId): Promise<IcrcTokens> => {
    const account = {
      ...this.owner,
      subaccount: Uint8Array.from(neuronId.id),
    };
    return this.ledger.balance({ ...account, certified: this.certified });
  };

  // Always certified
  addNeuronPermissions = (params: SnsNeuronPermissionsParams): Promise<void> =>
    this.governance.addNeuronPermissions(params);

  // Always certified
  refreshNeuron = (neuronId: NeuronId): Promise<void> =>
    this.governance.refreshNeuron(neuronId);

  // Always certified
  claimNeuron = (params: SnsClaimNeuronParams): Promise<NeuronId> =>
    this.governance.claimNeuron(params);

  // Always certified
  removeNeuronPermissions = (
    params: SnsNeuronPermissionsParams,
  ): Promise<void> => this.governance.removeNeuronPermissions(params);

  // Always certified
  splitNeuron = (params: SnsSplitNeuronParams): Promise<NeuronId | undefined> =>
    this.governance.splitNeuron(params);

  // Always certified
  disburse = (params: SnsDisburseNeuronParams): Promise<void> =>
    this.governance.disburse(params);

  // Always certified
  startDissolving = (neuronId: NeuronId): Promise<void> =>
    this.governance.startDissolving(neuronId);

  // Always certified
  stopDissolving = (neuronId: NeuronId): Promise<void> =>
    this.governance.stopDissolving(neuronId);

  // Always certified
  setDissolveTimestamp = (
    params: SnsSetDissolveTimestampParams,
  ): Promise<void> => this.governance.setDissolveTimestamp(params);

  // Always certified
  increaseDissolveDelay = (
    params: SnsIncreaseDissolveDelayParams,
  ): Promise<void> => this.governance.increaseDissolveDelay(params);

  // Always certified
  setTopicFollowees = (params: SnsSetTopicFollowees): Promise<void> =>
    this.governance.setTopicFollowees(params);

  // Always certified
  setFollowing = (params: SnsSetFollowingParams): Promise<void> =>
    this.governance.setFollowing(params);

  // Always certified
  registerVote = (params: SnsRegisterVoteParams): Promise<void> =>
    this.governance.registerVote(params);

  swapState = (
    params: Omit<QueryParams, "certified">,
  ): Promise<GetStateResponse> => this.swap.state(this.mergeParams(params));

  /**
   * Returns the ticket if a ticket was found for the caller and the ticket
   * was removed successfully. Returns None if no ticket was found for the caller.
   * Only the owner of a ticket can remove it.
   *
   * Always certified
   *
   * @param params
   */
  notifyPaymentFailure = (): Promise<Ticket | undefined> =>
    this.swap.notifyPaymentFailure();

  // Always certified
  notifyParticipation = (
    params: RefreshBuyerTokensRequest,
  ): Promise<RefreshBuyerTokensResponse> =>
    this.swap.notifyParticipation(params);

  getUserCommitment = (
    params: GetBuyerStateRequest,
  ): Promise<BuyerState | undefined> =>
    this.swap.getUserCommitment(this.mergeParams(params));

  getOpenTicket = (
    params: Omit<QueryParams, "certified">,
  ): Promise<Ticket | undefined> =>
    this.swap.getOpenTicket(this.mergeParams(params));

  // Always certified
  newSaleTicket = (params: NewSaleTicketParams): Promise<Ticket> =>
    this.swap.newSaleTicket(params);

  getLifecycle = (
    params: Omit<QueryParams, "certified">,
  ): Promise<GetLifecycleResponse | undefined> =>
    this.swap.getLifecycle(this.mergeParams(params));

  getFinalizationStatus = (
    params: Omit<QueryParams, "certified">,
  ): Promise<GetAutoFinalizationStatusResponse | undefined> =>
    this.swap.getFinalizationStatus(this.mergeParams(params));

  getSaleParameters = (
    params: Omit<QueryParams, "certified">,
  ): Promise<GetSaleParametersResponse | undefined> =>
    this.swap.getSaleParameters(this.mergeParams(params));

  getDerivedState = (
    params: Omit<QueryParams, "certified">,
  ): Promise<GetDerivedStateResponse | undefined> =>
    this.swap.getDerivedState(this.mergeParams(params));

  // Always certified
  getTransactions = (
    params: GetAccountTransactionsParams,
  ): Promise<IcrcGetTransactions> => this.index.getTransactions(params);

  // Always certified
  stakeMaturity = (params: SnsNeuronStakeMaturityParams): Promise<void> =>
    this.governance.stakeMaturity(params);

  // Always certified
  disburseMaturity = (params: SnsNeuronDisburseMaturityParams): Promise<void> =>
    this.governance.disburseMaturity(params);

  // Always certified
  autoStakeMaturity = (
    params: SnsNeuronAutoStakeMaturityParams,
  ): Promise<void> => this.governance.autoStakeMaturity(params);

  private mergeParams<T>(params: T): QueryParams & T {
    return {
      ...params,
      certified: this.certified,
    };
  }

  private assertCertified = (name: string): void => {
    if (!this.certified) {
      throw new SnsGovernanceError(`Call to ${name} needs to be certified`);
    }
  };

  /**
   * Each Sns neuron id is a subaccount of the related Sns ledger account of the Sns governance canister.
   *
   * In other words, the Sns governance canister is the owner. It has an account in the related Sns ledger and each neuron is both a child of the Sns governance canister and a subaccount in the Sns ledger.
   *
   * @private
   */
  private get owner(): IcrcAccount {
    return {
      owner: this.canisterIds.governanceCanisterId,
    };
  }
}
