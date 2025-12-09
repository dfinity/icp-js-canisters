import type { ActorSubclass } from "@icp-sdk/core/agent";
import { Principal } from "@icp-sdk/core/principal";
import { mock } from "vitest-mock-extended";
import type { IcrcIndexDid, IcrcIndexService } from "../../declarations";
import { IndexError } from "./errors/index.errors";
import { IcrcIndexCanister } from "./index.canister";
import { indexCanisterIdMock, ledgerCanisterIdMock } from "./mocks/ledger.mock";
import type { IcrcAccount } from "./types/ledger.responses";

describe("Index canister", () => {
  afterEach(() => vi.clearAllMocks());

  const fakeSnsAccount: IcrcAccount = {
    owner: Principal.fromText("aaaaa-aa"),
  };

  const fakeCandidAccount: IcrcIndexDid.Account = {
    owner: Principal.fromText("aaaaa-aa"),
    subaccount: [],
  };

  describe("getTransactions", () => {
    it("returns transactions", async () => {
      const transaction: IcrcIndexDid.Transaction = {
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
      };
      const transactionWithId = {
        id: BigInt(1),
        transaction,
      };
      const service = mock<ActorSubclass<IcrcIndexService>>();
      service.get_account_transactions.mockResolvedValue({
        Ok: {
          transactions: [transactionWithId],
          oldest_tx_id: [],
        },
      });

      const canister = IcrcIndexCanister.create({
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
      const service = mock<ActorSubclass<IcrcIndexService>>();
      service.get_account_transactions.mockResolvedValue({
        Err: {
          message: "Test error",
        },
      });

      const canister = IcrcIndexCanister.create({
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

  describe("ledgerId", () => {
    it("should return ledger id", async () => {
      const service = mock<ActorSubclass<IcrcIndexService>>();
      service.ledger_id.mockResolvedValue(ledgerCanisterIdMock);

      const canister = IcrcIndexCanister.create({
        canisterId: indexCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const result = await canister.ledgerId({
        certified: true,
      });

      expect(result).toEqual(ledgerCanisterIdMock);
    });
  });
});
