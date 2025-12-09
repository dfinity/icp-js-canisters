import type { ActorSubclass } from "@icp-sdk/core/agent";
import { Principal } from "@icp-sdk/core/principal";
import { mock } from "vitest-mock-extended";
import type {
  BuyerState,
  GetAutoFinalizationStatusResponse,
  GetDerivedStateResponse,
  GetLifecycleResponse,
  GetOpenTicketResponse,
  GetSaleParametersResponse,
  GetStateResponse,
  NewSaleTicketResponse,
  _SERVICE as SnsSwapService,
  Swap,
} from "../declarations/sns/swap";
import {
  GetOpenTicketErrorType,
  NewSaleTicketResponseErrorType,
  SnsSwapLifecycle,
} from "./enums/swap.enums";
import { UnsupportedMethodError } from "./errors/common.errors";
import {
  SnsSwapGetOpenTicketError,
  SnsSwapNewTicketError,
} from "./errors/swap.errors";
import { saleTicketMock, swapCanisterIdMock } from "./mocks/sns.mock";
import { SnsSwapCanister } from "./swap.canister";

describe("Swap canister", () => {
  afterEach(() => vi.clearAllMocks());

  it("should return the state of the swap canister", async () => {
    const mockSwap: Swap = {
      swap: [
        {
          init: {
            min_participants: 2,
          },
        },
      ],
    } as unknown as Swap;

    const mockResponse: GetStateResponse = {
      swap: [mockSwap],
      derived: [],
    };

    const service = mock<ActorSubclass<SnsSwapService>>();
    service.get_state.mockResolvedValue(mockResponse);

    const canister = SnsSwapCanister.create({
      canisterId: swapCanisterIdMock,
      certifiedServiceOverride: service,
    });
    const res = await canister.state({});

    expect(res).toEqual(mockResponse);
  });

  it("should return open sale ticket", async () => {
    const mockResponse: GetOpenTicketResponse = {
      result: [
        {
          Ok: {
            ticket: [saleTicketMock],
          },
        },
      ],
    };

    const service = mock<ActorSubclass<SnsSwapService>>();
    service.get_open_ticket.mockResolvedValue(mockResponse);

    const canister = SnsSwapCanister.create({
      canisterId: swapCanisterIdMock,
      certifiedServiceOverride: service,
    });
    const res = await canister.getOpenTicket({});

    expect(res).toEqual(saleTicketMock);
  });

  it("should throw open sale ticket", async () => {
    const mockResponse: GetOpenTicketResponse = {
      result: [
        {
          Err: {
            error_type: [GetOpenTicketErrorType.TYPE_SALE_CLOSED],
          },
        },
      ],
    };

    const service = mock<ActorSubclass<SnsSwapService>>();
    service.get_open_ticket.mockResolvedValue(mockResponse);

    const canister = SnsSwapCanister.create({
      canisterId: swapCanisterIdMock,
      certifiedServiceOverride: service,
    });
    const call = () => canister.getOpenTicket({});

    await expect(call).rejects.toThrowError(
      new SnsSwapGetOpenTicketError(GetOpenTicketErrorType.TYPE_SALE_CLOSED),
    );
  });

  it("should return new sale ticket", async () => {
    const mockResponse: NewSaleTicketResponse = {
      result: [
        {
          Ok: {
            ticket: [saleTicketMock],
          },
        },
      ],
    };

    const service = mock<ActorSubclass<SnsSwapService>>();
    service.new_sale_ticket.mockResolvedValue(mockResponse);

    const canister = SnsSwapCanister.create({
      canisterId: swapCanisterIdMock,
      certifiedServiceOverride: service,
    });
    const ticket = await canister.newSaleTicket({
      subaccount: Uint8Array.from([]),
      amount_icp_e8s: 3n,
    });

    expect(ticket).toEqual(saleTicketMock);
  });

  it("should throw new sale ticket error", async () => {
    const min_amount_icp_e8s_included = 123n;
    const max_amount_icp_e8s_included = 321n;

    const mockResponse: NewSaleTicketResponse = {
      result: [
        {
          Err: {
            error_type: NewSaleTicketResponseErrorType.TYPE_TICKET_EXISTS,
            existing_ticket: [saleTicketMock],
            invalid_user_amount: [
              {
                min_amount_icp_e8s_included,
                max_amount_icp_e8s_included,
              },
            ],
          },
        },
      ],
    };

    const service = mock<ActorSubclass<SnsSwapService>>();
    service.new_sale_ticket.mockResolvedValue(mockResponse);

    const canister = SnsSwapCanister.create({
      canisterId: swapCanisterIdMock,
      certifiedServiceOverride: service,
    });
    const call = () =>
      canister.newSaleTicket({
        subaccount: Uint8Array.from([]),
        amount_icp_e8s: 3n,
      });

    await expect(call).rejects.toThrowError(
      new SnsSwapNewTicketError({
        errorType: NewSaleTicketResponseErrorType.TYPE_TICKET_EXISTS,
        existingTicket: saleTicketMock,
        invalidUserAmount: {
          min_amount_icp_e8s_included,
          max_amount_icp_e8s_included,
        },
      }),
    );
  });

  it("should return the derived state of the swap canister", async () => {
    const testResponse: GetDerivedStateResponse = {
      sns_tokens_per_icp: [2],
      buyer_total_icp_e8s: [BigInt(100_000_000)],
      cf_participant_count: [BigInt(3)],
      direct_participant_count: [BigInt(4)],
      cf_neuron_count: [BigInt(6)],
      neurons_fund_participation_icp_e8s: [],
      direct_participation_icp_e8s: [],
    };

    const service = mock<ActorSubclass<SnsSwapService>>();
    service.get_derived_state.mockResolvedValue(testResponse);

    const canister = SnsSwapCanister.create({
      canisterId: swapCanisterIdMock,
      certifiedServiceOverride: service,
    });
    const res = await canister.getDerivedState({});

    expect(res).toEqual(testResponse);
  });

  it("should return sale parameters", async () => {
    const testResponse: GetSaleParametersResponse = {
      params: [
        {
          min_participant_icp_e8s: BigInt(100_000_000),
          neuron_basket_construction_parameters: [],
          max_icp_e8s: BigInt(2_000_000_000),
          swap_due_timestamp_seconds: BigInt(3_600),
          min_participants: 3,
          sns_token_e8s: BigInt(2_000_000_000),
          sale_delay_seconds: [],
          max_participant_icp_e8s: BigInt(500_000_000),
          min_icp_e8s: BigInt(200_000_000),
          min_direct_participation_icp_e8s: [1_000_000_000n],
          max_direct_participation_icp_e8s: [2_000_000_000n],
        },
      ],
    };

    const service = mock<ActorSubclass<SnsSwapService>>();
    service.get_sale_parameters.mockResolvedValue(testResponse);

    const canister = SnsSwapCanister.create({
      canisterId: swapCanisterIdMock,
      certifiedServiceOverride: service,
    });
    const res = await canister.getSaleParameters({});

    expect(res).toEqual(testResponse);
  });

  it("should return the lifecycle state of the swap canister", async () => {
    const mockResponse: GetLifecycleResponse = {
      decentralization_sale_open_timestamp_seconds: [BigInt(2)],
      lifecycle: [SnsSwapLifecycle.Adopted],
      decentralization_swap_termination_timestamp_seconds: [],
    };

    const service = mock<ActorSubclass<SnsSwapService>>();
    service.get_lifecycle.mockResolvedValue(mockResponse);

    const canister = SnsSwapCanister.create({
      canisterId: swapCanisterIdMock,
      certifiedServiceOverride: service,
    });
    const res = await canister.getLifecycle({});

    expect(res).toEqual(mockResponse);
  });

  describe("getFinalizationStatus", () => {
    it("should return the finalization status of the swap canister", async () => {
      const mockResponse: GetAutoFinalizationStatusResponse = {
        auto_finalize_swap_response: [],
        has_auto_finalize_been_attempted: [false],
        is_auto_finalize_enabled: [false],
      };

      const service = mock<ActorSubclass<SnsSwapService>>();
      service.get_auto_finalization_status.mockResolvedValue(mockResponse);

      const canister = SnsSwapCanister.create({
        canisterId: swapCanisterIdMock,
        certifiedServiceOverride: service,
      });
      const res = await canister.getFinalizationStatus({});

      expect(res).toEqual(mockResponse);
    });

    it("throw UnsupportedMethodError if method not supported", async () => {
      const errorMessage = `Call failed:
      Canister: s55qq-oqaaa-aaaaa-aaakq-cai
      Method: get_auto_finalization_status (query)
      "Status": "rejected"
      "Code": "DestinationInvalid"
      "Message": "IC0302: Canister s55qq-oqaaa-aaaaa-aaakq-cai has no query method 'get_auto_finalization_status'"`;

      const service = mock<ActorSubclass<SnsSwapService>>();
      service.get_auto_finalization_status.mockRejectedValue(
        new Error(errorMessage),
      );

      const canister = SnsSwapCanister.create({
        canisterId: swapCanisterIdMock,
        certifiedServiceOverride: service,
      });
      const call = () => canister.getFinalizationStatus({});

      await expect(call).rejects.toThrowError(
        new UnsupportedMethodError("getFinalizationStatus"),
      );
    });

    it("throw forward error if not unsupported method error", async () => {
      const errorMessage = "Another error";
      const err = new Error(errorMessage);

      const service = mock<ActorSubclass<SnsSwapService>>();
      service.get_auto_finalization_status.mockRejectedValue(err);

      const canister = SnsSwapCanister.create({
        canisterId: swapCanisterIdMock,
        certifiedServiceOverride: service,
      });
      const call = () => canister.getFinalizationStatus({});

      await expect(call).rejects.toThrowError(err);
    });
  });

  it("should call to notify payment failure", async () => {
    const service = mock<ActorSubclass<SnsSwapService>>();
    service.notify_payment_failure.mockResolvedValue({
      ticket: [saleTicketMock],
    });

    const canister = SnsSwapCanister.create({
      canisterId: swapCanisterIdMock,
      certifiedServiceOverride: service,
    });
    const result = await canister.notifyPaymentFailure();

    expect(service.notify_payment_failure).toHaveBeenCalledWith({});

    expect(result).toEqual(saleTicketMock);
  });

  it("should return the user commitment", async () => {
    const buyerState: BuyerState = {
      icp: [
        {
          amount_e8s: BigInt(100000000),
          transfer_start_timestamp_seconds: BigInt(0),
          transfer_success_timestamp_seconds: BigInt(0),
          transfer_fee_paid_e8s: [BigInt(100000)],
          amount_transferred_e8s: [BigInt(99900000)],
        },
      ],
      has_created_neuron_recipes: [false],
    };
    const service = mock<ActorSubclass<SnsSwapService>>();
    service.get_buyer_state.mockResolvedValue({
      buyer_state: [buyerState],
    });

    const canister = SnsSwapCanister.create({
      canisterId: swapCanisterIdMock,
      certifiedServiceOverride: service,
    });
    const response = await canister.getUserCommitment({
      principal_id: [Principal.fromText("aaaaa-aa")],
    });

    expect(service.get_buyer_state).toHaveBeenCalled();
    expect(response).toEqual(buyerState);
  });
});
