import { arrayOfNumberToUint8Array } from "@dfinity/utils";
import type { ActorSubclass } from "@icp-sdk/core/agent";
import { Principal } from "@icp-sdk/core/principal";
import { mock } from "vitest-mock-extended";
import type { IcrcIndexNgDid, IcrcIndexNgService } from "../../declarations";
import { IndexError } from "./errors/index.errors";
import { IcrcIndexNgCanister } from "./index-ng.canister";
import {
  indexCanisterIdMock,
  ledgerCanisterIdMock,
  mockPrincipal,
} from "./mocks/ledger.mock";
import type { IcrcAccount } from "./types/ledger.responses";

describe("Index canister", () => {
  afterEach(() => vi.clearAllMocks());

  const fakeSnsAccount: IcrcAccount = {
    owner: Principal.fromText("aaaaa-aa"),
  };

  const fakeCandidAccount: IcrcIndexNgDid.Account = {
    owner: Principal.fromText("aaaaa-aa"),
    subaccount: [],
  };

  describe("getTransactions", () => {
    it("returns transactions", async () => {
      const transaction: IcrcIndexNgDid.Transaction = {
        kind: "transfer",
        timestamp: BigInt(12354),
        burn: [],
        mint: [],
        transfer: [
          {
            to: fakeCandidAccount,
            from: fakeCandidAccount,
            memo: [],
            created_at_time: [BigInt(123)],
            amount: BigInt(33),
            fee: [BigInt(10)],
            spender: [
              {
                owner: Principal.fromText("aaaaa-aa"),
                subaccount: [],
              },
            ],
          },
        ],
        approve: [],
        fee_collector: [],
      };
      const transactionWithId = {
        id: BigInt(1),
        transaction,
      };
      const service = mock<ActorSubclass<IcrcIndexNgService>>();
      service.get_account_transactions.mockResolvedValue({
        Ok: {
          transactions: [transactionWithId],
          oldest_tx_id: [],
          balance: 123n,
        },
      });

      const canister = IcrcIndexNgCanister.create({
        canisterId: indexCanisterIdMock,
        certifiedServiceOverride: service,
      });
      const res = await canister.getTransactions({
        account: fakeSnsAccount,
        max_results: BigInt(10),
      });

      expect(res.transactions).toEqual([transactionWithId]);
    });

    it("raises error when Err in response", async () => {
      const service = mock<ActorSubclass<IcrcIndexNgService>>();
      service.get_account_transactions.mockResolvedValue({
        Err: {
          message: "Test error",
        },
      });

      const canister = IcrcIndexNgCanister.create({
        canisterId: indexCanisterIdMock,
        certifiedServiceOverride: service,
      });
      const call = () =>
        canister.getTransactions({
          account: fakeSnsAccount,
          max_results: BigInt(10),
        });

      await expect(call).rejects.toThrowError(IndexError);
    });
  });

  describe("balance", () => {
    it("should return the balance of main account", async () => {
      const service = mock<ActorSubclass<IcrcIndexNgService>>();
      const balance = BigInt(100);
      service.icrc1_balance_of.mockResolvedValue(balance);

      const canister = IcrcIndexNgCanister.create({
        canisterId: indexCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const owner = Principal.fromText("aaaaa-aa");
      const res = await canister.balance({
        owner,
      });

      expect(service.icrc1_balance_of).toHaveBeenCalled();
      expect(res).toEqual(balance);
    });

    it("should return the balance of subaccount", async () => {
      const service = mock<ActorSubclass<IcrcIndexNgService>>();
      const balance = BigInt(100);
      service.icrc1_balance_of.mockResolvedValue(balance);

      const canister = IcrcIndexNgCanister.create({
        canisterId: indexCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const owner = Principal.fromText("aaaaa-aa");
      const subaccount = arrayOfNumberToUint8Array([0, 0, 1]);
      const res = await canister.balance({
        owner,
        subaccount,
      });

      expect(res).toEqual(balance);
    });
  });

  describe("ledger_id", () => {
    it("should return the ledger ID associated with the index canister", async () => {
      const service = mock<ActorSubclass<IcrcIndexNgService>>();
      service.ledger_id.mockResolvedValue(ledgerCanisterIdMock);

      const canister = IcrcIndexNgCanister.create({
        canisterId: indexCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const res = await canister.ledgerId({});

      expect(res).toEqual(ledgerCanisterIdMock);
    });
  });

  describe("status", () => {
    it("should return the status of the index canister", async () => {
      const mockStatus: IcrcIndexNgDid.Status = {
        num_blocks_synced: 12_345n,
      };

      const service = mock<ActorSubclass<IcrcIndexNgService>>();
      service.status.mockResolvedValue(mockStatus);

      const canister = IcrcIndexNgCanister.create({
        canisterId: indexCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const res = await canister.status({});

      expect(res).toEqual(mockStatus);
    });
  });

  describe("listSubaccounts", () => {
    const mockSubaccounts: IcrcIndexNgDid.SubAccount[] = [
      new Uint8Array([1, 2, 3, 4]),
      new Uint8Array([5, 6, 7, 8]),
    ];

    it("should return the list of subaccounts for an owner", async () => {
      const service = mock<ActorSubclass<IcrcIndexNgService>>();
      service.list_subaccounts.mockResolvedValue(mockSubaccounts);

      const canister = IcrcIndexNgCanister.create({
        canisterId: indexCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const owner = mockPrincipal;
      const res = await canister.listSubaccounts({
        owner,
      });

      expect(service.list_subaccounts).toHaveBeenCalledExactlyOnceWith({
        owner,
        start: [],
      });
      expect(res).toEqual(mockSubaccounts);
    });

    it("should pass the start parameter when provided", async () => {
      const service = mock<ActorSubclass<IcrcIndexNgService>>();
      service.list_subaccounts.mockResolvedValue(mockSubaccounts);

      const canister = IcrcIndexNgCanister.create({
        canisterId: indexCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const owner = mockPrincipal;
      const startSubaccount = new Uint8Array([1, 2, 3, 4]);

      const res = await canister.listSubaccounts({
        owner,
        start: startSubaccount,
        certified: true,
      });

      expect(service.list_subaccounts).toHaveBeenCalledExactlyOnceWith({
        owner,
        start: [startSubaccount],
      });
      expect(res).toEqual(mockSubaccounts);
    });
  });
});
