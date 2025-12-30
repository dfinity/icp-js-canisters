import { toNullable } from "@dfinity/utils";
import type { ActorSubclass } from "@icp-sdk/core/agent";
import { Principal } from "@icp-sdk/core/principal";
import { mock } from "vitest-mock-extended";
import type { CyclesLedgerDid, CyclesLedgerService } from "../../declarations";
import { CyclesLedgerCanister } from "./cycles-ledger.canister";
import type { WithdrawParams } from "./types/cycles-ledger.params";
import type { WithdrawResult } from "./types/cycles-ledger.responses";

describe("CyclesLedgerCanister", () => {
  const createCertifiedCyclesLedger = (
    service: ActorSubclass<CyclesLedgerService>,
  ): CyclesLedgerCanister =>
    CyclesLedgerCanister.create({
      certifiedServiceOverride: service,
    });

  const mockCanisterId = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");

  describe("withdraw", () => {
    const success: WithdrawResult = {
      Ok: 12367934n,
    };

    const args: WithdrawParams = {
      amount: 1_000_000n,
      to: mockCanisterId,
    };

    const requestArgs: CyclesLedgerDid.WithdrawArgs = {
      ...args,
      from_subaccount: [],
      created_at_time: [],
    };

    it("should return Ok", async () => {
      const service = mock<ActorSubclass<CyclesLedgerService>>();
      service.withdraw.mockResolvedValue(success);

      const { withdraw } = createCertifiedCyclesLedger(service);

      const result = await withdraw(args);

      expect(service.withdraw).toHaveBeenCalledWith(requestArgs);
      expect(result).toEqual(success);
    });

    it("should return Ok with from_subaccount", async () => {
      const argsWithSubaccount: WithdrawParams = {
        ...args,
        fromSubaccount: new Uint8Array([0, 0, 1]),
      };

      const service = mock<ActorSubclass<CyclesLedgerService>>();
      service.withdraw.mockResolvedValue(success);

      const { withdraw } = createCertifiedCyclesLedger(service);

      const result = await withdraw(argsWithSubaccount);

      expect(service.withdraw).toHaveBeenCalledWith({
        ...requestArgs,
        from_subaccount: toNullable(argsWithSubaccount.fromSubaccount),
      });
      expect(result).toEqual(success);
    });

    it("should return Ok with created_at_time", async () => {
      const argsWithTimestamp: WithdrawParams = {
        ...args,
        createdAtTime: 1234567890n,
      };

      const service = mock<ActorSubclass<CyclesLedgerService>>();
      service.withdraw.mockResolvedValue(success);

      const { withdraw } = createCertifiedCyclesLedger(service);

      const result = await withdraw(argsWithTimestamp);

      expect(service.withdraw).toHaveBeenCalledWith({
        ...requestArgs,
        created_at_time: toNullable(argsWithTimestamp.createdAtTime),
      });
      expect(result).toEqual(success);
    });

    it("should bubble errors", async () => {
      const service = mock<ActorSubclass<CyclesLedgerService>>();
      service.withdraw.mockImplementation(() => {
        throw new Error();
      });

      const { withdraw } = createCertifiedCyclesLedger(service);

      const call = async () => await withdraw(args);

      await expect(call).rejects.toThrowError();
    });

    it.each([
      {
        name: "InsufficientFunds",
        error: { Err: { InsufficientFunds: { balance: 500_000n } } },
      },
      {
        name: "GenericError",
        error: {
          Err: {
            GenericError: { message: "Something went wrong", error_code: 1n },
          },
        },
      },
      {
        name: "BadFee",
        error: { Err: { BadFee: { expected_fee: 10_000n } } },
      },
      {
        name: "Duplicate",
        error: { Err: { Duplicate: { duplicate_of: 123n } } },
      },
      {
        name: "InvalidReceiver",
        error: { Err: { InvalidReceiver: { receiver: mockCanisterId } } },
      },
      {
        name: "CreatedInFuture",
        error: { Err: { CreatedInFuture: { ledger_time: 9999999999n } } },
      },
      {
        name: "TooOld",
        error: { Err: { TooOld: null } },
      },
      {
        name: "TemporarilyUnavailable",
        error: { Err: { TemporarilyUnavailable: null } },
      },
      {
        name: "FailedToWithdraw",
        error: {
          Err: {
            FailedToWithdraw: {
              rejection_code: 4,
              fee_block: [456n],
              rejection_reason: "Canister rejected the call",
            },
          },
        },
      },
    ])("should return Err with $name", async ({ error }) => {
      const service = mock<ActorSubclass<CyclesLedgerService>>();
      service.withdraw.mockResolvedValue(error as WithdrawResult);

      const { withdraw } = createCertifiedCyclesLedger(service);

      const result = await withdraw(args);

      expect(service.withdraw).toHaveBeenCalledWith(requestArgs);
      expect(result).toEqual(error);
    });
  });
});
