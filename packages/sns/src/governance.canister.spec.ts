import {
  arrayOfNumberToUint8Array,
  InvalidPercentageError,
  toNullable,
} from "@dfinity/utils";
import type { ActorSubclass } from "@icp-sdk/core/agent";
import { Principal } from "@icp-sdk/core/principal";
import { mock } from "vitest-mock-extended";
import type {
  ListNervousSystemFunctionsResponse,
  ListProposalsResponse,
  ManageNeuron,
  ManageNeuronResponse,
  NervousSystemFunction,
  NervousSystemParameters,
  NeuronId,
  _SERVICE as SnsGovernanceService,
  Topic,
} from "./candid/sns_governance";
import {
  DEFAULT_PROPOSALS_LIMIT,
  MAX_LIST_NEURONS_RESULTS,
} from "./constants/governance.constants";
import { toCandidAccount } from "./converters/governance.converters";
import {
  SnsNeuronPermissionType,
  SnsProposalDecisionStatus,
  SnsProposalRewardStatus,
  SnsVote,
} from "./enums/governance.enums";
import { SnsGovernanceError } from "./errors/governance.errors";
import { SnsGovernanceCanister } from "./governance.canister";
import {
  metadataMock,
  neuronIdMock,
  neuronMock,
  neuronsMock,
  proposalIdMock,
  proposalMock,
  proposalsMock,
  topicsMock,
} from "./mocks/governance.mock";
import { rootCanisterIdMock } from "./mocks/sns.mock";
import type {
  SnsDisburseNeuronParams,
  SnsNeuronDisburseMaturityParams,
  SnsRegisterVoteParams,
  SnsSplitNeuronParams,
} from "./types/governance.params";

describe("Governance canister", () => {
  const mockErrorCommand: ManageNeuronResponse = {
    command: [{ Error: { error_message: "test", error_type: 2 } }],
  };

  it("should return the list of neurons of the sns", async () => {
    const service = mock<ActorSubclass<SnsGovernanceService>>();
    service.list_neurons.mockResolvedValue({ neurons: neuronsMock });

    const canister = SnsGovernanceCanister.create({
      canisterId: rootCanisterIdMock,
      certifiedServiceOverride: service,
    });
    const res = await canister.listNeurons({});

    expect(res).toEqual(neuronsMock);
  });

  it("should return the list of nervous system functionsof the sns", async () => {
    const service = mock<ActorSubclass<SnsGovernanceService>>();
    const nervousSysttemFunctionMock: NervousSystemFunction = {
      id: BigInt(30),
      name: "Governance",
      description: ["This is a description"],
      function_type: [{ NativeNervousSystemFunction: {} }],
    };
    const nervousSystemFunctionsMock: ListNervousSystemFunctionsResponse = {
      reserved_ids: new BigUint64Array(),
      functions: [nervousSysttemFunctionMock],
    };
    service.list_nervous_system_functions.mockResolvedValue(
      nervousSystemFunctionsMock,
    );

    const canister = SnsGovernanceCanister.create({
      canisterId: rootCanisterIdMock,
      certifiedServiceOverride: service,
    });
    const res = await canister.listNervousSystemFunctions({});

    expect(res).toEqual(nervousSystemFunctionsMock);
  });

  it("should call list of neurons with default param", async () => {
    const service = mock<ActorSubclass<SnsGovernanceService>>();
    const mockListNeurons = service.list_neurons.mockResolvedValue({
      neurons: neuronsMock,
    });

    const canister = SnsGovernanceCanister.create({
      canisterId: rootCanisterIdMock,
      certifiedServiceOverride: service,
    });
    await canister.listNeurons({});

    expect(mockListNeurons).toHaveBeenCalledWith({
      limit: MAX_LIST_NEURONS_RESULTS,
      of_principal: [],
      start_page_at: [],
    });
  });

  describe("listProposals", () => {
    it("should return the list of proposals", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      const mockListProposals = service.list_proposals.mockResolvedValue({
        proposals: proposalsMock,
        include_ballots_by_caller: [],
        include_topic_filtering: [],
      });

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const { proposals: expectedProposals } = await canister.listProposals({});

      expect(mockListProposals).toHaveBeenCalled();
      expect(expectedProposals).toEqual(proposalsMock);
    });

    it('should not break when no "include_ballots_by_caller" parameter provided', async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      const mockListProposals = service.list_proposals.mockResolvedValue({
        proposals: proposalsMock,
      } as ListProposalsResponse);

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const { proposals: expectedProposals } = await canister.listProposals({});

      expect(mockListProposals).toHaveBeenCalled();
      expect(expectedProposals).toEqual(proposalsMock);
    });

    it("should add default limit", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      const mockListProposals = service.list_proposals.mockResolvedValue({
        proposals: proposalsMock,
        include_ballots_by_caller: [],
        include_topic_filtering: [],
      });

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });

      await canister.listProposals({});

      expect(mockListProposals).toHaveBeenCalledWith({
        exclude_type: BigUint64Array.from([]),
        before_proposal: [],
        include_reward_status: Int32Array.from([]),
        include_status: Int32Array.from([]),
        limit: DEFAULT_PROPOSALS_LIMIT,
        include_topics: [[]],
      });
    });

    it("should add convert list of enums", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      const mockListProposals = service.list_proposals.mockResolvedValue({
        proposals: proposalsMock,
        include_ballots_by_caller: [],
        include_topic_filtering: [],
      });

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const params = {
        includeStatus: [
          SnsProposalDecisionStatus.PROPOSAL_DECISION_STATUS_OPEN,
        ],
        excludeType: [BigInt(2)],
        includeRewardStatus: [
          SnsProposalRewardStatus.PROPOSAL_REWARD_STATUS_ACCEPT_VOTES,
        ],
      };
      await canister.listProposals(params);

      expect(mockListProposals).toHaveBeenCalledWith({
        exclude_type: BigUint64Array.from(params.excludeType),
        before_proposal: [],
        include_reward_status: Int32Array.from(params.includeRewardStatus),
        include_status: Int32Array.from(params.includeStatus),
        limit: DEFAULT_PROPOSALS_LIMIT,
        include_topics: [[]],
      });
    });

    it("should use pagination params", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      const mockListProposals = service.list_proposals.mockResolvedValue({
        proposals: proposalsMock,
        include_ballots_by_caller: [],
        include_topic_filtering: [],
      });

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const params = {
        limit: 100,
        beforeProposal: { id: BigInt(2) },
      };
      await canister.listProposals(params);

      expect(mockListProposals).toHaveBeenCalledWith({
        exclude_type: BigUint64Array.from([]),
        before_proposal: [params.beforeProposal],
        include_reward_status: Int32Array.from([]),
        include_status: Int32Array.from([]),
        limit: params.limit,
        include_topics: [[]],
      });
    });

    it("should use include topics params", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      const mockListProposals = service.list_proposals.mockResolvedValue({
        proposals: proposalsMock,
        include_ballots_by_caller: [],
        include_topic_filtering: [true],
      });

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const params = {
        limit: 100,
        beforeProposal: { id: BigInt(2) },
        includeTopics: [
          { DappCanisterManagement: null },
          { SnsFrameworkManagement: null },
          null,
        ],
      };

      await canister.listProposals(params);

      expect(mockListProposals).toHaveBeenCalledWith({
        exclude_type: BigUint64Array.from([]),
        before_proposal: [params.beforeProposal],
        include_reward_status: Int32Array.from([]),
        include_status: Int32Array.from([]),
        limit: params.limit,
        include_topics: [
          [
            { topic: [{ DappCanisterManagement: null }] },
            { topic: [{ SnsFrameworkManagement: null }] },
            { topic: [] },
          ],
        ],
      });
    });

    it("should raise an error if call fails", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.list_proposals.mockRejectedValue(new Error("error"));

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const call = () => canister.listProposals({});

      await expect(call).rejects.toThrowError("error");
    });
  });

  describe("listTopics", () => {
    it("should return the list of topics", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      const mockListProposals = service.list_topics.mockResolvedValue({
        topics: [topicsMock],
        uncategorized_functions: [],
      });

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const { topics: expectedTopics } = await canister.listTopics({});

      expect(mockListProposals).toHaveBeenCalled();
      expect(expectedTopics).toEqual([topicsMock]);
    });
  });

  describe("getProposal", () => {
    it("should return the proposal", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      const mockGetProposal = service.get_proposal.mockResolvedValue({
        result: [{ Proposal: proposalMock }],
      });

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });
      const res = await canister.getProposal({
        proposalId: proposalIdMock,
        certified: true,
      });

      expect(res).toEqual(proposalMock);

      expect(mockGetProposal).toHaveBeenCalledWith({
        proposal_id: [proposalIdMock],
      });
    });

    it("should raise error on governance error", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.get_proposal.mockResolvedValue({
        result: [{ Error: { error_message: "error", error_type: 2 } }],
      });

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });
      const call = () =>
        canister.getProposal({
          proposalId: proposalIdMock,
          certified: true,
        });

      await expect(call).rejects.toThrowError(SnsGovernanceError);
    });
  });

  describe("getNeuron", () => {
    it("should return the neuron", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.get_neuron.mockResolvedValue({
        result: [{ Neuron: neuronMock }],
      });

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });
      const res = await canister.getNeuron({
        neuronId: neuronIdMock,
        certified: true,
      });

      expect(res).toEqual(neuronMock);
    });

    it("should raise error on governance error", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.get_neuron.mockResolvedValue({
        result: [{ Error: { error_message: "error", error_type: 2 } }],
      });

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });
      const call = () =>
        canister.getNeuron({
          neuronId: neuronIdMock,
          certified: true,
        });

      await expect(call).rejects.toThrowError(SnsGovernanceError);
    });
  });

  describe("addNeuronPermissions", () => {
    it("should manage the neuron", async () => {
      const principal = Principal.fromText("aaaaa-aa");
      const permissions = [SnsNeuronPermissionType.NEURON_PERMISSION_TYPE_VOTE];
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue({
        command: [{ AddNeuronPermission: {} }],
      });

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });
      await canister.addNeuronPermissions({
        neuronId: neuronIdMock,
        permissions,
        principal,
      });

      expect(service.manage_neuron).toHaveBeenCalled();
    });

    it("should raise error", async () => {
      const principal = Principal.fromText("aaaaa-aa");
      const permissions = [SnsNeuronPermissionType.NEURON_PERMISSION_TYPE_VOTE];
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue(mockErrorCommand);

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });
      const call = () =>
        canister.addNeuronPermissions({
          neuronId: neuronIdMock,
          permissions,
          principal,
        });

      await expect(call).rejects.toThrowError(SnsGovernanceError);
      expect(service.manage_neuron).toHaveBeenCalled();
    });
  });

  describe("removeNeuronPermissions", () => {
    it("should manage the neuron", async () => {
      const principal = Principal.fromText("aaaaa-aa");
      const permissions = [SnsNeuronPermissionType.NEURON_PERMISSION_TYPE_VOTE];
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue({
        command: [{ AddNeuronPermission: {} }],
      });

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });
      await canister.removeNeuronPermissions({
        neuronId: neuronIdMock,
        permissions,
        principal,
      });

      expect(service.manage_neuron).toHaveBeenCalled();
    });

    it("should raise error", async () => {
      const principal = Principal.fromText("aaaaa-aa");
      const permissions = [SnsNeuronPermissionType.NEURON_PERMISSION_TYPE_VOTE];
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue(mockErrorCommand);

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });
      const call = () =>
        canister.removeNeuronPermissions({
          neuronId: neuronIdMock,
          permissions,
          principal,
        });

      await expect(call).rejects.toThrowError(SnsGovernanceError);
      expect(service.manage_neuron).toHaveBeenCalled();
    });
  });

  describe("splitNeuron", () => {
    const params: SnsSplitNeuronParams = {
      neuronId: {
        id: arrayOfNumberToUint8Array([1, 2, 3]),
      },
      amount: 123n,
      memo: 321n,
    };

    it("should splitNeuron the neuron", async () => {
      const request: ManageNeuron = {
        subaccount: params.neuronId.id,
        command: [
          {
            Split: {
              amount_e8s: params.amount,
              memo: params.memo,
            },
          },
        ],
      };

      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue({
        command: [
          {
            Split: {
              created_neuron_id: [{ id: arrayOfNumberToUint8Array([4, 5, 6]) }],
            },
          },
        ],
      });

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });

      await canister.splitNeuron(params);

      expect(service.manage_neuron).toHaveBeenCalled();
      expect(service.manage_neuron).toHaveBeenCalledWith(request);
    });

    it("should raise an error", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue(mockErrorCommand);

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });
      const call = () => canister.splitNeuron(params);

      await expect(call).rejects.toThrowError(SnsGovernanceError);
      expect(service.manage_neuron).toHaveBeenCalled();
    });
  });

  describe("manageNeuron", () => {
    it("should manage the neuron", async () => {
      const principal = Principal.fromText("aaaaa-aa");
      const permissions = [SnsNeuronPermissionType.NEURON_PERMISSION_TYPE_VOTE];
      const request: ManageNeuron = {
        subaccount: arrayOfNumberToUint8Array([1, 2, 3]),
        command: [
          {
            AddNeuronPermissions: {
              permissions_to_add: [
                { permissions: Int32Array.from(permissions) },
              ],
              principal_id: [principal],
            },
          },
        ],
      };
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue({
        command: [{ AddNeuronPermission: {} }],
      });

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });
      await canister.manageNeuron(request);

      expect(service.manage_neuron).toHaveBeenCalled();
    });

    it("should raise an error", async () => {
      const principal = Principal.fromText("aaaaa-aa");
      const permissions = [SnsNeuronPermissionType.NEURON_PERMISSION_TYPE_VOTE];
      const request: ManageNeuron = {
        subaccount: arrayOfNumberToUint8Array([1, 2, 3]),
        command: [
          {
            AddNeuronPermissions: {
              permissions_to_add: [
                { permissions: Int32Array.from(permissions) },
              ],
              principal_id: [principal],
            },
          },
        ],
      };
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue(mockErrorCommand);

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });
      const call = () => canister.manageNeuron(request);

      await expect(call).rejects.toThrowError(SnsGovernanceError);
      expect(service.manage_neuron).toHaveBeenCalled();
    });
  });

  describe("metadata", () => {
    it("should return the metadata of the sns", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.get_metadata.mockResolvedValue(metadataMock);

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const res = await canister.metadata({});

      expect(res).toEqual(metadataMock);
    });
  });

  describe("nervousSystemParameters", () => {
    it("should return the parameters of the sns", async () => {
      const mockParams = { test: true };
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.get_nervous_system_parameters.mockResolvedValue(
        mockParams as unknown as NervousSystemParameters,
      );

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const res = await canister.nervousSystemParameters({});

      expect(res).toEqual(mockParams);
    });
  });

  describe("disburse", () => {
    const toAccount = {
      owner: Principal.fromText("aaaaa-aa"),
      subaccount: arrayOfNumberToUint8Array([0, 0, 1]),
    };
    const params: SnsDisburseNeuronParams = {
      neuronId: {
        id: arrayOfNumberToUint8Array([1, 2, 3]),
      },
      amount: BigInt(321),
      toAccount,
    };

    it("should disburse the neuron", async () => {
      const request: ManageNeuron = {
        subaccount: params.neuronId.id,
        command: [
          {
            Disburse: {
              to_account: [toCandidAccount(toAccount)],
              amount: [
                {
                  e8s: params.amount as bigint,
                },
              ],
            },
          },
        ],
      };

      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue({
        command: [{ Disburse: { transfer_block_height: BigInt(0) } }],
      });

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });

      await canister.disburse(params);

      expect(service.manage_neuron).toHaveBeenCalled();
      expect(service.manage_neuron).toHaveBeenCalledWith(request);
    });

    it("should raise an error", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue(mockErrorCommand);

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });
      const call = () => canister.disburse(params);

      await expect(call).rejects.toThrowError(SnsGovernanceError);
      expect(service.manage_neuron).toHaveBeenCalled();
    });
  });

  describe("startDissolving", () => {
    const neuronId: NeuronId = {
      id: arrayOfNumberToUint8Array([1, 2, 3]),
    };

    it("should call manageNeuron", async () => {
      const request: ManageNeuron = {
        subaccount: neuronId.id,
        command: [
          {
            Configure: {
              operation: [{ StartDissolving: {} }],
            },
          },
        ],
      };

      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue({
        command: [{ Configure: {} }],
      });

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });

      await canister.startDissolving(neuronId);

      expect(service.manage_neuron).toHaveBeenCalled();
      expect(service.manage_neuron).toHaveBeenCalledWith(request);
    });

    it("should raise an error", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue(mockErrorCommand);

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });
      const call = () => canister.startDissolving(neuronId);

      await expect(call).rejects.toThrowError(SnsGovernanceError);
      expect(service.manage_neuron).toHaveBeenCalled();
    });
  });

  describe("stopDissolving", () => {
    const neuronId: NeuronId = {
      id: arrayOfNumberToUint8Array([1, 2, 3]),
    };

    it("should call manageNeuron", async () => {
      const request: ManageNeuron = {
        subaccount: neuronId.id,
        command: [
          {
            Configure: {
              operation: [{ StopDissolving: {} }],
            },
          },
        ],
      };

      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue({
        command: [{ Configure: {} }],
      });

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });

      await canister.stopDissolving(neuronId);

      expect(service.manage_neuron).toHaveBeenCalled();
      expect(service.manage_neuron).toHaveBeenCalledWith(request);
    });

    it("should raise an error", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue(mockErrorCommand);

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });
      const call = () => canister.stopDissolving(neuronId);

      await expect(call).rejects.toThrowError(SnsGovernanceError);
      expect(service.manage_neuron).toHaveBeenCalled();
    });
  });

  describe("setDissolveTimestamp", () => {
    const neuronId: NeuronId = {
      id: arrayOfNumberToUint8Array([1, 2, 3]),
    };

    it("should call manageNeuron", async () => {
      const request: ManageNeuron = {
        subaccount: neuronId.id,
        command: [
          {
            Configure: {
              operation: [
                {
                  SetDissolveTimestamp: {
                    dissolve_timestamp_seconds: BigInt(123),
                  },
                },
              ],
            },
          },
        ],
      };

      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue({
        command: [{ Configure: {} }],
      });

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });

      await canister.setDissolveTimestamp({
        neuronId,
        dissolveTimestampSeconds: BigInt(123),
      });

      expect(service.manage_neuron).toHaveBeenCalled();
      expect(service.manage_neuron).toHaveBeenCalledWith(request);
    });

    it("should raise an error", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue(mockErrorCommand);

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });
      const call = () =>
        canister.setDissolveTimestamp({
          neuronId,
          dissolveTimestampSeconds: BigInt(123),
        });

      await expect(call).rejects.toThrowError(SnsGovernanceError);
      expect(service.manage_neuron).toHaveBeenCalled();
    });
  });

  describe("increaseDissolveDelay", () => {
    const neuronId: NeuronId = {
      id: arrayOfNumberToUint8Array([1, 2, 3]),
    };

    it("should call manageNeuron", async () => {
      const request: ManageNeuron = {
        subaccount: neuronId.id,
        command: [
          {
            Configure: {
              operation: [
                {
                  IncreaseDissolveDelay: {
                    additional_dissolve_delay_seconds: 123,
                  },
                },
              ],
            },
          },
        ],
      };

      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue({
        command: [{ Configure: {} }],
      });

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });

      await canister.increaseDissolveDelay({
        neuronId,
        additionalDissolveDelaySeconds: 123,
      });

      expect(service.manage_neuron).toHaveBeenCalled();
      expect(service.manage_neuron).toHaveBeenCalledWith(request);
    });

    it("should raise an error", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue(mockErrorCommand);

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });
      const call = () =>
        canister.increaseDissolveDelay({
          neuronId,
          additionalDissolveDelaySeconds: 123,
        });

      await expect(call).rejects.toThrowError(SnsGovernanceError);
      expect(service.manage_neuron).toHaveBeenCalled();
    });
  });

  describe("setTopicFollowees", () => {
    const neuronId: NeuronId = {
      id: arrayOfNumberToUint8Array([1, 2, 3]),
    };
    const functionId = BigInt(222);
    const followees = [
      { id: arrayOfNumberToUint8Array([1, 2, 3, 4]) },
      { id: arrayOfNumberToUint8Array([1, 2, 3, 5]) },
    ];

    it("should call manageNeuron", async () => {
      const request: ManageNeuron = {
        subaccount: neuronId.id,
        command: [
          {
            Follow: {
              function_id: functionId,
              followees,
            },
          },
        ],
      };

      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue({
        command: [{ Follow: {} }],
      });

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });

      await canister.setTopicFollowees({
        neuronId,
        functionId,
        followees,
      });

      expect(service.manage_neuron).toHaveBeenCalled();
      expect(service.manage_neuron).toHaveBeenCalledWith(request);
    });

    it("should raise an error", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue(mockErrorCommand);

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });
      const call = () =>
        canister.setTopicFollowees({
          neuronId,
          functionId,
          followees,
        });

      await expect(call).rejects.toThrowError(SnsGovernanceError);
      expect(service.manage_neuron).toHaveBeenCalled();
    });
  });

  describe("setFollowing", () => {
    const neuronId: NeuronId = {
      id: arrayOfNumberToUint8Array([0, 1, 2]),
    };
    const neuronId1: NeuronId = {
      id: arrayOfNumberToUint8Array([1, 2, 3]),
    };
    const neuronId2: NeuronId = {
      id: arrayOfNumberToUint8Array([2, 3, 4]),
    };
    const topic1: Topic = { DappCanisterManagement: null };
    const topic2: Topic = { Governance: null };
    const alias = "alias";

    it("should call manageNeuron", async () => {
      const request: ManageNeuron = {
        subaccount: neuronId.id,
        command: [
          {
            SetFollowing: {
              topic_following: [
                {
                  topic: [topic1],
                  followees: [
                    {
                      neuron_id: [neuronId1],
                      alias: [alias],
                    },
                    {
                      neuron_id: [neuronId2],
                      alias: [],
                    },
                  ],
                },
                {
                  topic: [topic2],
                  followees: [
                    {
                      neuron_id: [neuronId2],
                      alias: [],
                    },
                  ],
                },
              ],
            },
          },
        ],
      };

      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue({
        command: [{ SetFollowing: {} }],
      });

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });

      await canister.setFollowing({
        neuronId,
        topicFollowing: [
          {
            topic: topic1,
            followees: [
              {
                neuronId: neuronId1,
                alias,
              },
              {
                neuronId: neuronId2,
              },
            ],
          },
          {
            topic: topic2,
            followees: [
              {
                neuronId: neuronId2,
              },
            ],
          },
        ],
      });

      expect(service.manage_neuron).toHaveBeenCalled();
      expect(service.manage_neuron).toHaveBeenCalledWith(request);
    });

    it("should raise an error", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue(mockErrorCommand);

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });
      const call = () =>
        canister.setFollowing({
          neuronId,
          topicFollowing: [],
        });

      await expect(call).rejects.toThrowError(SnsGovernanceError);
      expect(service.manage_neuron).toHaveBeenCalled();
    });
  });

  describe("registerVote", () => {
    const proposalId = {
      id: 123n,
    };
    const vote = SnsVote.Yes;
    const params: SnsRegisterVoteParams = {
      neuronId: neuronIdMock,
      vote,
      proposalId,
    };

    it("should register the vote", async () => {
      const request: ManageNeuron = {
        subaccount: neuronIdMock.id,
        command: [
          {
            RegisterVote: {
              vote,
              proposal: [proposalId],
            },
          },
        ],
      };

      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue({
        command: [
          {
            RegisterVote: {},
          },
        ],
      });

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });

      await canister.registerVote(params);

      expect(service.manage_neuron).toHaveBeenCalled();
      expect(service.manage_neuron).toHaveBeenCalledWith(request);
    });

    it("should raise an error", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue(mockErrorCommand);

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });
      const call = () => canister.registerVote(params);

      await expect(call).rejects.toThrowError(SnsGovernanceError);
      expect(service.manage_neuron).toHaveBeenCalled();
    });
  });

  describe("queryNeuron", () => {
    it("should return the neuron", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.get_neuron.mockResolvedValue({
        result: [{ Neuron: neuronMock }],
      });

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });
      const res = await canister.queryNeuron({
        neuronId: neuronIdMock,
        certified: true,
      });

      expect(res).toEqual(neuronMock);
    });

    it("should return undefined if neuron not found", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.get_neuron.mockResolvedValue({
        result: [
          {
            Error: {
              error_message: "No neuron for given NeuronId.",
              error_type: 2,
            },
          },
        ],
      });

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });
      const res = await canister.queryNeuron({
        neuronId: neuronIdMock,
        certified: true,
      });

      expect(res).toBeUndefined();
    });

    it("should raise error on governance error", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.get_neuron.mockResolvedValue({
        result: [{ Error: { error_message: "error", error_type: 2 } }],
      });

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });
      const call = () =>
        canister.queryNeuron({
          neuronId: neuronIdMock,
          certified: true,
        });

      await expect(call).rejects.toThrowError(SnsGovernanceError);
    });
  });

  describe("refershNeuron", () => {
    it("should manage the neuron", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      const neuronId = { id: new Uint8Array() };
      service.manage_neuron.mockResolvedValue({
        command: [{ ClaimOrRefresh: { refreshed_neuron_id: [neuronId] } }],
      });

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });
      await canister.refreshNeuron(neuronId);

      expect(service.manage_neuron).toHaveBeenCalled();
    });

    it("should raise error", async () => {
      const neuronId = { id: new Uint8Array() };
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue(mockErrorCommand);

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });
      const call = () => canister.refreshNeuron(neuronId);

      await expect(call).rejects.toThrowError(SnsGovernanceError);
      expect(service.manage_neuron).toHaveBeenCalled();
    });
  });

  describe("claimNeuron", () => {
    it("should manage the neuron and return new neuron id", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      const neuronId = { id: new Uint8Array() };
      service.manage_neuron.mockResolvedValue({
        command: [{ ClaimOrRefresh: { refreshed_neuron_id: [neuronId] } }],
      });

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });
      const res = await canister.claimNeuron({
        memo: BigInt(1),
        controller: Principal.fromText("aaaaa-aa"),
        subaccount: new Uint8Array(),
      });

      expect(res).toEqual(neuronId);
      expect(service.manage_neuron).toHaveBeenCalled();
    });

    it("should raise error", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue(mockErrorCommand);

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });
      const call = () =>
        canister.claimNeuron({
          memo: BigInt(1),
          controller: Principal.fromText("aaaaa-aa"),
          subaccount: new Uint8Array(),
        });

      await expect(call).rejects.toThrowError(SnsGovernanceError);
      expect(service.manage_neuron).toHaveBeenCalled();
    });
  });

  describe("stakeMaturity", () => {
    const testStakeMaturitySuccess = async (
      percentageToStake: number | undefined,
    ) => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue({
        command: [
          {
            StakeMaturity: {
              maturity_e8s: 1n,
              staked_maturity_e8s: 2n,
            },
          },
        ],
      });

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });
      await canister.stakeMaturity({
        neuronId: neuronIdMock,
        percentageToStake,
      });

      expect(service.manage_neuron).toHaveBeenCalledWith({
        command: [
          {
            StakeMaturity: {
              percentage_to_stake: toNullable(percentageToStake),
            },
          },
        ],
        subaccount: neuronIdMock.id,
      });
    };

    // eslint-disable-next-line vitest/expect-expect -- This test uses test-functions
    it("should stake maturity of the neuron", async () =>
      await testStakeMaturitySuccess(50));

    // eslint-disable-next-line vitest/expect-expect -- This test uses test-functions
    it("should stake maturity of the neuron with no percentage", async () =>
      await testStakeMaturitySuccess(undefined));

    it("throws error if percentage not valid", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const call = () =>
        canister.stakeMaturity({
          neuronId: neuronIdMock,
          percentageToStake: 500,
        });

      await expect(call).rejects.toThrowError(InvalidPercentageError);
      expect(service.manage_neuron).not.toHaveBeenCalled();
    });

    it("should raise error", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue(mockErrorCommand);

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });
      const call = () =>
        canister.stakeMaturity({
          neuronId: neuronIdMock,
          percentageToStake: 75,
        });

      await expect(call).rejects.toThrowError(SnsGovernanceError);
      expect(service.manage_neuron).toHaveBeenCalled();
    });
  });

  describe("disburseMaturity", () => {
    const toAccount = {
      owner: Principal.fromText("aaaaa-aa"),
      subaccount: arrayOfNumberToUint8Array([0, 0, 1]),
    };
    const params: SnsNeuronDisburseMaturityParams = {
      neuronId: {
        id: arrayOfNumberToUint8Array([1, 2, 3]),
      },
      percentageToDisburse: 50,
      toAccount,
    };

    it("should disburse maturity of the neuron", async () => {
      const request: ManageNeuron = {
        subaccount: params.neuronId.id,
        command: [
          {
            DisburseMaturity: {
              to_account: [toCandidAccount(toAccount)],
              percentage_to_disburse: params.percentageToDisburse,
            },
          },
        ],
      };

      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue({
        command: [
          {
            DisburseMaturity: {
              amount_disbursed_e8s: BigInt(0),
              amount_deducted_e8s: [BigInt(0)],
            },
          },
        ],
      });

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });

      await canister.disburseMaturity(params);

      expect(service.manage_neuron).toHaveBeenCalled();
      expect(service.manage_neuron).toHaveBeenCalledWith(request);
    });

    it("throws error if percentage not valid", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const call = () =>
        canister.disburseMaturity({
          ...params,
          percentageToDisburse: 500,
        });

      await expect(call).rejects.toThrowError(InvalidPercentageError);
      expect(service.manage_neuron).not.toHaveBeenCalled();
    });

    it("should raise an error", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue(mockErrorCommand);

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });
      const call = () => canister.disburseMaturity(params);

      await expect(call).rejects.toThrowError(SnsGovernanceError);
      expect(service.manage_neuron).toHaveBeenCalled();
    });
  });

  describe("autoStakeMaturity", () => {
    const testAutoStakeMaturitySuccess = async (
      requested_setting_for_auto_stake_maturity: boolean,
    ) => {
      const request: ManageNeuron = {
        subaccount: neuronIdMock.id,
        command: [
          {
            Configure: {
              operation: [
                {
                  ChangeAutoStakeMaturity: {
                    requested_setting_for_auto_stake_maturity,
                  },
                },
              ],
            },
          },
        ],
      };

      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue({
        command: [{ Configure: {} }],
      });

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });

      await canister.manageNeuron(request);

      expect(service.manage_neuron).toHaveBeenCalled();
      expect(service.manage_neuron).toHaveBeenCalledWith(request);
    };

    // eslint-disable-next-line vitest/expect-expect -- This test uses test-functions
    it("should turn auto stake maturity of the neuron to true", async () =>
      await testAutoStakeMaturitySuccess(true));

    // eslint-disable-next-line vitest/expect-expect -- This test uses test-functions
    it("should turn auto stake maturity of the neuron to false", async () =>
      await testAutoStakeMaturitySuccess(false));

    it("throws error if percentage not valid", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const call = () =>
        canister.stakeMaturity({
          neuronId: neuronIdMock,
          percentageToStake: 500,
        });

      await expect(call).rejects.toThrowError(InvalidPercentageError);
      expect(service.manage_neuron).not.toHaveBeenCalled();
    });

    it("should raise error", async () => {
      const service = mock<ActorSubclass<SnsGovernanceService>>();
      service.manage_neuron.mockResolvedValue(mockErrorCommand);

      const canister = SnsGovernanceCanister.create({
        canisterId: rootCanisterIdMock,
        certifiedServiceOverride: service,
      });
      const call = () =>
        canister.autoStakeMaturity({
          neuronId: neuronIdMock,
          autoStake: true,
        });

      await expect(call).rejects.toThrowError(SnsGovernanceError);
      expect(service.manage_neuron).toHaveBeenCalled();
    });
  });
});
