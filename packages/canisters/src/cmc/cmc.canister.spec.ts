import {
  arrayOfNumberToUint8Array,
  type QueryParams,
  toNullable,
} from "@dfinity/utils";
import type { ActorSubclass, HttpAgent } from "@icp-sdk/core/agent";
import { Principal } from "@icp-sdk/core/principal";
import { mock } from "vitest-mock-extended";
import type { CmcDid, CmcService } from "../declarations";
import { CmcCanister } from "./cmc.canister";
import {
  CmcError,
  InvalidaTransactionError,
  ProcessingError,
  RefundedError,
  TransactionTooOldError,
} from "./cmc.errors";
import { mockPrincipalText } from "./cmc.mock";

describe("CyclesMintingCanister", () => {
  const mockAgent: HttpAgent = mock<HttpAgent>();

  const createCmc = (service: CmcService): CmcCanister => {
    const canisterId = Principal.fromText("aaaaa-aa");

    return CmcCanister.create({
      agent: mockAgent,
      serviceOverride: service as ActorSubclass<CmcService>,
      certifiedServiceOverride: service as ActorSubclass<CmcService>,
      canisterId,
    });
  };

  describe("CmcCanister.getIcpToCyclesConversionRate", () => {
    it("should returns the conversion rate from ICP to cycles for a query", async () => {
      const exchangeRate = BigInt(10_000);
      const response: CmcDid.IcpXdrConversionRateResponse = {
        certificate: arrayOfNumberToUint8Array([]),
        data: {
          xdr_permyriad_per_icp: exchangeRate,
          timestamp_seconds: BigInt(10),
        },
        hash_tree: arrayOfNumberToUint8Array([]),
      };
      const service = mock<CmcService>();
      service.get_icp_xdr_conversion_rate.mockResolvedValue(response);

      const cmc = await createCmc(service);
      const callerSpy = vi.spyOn(
        cmc as unknown as {
          caller: (params: QueryParams) => Promise<CmcService>;
        },
        "caller",
      );

      const res = await cmc.getIcpToCyclesConversionRate({ certified: false });

      expect(res).toEqual(exchangeRate);
      expect(service.get_icp_xdr_conversion_rate).toHaveBeenCalledOnce();
      expect(callerSpy).toHaveBeenCalledWith({ certified: false });
    });

    it("should returns the conversion rate from ICP to cycles for an update", async () => {
      const exchangeRate = BigInt(10_000);
      const response: CmcDid.IcpXdrConversionRateResponse = {
        certificate: arrayOfNumberToUint8Array([]),
        data: {
          xdr_permyriad_per_icp: exchangeRate,
          timestamp_seconds: BigInt(10),
        },
        hash_tree: arrayOfNumberToUint8Array([]),
      };
      const service = mock<CmcService>();
      service.get_icp_xdr_conversion_rate.mockResolvedValue(response);

      const cmc = await createCmc(service);
      const callerSpy = vi.spyOn(
        cmc as unknown as {
          caller: (params: QueryParams) => Promise<CmcService>;
        },
        "caller",
      );

      const res = await cmc.getIcpToCyclesConversionRate({ certified: true });

      expect(res).toEqual(exchangeRate);
      expect(service.get_icp_xdr_conversion_rate).toHaveBeenCalledOnce();
      expect(callerSpy).toHaveBeenCalledWith({ certified: true });
    });
  });

  describe("CmcCanister.notifyCreateCanister", () => {
    it("returns principal of the new canister", async () => {
      const canisterId = Principal.fromText(
        "xlmdg-vkosz-ceopx-7wtgu-g3xmd-koiyc-awqaq-7modz-zf6r6-364rh-oqe",
      );
      const response: CmcDid.NotifyCreateCanisterResult = {
        Ok: canisterId,
      };
      const service = mock<CmcService>();
      service.notify_create_canister.mockResolvedValue(response);

      const cmc = await createCmc(service);

      const res = await cmc.notifyCreateCanister({
        controller: Principal.fromText("aaaaa-aa"),
        block_index: BigInt(10),
        subnet_type: [],
        subnet_selection: [],
        settings: [],
      });

      expect(res).toEqual(canisterId);
    });

    it("throws Refunded error", async () => {
      const response: CmcDid.NotifyCreateCanisterResult = {
        Err: { Refunded: { block_index: [], reason: "test" } },
      };
      const service = mock<CmcService>();
      service.notify_create_canister.mockResolvedValue(response);

      const cmc = await createCmc(service);

      const call = () =>
        cmc.notifyCreateCanister({
          controller: Principal.fromText("aaaaa-aa"),
          block_index: BigInt(10),
          subnet_type: [],
          subnet_selection: [],
          settings: [],
        });

      await expect(call).rejects.toThrowError(RefundedError);
    });

    it("throws InvalidaTransactionError error", async () => {
      const response: CmcDid.NotifyCreateCanisterResult = {
        Err: { InvalidTransaction: "test" },
      };
      const service = mock<CmcService>();
      service.notify_create_canister.mockResolvedValue(response);

      const cmc = await createCmc(service);

      const call = () =>
        cmc.notifyCreateCanister({
          controller: Principal.fromText("aaaaa-aa"),
          block_index: BigInt(10),
          subnet_type: [],
          subnet_selection: [],
          settings: [],
        });

      await expect(call).rejects.toThrowError(InvalidaTransactionError);
    });

    it("throws ProcessingError error", async () => {
      const response: CmcDid.NotifyCreateCanisterResult = {
        Err: { Processing: null },
      };
      const service = mock<CmcService>();
      service.notify_create_canister.mockResolvedValue(response);

      const cmc = await createCmc(service);

      const call = () =>
        cmc.notifyCreateCanister({
          controller: Principal.fromText("aaaaa-aa"),
          block_index: BigInt(10),
          subnet_type: [],
          subnet_selection: [],
          settings: [],
        });

      await expect(call).rejects.toThrowError(ProcessingError);
    });

    it("throws TransactionTooOldError error", async () => {
      const response: CmcDid.NotifyCreateCanisterResult = {
        Err: { TransactionTooOld: BigInt(10) },
      };
      const service = mock<CmcService>();
      service.notify_create_canister.mockResolvedValue(response);

      const cmc = await createCmc(service);

      const call = () =>
        cmc.notifyCreateCanister({
          controller: Principal.fromText("aaaaa-aa"),
          block_index: BigInt(10),
          subnet_type: [],
          subnet_selection: [],
          settings: [],
        });

      await expect(call).rejects.toThrowError(TransactionTooOldError);
    });

    it("throws CMCError error", async () => {
      const response: CmcDid.NotifyCreateCanisterResult = {
        Err: { Other: { error_code: BigInt(10), error_message: "test" } },
      };
      const service = mock<CmcService>();
      service.notify_create_canister.mockResolvedValue(response);

      const cmc = await createCmc(service);

      const call = () =>
        cmc.notifyCreateCanister({
          controller: Principal.fromText("aaaaa-aa"),
          block_index: BigInt(10),
          subnet_type: [],
          subnet_selection: [],
          settings: [],
        });

      await expect(call).rejects.toThrowError(CmcError);
    });
  });

  describe("CmcCanister.notifyTopUp", () => {
    it("successfully notifies top up", async () => {
      const response: CmcDid.NotifyTopUpResult = {
        Ok: BigInt(10),
      };
      const service = mock<CmcService>();
      service.notify_top_up.mockResolvedValue(response);

      const cmc = await createCmc(service);

      await cmc.notifyTopUp({
        canister_id: Principal.fromText("aaaaa-aa"),
        block_index: BigInt(10),
      });

      expect(service.notify_top_up).toHaveBeenCalled();
    });

    it("throws Refunded error", async () => {
      const response: CmcDid.NotifyTopUpResult = {
        Err: { Refunded: { block_index: [], reason: "test" } },
      };
      const service = mock<CmcService>();
      service.notify_top_up.mockResolvedValue(response);

      const cmc = await createCmc(service);

      const call = () =>
        cmc.notifyTopUp({
          canister_id: Principal.fromText("aaaaa-aa"),
          block_index: BigInt(10),
        });

      await expect(call).rejects.toThrowError(RefundedError);
    });

    it("throws InvalidaTransactionError error", async () => {
      const response: CmcDid.NotifyTopUpResult = {
        Err: { InvalidTransaction: "test" },
      };
      const service = mock<CmcService>();
      service.notify_top_up.mockResolvedValue(response);

      const cmc = await createCmc(service);

      const call = () =>
        cmc.notifyTopUp({
          canister_id: Principal.fromText("aaaaa-aa"),
          block_index: BigInt(10),
        });

      await expect(call).rejects.toThrowError(InvalidaTransactionError);
    });

    it("throws ProcessingError error", async () => {
      const response: CmcDid.NotifyTopUpResult = {
        Err: { Processing: null },
      };
      const service = mock<CmcService>();
      service.notify_top_up.mockResolvedValue(response);

      const cmc = await createCmc(service);

      const call = () =>
        cmc.notifyTopUp({
          canister_id: Principal.fromText("aaaaa-aa"),
          block_index: BigInt(10),
        });

      await expect(call).rejects.toThrowError(ProcessingError);
    });

    it("throws TransactionTooOldError error", async () => {
      const response: CmcDid.NotifyTopUpResult = {
        Err: { TransactionTooOld: BigInt(10) },
      };
      const service = mock<CmcService>();
      service.notify_top_up.mockResolvedValue(response);

      const cmc = await createCmc(service);

      const call = () =>
        cmc.notifyTopUp({
          canister_id: Principal.fromText("aaaaa-aa"),
          block_index: BigInt(10),
        });

      await expect(call).rejects.toThrowError(TransactionTooOldError);
    });

    it("throws CMCError error", async () => {
      const response: CmcDid.NotifyTopUpResult = {
        Err: { Other: { error_code: BigInt(10), error_message: "test" } },
      };
      const service = mock<CmcService>();
      service.notify_top_up.mockResolvedValue(response);

      const cmc = await createCmc(service);

      const call = () =>
        cmc.notifyTopUp({
          canister_id: Principal.fromText("aaaaa-aa"),
          block_index: BigInt(10),
        });

      await expect(call).rejects.toThrowError(CmcError);
    });
  });

  describe("CmcCanister.notifyMintCycles", () => {
    const args: CmcDid.NotifyMintCyclesArg = {
      block_index: BigInt(10),
      deposit_memo: toNullable(),
      to_subaccount: toNullable(),
    };

    it("successfully notifies mint cycles", async () => {
      const response: CmcDid.NotifyMintCyclesResult = {
        Ok: {
          block_index: 123n,
          balance: 456n,
          minted: 789n,
        },
      };
      const service = mock<CmcService>();
      service.notify_mint_cycles.mockResolvedValue(response);

      const cmc = await createCmc(service);

      const payload: CmcDid.NotifyMintCyclesArg = {
        ...args,
        deposit_memo: toNullable(Uint8Array.from([1, 2, 3])),
        to_subaccount: toNullable(Uint8Array.from([4, 5, 6])),
      };

      await cmc.notifyMintCycles(payload);

      expect(service.notify_mint_cycles).toHaveBeenCalledExactlyOnceWith(
        payload,
      );
    });

    it("throws Refunded error", async () => {
      const response: CmcDid.NotifyMintCyclesResult = {
        Err: { Refunded: { block_index: [], reason: "test" } },
      };
      const service = mock<CmcService>();
      service.notify_mint_cycles.mockResolvedValue(response);

      const cmc = await createCmc(service);

      const call = () => cmc.notifyMintCycles(args);

      await expect(call).rejects.toThrowError(RefundedError);
    });

    it("throws InvalidaTransactionError error", async () => {
      const response: CmcDid.NotifyMintCyclesResult = {
        Err: { InvalidTransaction: "test" },
      };
      const service = mock<CmcService>();
      service.notify_mint_cycles.mockResolvedValue(response);

      const cmc = await createCmc(service);

      const call = () => cmc.notifyMintCycles(args);

      await expect(call).rejects.toThrowError(InvalidaTransactionError);
    });

    it("throws ProcessingError error", async () => {
      const response: CmcDid.NotifyMintCyclesResult = {
        Err: { Processing: null },
      };
      const service = mock<CmcService>();
      service.notify_mint_cycles.mockResolvedValue(response);

      const cmc = await createCmc(service);

      const call = () => cmc.notifyMintCycles(args);

      await expect(call).rejects.toThrowError(ProcessingError);
    });

    it("throws TransactionTooOldError error", async () => {
      const response: CmcDid.NotifyMintCyclesResult = {
        Err: { TransactionTooOld: BigInt(10) },
      };
      const service = mock<CmcService>();
      service.notify_mint_cycles.mockResolvedValue(response);

      const cmc = await createCmc(service);

      const call = () => cmc.notifyMintCycles(args);

      await expect(call).rejects.toThrowError(TransactionTooOldError);
    });

    it("throws CMCError error", async () => {
      const response: CmcDid.NotifyMintCyclesResult = {
        Err: { Other: { error_code: BigInt(10), error_message: "test" } },
      };
      const service = mock<CmcService>();
      service.notify_mint_cycles.mockResolvedValue(response);

      const cmc = await createCmc(service);

      const call = () => cmc.notifyMintCycles(args);

      await expect(call).rejects.toThrowError(CmcError);
    });
  });

  describe("CmcCanister.getDefaultSubnets", () => {
    const expectedSubnets = [
      Principal.fromText(mockPrincipalText),
      Principal.fromText("aaaaa-aa"),
    ];

    it("should return a list of default subnets for a query", async () => {
      const service = mock<CmcService>();
      service.get_default_subnets.mockResolvedValue(expectedSubnets);

      const cmc = await createCmc(service);

      const callerSpy = vi.spyOn(
        cmc as unknown as {
          caller: (params: QueryParams) => Promise<CmcService>;
        },
        "caller",
      );

      const result = await cmc.getDefaultSubnets({ certified: false });

      expect(result).toEqual(expectedSubnets);
      expect(service.get_default_subnets).toHaveBeenCalledOnce();

      expect(callerSpy).toHaveBeenCalledWith({ certified: false });
    });

    it("should return a list of default subnets for an update", async () => {
      const service = mock<CmcService>();
      service.get_default_subnets.mockResolvedValue(expectedSubnets);

      const cmc = await createCmc(service);

      const callerSpy = vi.spyOn(
        cmc as unknown as {
          caller: (params: QueryParams) => Promise<CmcService>;
        },
        "caller",
      );

      const result = await cmc.getDefaultSubnets({ certified: true });

      expect(result).toEqual(expectedSubnets);
      expect(service.get_default_subnets).toHaveBeenCalledOnce();

      expect(callerSpy).toHaveBeenCalledWith({ certified: true });
    });

    it("should throw an error if the canister call ends in error", async () => {
      const service = mock<CmcService>();
      service.get_default_subnets.mockRejectedValue(new Error("Test"));

      const cmc = await createCmc(service);

      await expect(
        cmc.getDefaultSubnets({ certified: true }),
      ).rejects.toThrowError("Test");
      expect(service.get_default_subnets).toHaveBeenCalledOnce();
    });
  });

  describe("CmcCanister.getSubnetTypesToSubnets", () => {
    const expectedSubnets: CmcDid.SubnetTypesToSubnetsResponse = {
      data: [
        [
          "european",
          [
            Principal.fromText(
              "bkfrj-6k62g-dycql-7h53p-atvkj-zg4to-gaogh-netha-ptybj-ntsgw-rqe",
            ),
          ],
        ],
        [
          "fiduciary",
          [
            Principal.fromText(
              "pzp6e-ekpqk-3c5x7-2h6so-njoeq-mt45d-h3h6c-q3mxf-vpeq5-fk5o7-yae",
            ),
          ],
        ],
      ],
    };

    it("should return a list of default subnets for a query", async () => {
      const service = mock<CmcService>();
      service.get_subnet_types_to_subnets.mockResolvedValue(expectedSubnets);

      const cmc = await createCmc(service);

      const callerSpy = vi.spyOn(
        cmc as unknown as {
          caller: (params: QueryParams) => Promise<CmcService>;
        },
        "caller",
      );

      const result = await cmc.getSubnetTypesToSubnets({ certified: false });

      expect(result).toEqual(expectedSubnets);
      expect(service.get_subnet_types_to_subnets).toHaveBeenCalledOnce();

      expect(callerSpy).toHaveBeenCalledWith({ certified: false });
    });

    it("should return a list of default subnets for an update", async () => {
      const service = mock<CmcService>();
      service.get_subnet_types_to_subnets.mockResolvedValue(expectedSubnets);

      const cmc = await createCmc(service);

      const callerSpy = vi.spyOn(
        cmc as unknown as {
          caller: (params: QueryParams) => Promise<CmcService>;
        },
        "caller",
      );

      const result = await cmc.getSubnetTypesToSubnets({ certified: true });

      expect(result).toEqual(expectedSubnets);
      expect(service.get_subnet_types_to_subnets).toHaveBeenCalledOnce();

      expect(callerSpy).toHaveBeenCalledWith({ certified: true });
    });

    it("should throw an error if the canister call ends in error", async () => {
      const service = mock<CmcService>();
      service.get_subnet_types_to_subnets.mockRejectedValue(new Error("Test"));

      const cmc = await createCmc(service);

      await expect(
        cmc.getSubnetTypesToSubnets({ certified: true }),
      ).rejects.toThrowError("Test");
      expect(service.get_subnet_types_to_subnets).toHaveBeenCalledOnce();
    });
  });
});
