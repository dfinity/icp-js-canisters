import { arrayOfNumberToUint8Array, toNullable } from "@dfinity/utils";
import type { ActorSubclass } from "@icp-sdk/core/agent";
import { Principal } from "@icp-sdk/core/principal";
import { mock } from "vitest-mock-extended";
import type { CkDogeMinterDid, CkDogeMinterService } from "../declarations";
import type { MinterInfo } from "../declarations/ckdoge/minter";
import {
  MinterAlreadyProcessingError,
  MinterAmountTooHighError,
  MinterAmountTooLowError,
  MinterEstimateWithdrawalFeeError,
  MinterGenericError,
  MinterInsufficientAllowanceError,
  MinterInsufficientFundsError,
  MinterMalformedAddressError,
  MinterNoNewUtxosError,
  MinterRetrieveDogeWithApprovalError,
  MinterTemporaryUnavailableError,
  MinterUpdateBalanceError,
} from "./errors/minter.errors";
import { CkDogeMinterCanister } from "./minter.canister";
import { dogecoinAddressMock, minterCanisterIdMock } from "./mocks/minter.mock";
import type { UpdateBalanceOk } from "./types/minter.responses";

describe("ckDOGE minter canister", () => {
  const minter = (
    service: ActorSubclass<CkDogeMinterService>,
  ): CkDogeMinterCanister =>
    CkDogeMinterCanister.create({
      canisterId: minterCanisterIdMock,
      certifiedServiceOverride: service,
    });

  const nonCertifiedMinter = (
    service: ActorSubclass<CkDogeMinterService>,
  ): CkDogeMinterCanister =>
    CkDogeMinterCanister.create({
      canisterId: minterCanisterIdMock,
      serviceOverride: service,
    });

  describe("DOGE address", () => {
    it("should return the DOGE address of main account", async () => {
      const service = mock<ActorSubclass<CkDogeMinterService>>();
      service.get_doge_address.mockResolvedValue(dogecoinAddressMock);

      const canister = minter(service);

      const owner = Principal.fromText("aaaaa-aa");
      const res = await canister.getDogeAddress({
        owner,
      });

      expect(service.get_doge_address).toHaveBeenCalled();
      expect(res).toEqual(dogecoinAddressMock);
    });

    it("should return a DOGE address if a subaccount is provided", async () => {
      const service = mock<ActorSubclass<CkDogeMinterService>>();
      const address = "a_doge_address_with_subaccount";
      service.get_doge_address.mockResolvedValue(address);

      const canister = minter(service);

      const owner = Principal.fromText("aaaaa-aa");
      const subaccount = arrayOfNumberToUint8Array([0, 0, 1]);
      const res = await canister.getDogeAddress({
        owner,
        subaccount,
      });

      expect(res).toEqual(address);
    });

    it("should bubble errors", () => {
      const service = mock<ActorSubclass<CkDogeMinterService>>();
      service.get_doge_address.mockImplementation(() => {
        throw new Error();
      });

      const canister = minter(service);

      const owner = Principal.fromText("aaaaa-aa");

      expect(() =>
        canister.getDogeAddress({
          owner,
        }),
      ).toThrowError();
    });
  });

  describe("Update balance", () => {
    const success: UpdateBalanceOk = [
      {
        Checked: {
          height: 123,
          value: 123n,
          outpoint: { txid: arrayOfNumberToUint8Array([0, 0, 1]), vout: 123 },
        },
      },
    ];
    const ok = { Ok: success };

    it("should return Ok", async () => {
      const service = mock<ActorSubclass<CkDogeMinterService>>();
      service.update_balance.mockResolvedValue(ok);

      const canister = minter(service);

      const owner = Principal.fromText("aaaaa-aa");
      const res = await canister.updateBalance({
        owner,
      });

      expect(service.update_balance).toHaveBeenCalled();
      expect(res).toEqual(success);
    });

    it("should return Ok if a subaccount is provided", async () => {
      const service = mock<ActorSubclass<CkDogeMinterService>>();
      service.update_balance.mockResolvedValue(ok);

      const canister = minter(service);

      const owner = Principal.fromText("aaaaa-aa");
      const subaccount = arrayOfNumberToUint8Array([0, 0, 1]);
      const res = await canister.updateBalance({
        owner,
        subaccount,
      });

      expect(res).toEqual(success);
    });

    it("should throw MinterGenericError", async () => {
      const service = mock<ActorSubclass<CkDogeMinterService>>();

      const error = {
        Err: { GenericError: { error_message: "message", error_code: 1n } },
      };
      service.update_balance.mockResolvedValue(error);

      const canister = minter(service);

      const owner = Principal.fromText("aaaaa-aa");

      const call = () =>
        canister.updateBalance({
          owner,
        });

      await expect(call).rejects.toThrowError(
        new MinterGenericError(
          `${error.Err.GenericError.error_message} (${error.Err.GenericError.error_code})`,
        ),
      );
    });

    it("should throw MinterTemporarilyUnavailable", async () => {
      const service = mock<ActorSubclass<CkDogeMinterService>>();

      const error = { Err: { TemporarilyUnavailable: "unavailable" } };
      service.update_balance.mockResolvedValue(error);

      const canister = minter(service);

      const owner = Principal.fromText("aaaaa-aa");

      const call = () =>
        canister.updateBalance({
          owner,
        });

      await expect(call).rejects.toThrowError(
        new MinterTemporaryUnavailableError(error.Err.TemporarilyUnavailable),
      );
    });

    it("should throw MinterAlreadyProcessingError", async () => {
      const service = mock<ActorSubclass<CkDogeMinterService>>();

      const error = { Err: { AlreadyProcessing: null } };
      service.update_balance.mockResolvedValue(error);

      const canister = minter(service);

      const owner = Principal.fromText("aaaaa-aa");

      const call = () =>
        canister.updateBalance({
          owner,
        });

      await expect(call).rejects.toThrowError(
        new MinterAlreadyProcessingError(),
      );
    });

    it("should throw MinterNoNewUtxosError", async () => {
      const service = mock<ActorSubclass<CkDogeMinterService>>();
      const pendingUtxo = {
        confirmations: 3,
        value: 3_2000_000n,
        outpoint: {
          txid: new Uint8Array([6, 5, 2, 7]),
          vout: 1,
        },
      };

      const error = {
        Err: {
          NoNewUtxos: {
            required_confirmations: 123,
            current_confirmations: toNullable(456),
            pending_utxos: [[pendingUtxo]],
          },
        } as CkDogeMinterDid.UpdateBalanceError,
      };
      service.update_balance.mockResolvedValue(error);

      const canister = minter(service);

      const owner = Principal.fromText("aaaaa-aa");

      const call = () =>
        canister.updateBalance({
          owner,
        });

      await expect(call).rejects.toThrowError(
        new MinterNoNewUtxosError({
          pending_utxos: [[pendingUtxo]],
          required_confirmations: 123,
        }),
      );
    });

    it("should throw MinterNoNewUtxosError without pending UTXOs", async () => {
      const service = mock<ActorSubclass<CkDogeMinterService>>();
      const error = {
        Err: {
          NoNewUtxos: {
            required_confirmations: 123,
            current_confirmations: toNullable(456),
            pending_utxos: [],
          },
        } as CkDogeMinterDid.UpdateBalanceError,
      };
      service.update_balance.mockResolvedValue(error);

      const canister = minter(service);

      const owner = Principal.fromText("aaaaa-aa");

      const call = () =>
        canister.updateBalance({
          owner,
        });

      await expect(call).rejects.toThrowError(
        new MinterNoNewUtxosError({
          pending_utxos: [],
          required_confirmations: 123,
        }),
      );
    });

    it("should throw unsupported response", async () => {
      const service = mock<ActorSubclass<CkDogeMinterService>>();

      const error = {
        Err: { Test: null } as unknown as CkDogeMinterDid.UpdateBalanceError,
      };
      service.update_balance.mockResolvedValue(error);

      const canister = minter(service);

      const owner = Principal.fromText("aaaaa-aa");

      const call = () =>
        canister.updateBalance({
          owner,
        });

      await expect(call).rejects.toThrowError(
        new MinterUpdateBalanceError(
          `Unsupported response type in minter.updateBalance ${JSON.stringify(
            error.Err,
          )}`,
        ),
      );
    });
  });

  describe("Retrieve DOGE with approval", () => {
    const success: CkDogeMinterDid.RetrieveDogeOk = {
      block_index: 1n,
    };
    const ok = { Ok: success };

    const params = {
      address: dogecoinAddressMock,
      amount: 123_000n,
    };

    it("should return Ok", async () => {
      const service = mock<ActorSubclass<CkDogeMinterService>>();
      service.retrieve_doge_with_approval.mockResolvedValue(ok);

      const canister = minter(service);

      const res = await canister.retrieveDogeWithApproval(params);

      expect(
        service.retrieve_doge_with_approval,
      ).toHaveBeenCalledExactlyOnceWith({
        ...params,
        from_subaccount: [],
      });
      expect(res).toEqual(success);
    });

    it("should return Ok with fromSubaccount", async () => {
      const fromSubaccount = new Uint8Array([3, 4, 5]);
      const service = mock<ActorSubclass<CkDogeMinterService>>();
      service.retrieve_doge_with_approval.mockResolvedValue(ok);

      const canister = minter(service);

      const res = await canister.retrieveDogeWithApproval({
        ...params,
        fromSubaccount,
      });

      expect(
        service.retrieve_doge_with_approval,
      ).toHaveBeenCalledExactlyOnceWith({
        ...params,
        from_subaccount: [fromSubaccount],
      });
      expect(res).toEqual(success);
    });

    it("should throw MinterGenericError", async () => {
      const service = mock<ActorSubclass<CkDogeMinterService>>();

      const error = {
        Err: { GenericError: { error_message: "message", error_code: 1n } },
      };
      service.retrieve_doge_with_approval.mockResolvedValue(error);

      const canister = minter(service);

      const call = () => canister.retrieveDogeWithApproval(params);

      await expect(call).rejects.toThrowError(
        new MinterGenericError(
          `${error.Err.GenericError.error_message} (${error.Err.GenericError.error_code})`,
        ),
      );
    });

    it("should throw MinterTemporarilyUnavailable", async () => {
      const service = mock<ActorSubclass<CkDogeMinterService>>();

      const error = { Err: { TemporarilyUnavailable: "unavailable" } };
      service.retrieve_doge_with_approval.mockResolvedValue(error);

      const canister = minter(service);

      const call = () => canister.retrieveDogeWithApproval(params);

      await expect(call).rejects.toThrowError(
        new MinterTemporaryUnavailableError(error.Err.TemporarilyUnavailable),
      );
    });

    it("should throw MinterAlreadyProcessingError", async () => {
      const service = mock<ActorSubclass<CkDogeMinterService>>();

      const error = { Err: { AlreadyProcessing: null } };
      service.retrieve_doge_with_approval.mockResolvedValue(error);

      const canister = minter(service);

      const call = () => canister.retrieveDogeWithApproval(params);

      await expect(call).rejects.toThrowError(
        new MinterAlreadyProcessingError(),
      );
    });

    it("should throw MinterMalformedAddress", async () => {
      const service = mock<ActorSubclass<CkDogeMinterService>>();

      const error = { Err: { MalformedAddress: "malformated" } };
      service.retrieve_doge_with_approval.mockResolvedValue(error);

      const canister = minter(service);

      const call = () => canister.retrieveDogeWithApproval(params);

      await expect(call).rejects.toThrowError(
        new MinterMalformedAddressError(error.Err.MalformedAddress),
      );
    });

    it("should throw MinterAmountTooLowError", async () => {
      const service = mock<ActorSubclass<CkDogeMinterService>>();

      const error = { Err: { AmountTooLow: 123n } };
      service.retrieve_doge_with_approval.mockResolvedValue(error);

      const canister = minter(service);

      const call = () => canister.retrieveDogeWithApproval(params);

      await expect(call).rejects.toThrowError(
        new MinterAmountTooLowError(`${error.Err.AmountTooLow}`),
      );
    });

    it("should throw MinterInsufficientFundsError", async () => {
      const service = mock<ActorSubclass<CkDogeMinterService>>();

      const error = { Err: { InsufficientFunds: { balance: 123n } } };
      service.retrieve_doge_with_approval.mockResolvedValue(error);

      const canister = minter(service);

      const call = () => canister.retrieveDogeWithApproval(params);

      await expect(call).rejects.toThrowError(
        new MinterInsufficientFundsError(
          `${error.Err.InsufficientFunds.balance}`,
        ),
      );
    });

    it("should throw MinterInsufficientAllowanceError", async () => {
      const service = mock<ActorSubclass<CkDogeMinterService>>();

      const error = { Err: { InsufficientAllowance: { allowance: 123n } } };
      service.retrieve_doge_with_approval.mockResolvedValue(error);

      const canister = minter(service);

      const call = () => canister.retrieveDogeWithApproval(params);

      await expect(call).rejects.toThrowError(
        new MinterInsufficientAllowanceError(
          `${error.Err.InsufficientAllowance.allowance}`,
        ),
      );
    });

    it("should throw unsupported response", async () => {
      const service = mock<ActorSubclass<CkDogeMinterService>>();

      const error = {
        Err: {
          Test: null,
        } as unknown as CkDogeMinterDid.RetrieveDogeWithApprovalError,
      };
      service.retrieve_doge_with_approval.mockResolvedValue(error);

      const canister = minter(service);

      const call = () => canister.retrieveDogeWithApproval(params);

      await expect(call).rejects.toThrowError(
        new MinterRetrieveDogeWithApprovalError(
          `Unsupported response type in minter.updateBalance ${JSON.stringify(
            error.Err,
          )}`,
        ),
      );
    });
  });

  describe("Retrieve DOGE status", () => {
    it("should return status", async () => {
      const submittedStatus = {
        Submitted: { txid: new Uint8Array([3, 2, 6]) },
      } as CkDogeMinterDid.RetrieveDogeStatus;

      const service = mock<ActorSubclass<CkDogeMinterService>>();
      service.retrieve_doge_status.mockResolvedValue(submittedStatus);
      const transactionId = 481n;

      const canister = minter(service);

      const res = await canister.retrieveDogeStatus({
        transactionId,
        certified: true,
      });

      expect(service.retrieve_doge_status).toHaveBeenCalledExactlyOnceWith({
        block_index: transactionId,
      });
      expect(res).toEqual(submittedStatus);
    });

    it("should use non-certified service", async () => {
      const submittedStatus = {
        Submitted: { txid: new Uint8Array([9, 7, 5]) },
      } as CkDogeMinterDid.RetrieveDogeStatus;

      const service = mock<ActorSubclass<CkDogeMinterService>>();
      service.retrieve_doge_status.mockResolvedValue(submittedStatus);
      const transactionId = 382n;

      const canister = nonCertifiedMinter(service);

      const res = await canister.retrieveDogeStatus({
        transactionId,
        certified: false,
      });

      expect(service.retrieve_doge_status).toHaveBeenCalledExactlyOnceWith({
        block_index: transactionId,
      });
      expect(res).toEqual(submittedStatus);
    });
  });

  describe("Estimate Withdrawal Fee", () => {
    it("should return estimated fee", async () => {
      const success = { minter_fee: 123n, dogecoin_fee: 456n };

      const service = mock<ActorSubclass<CkDogeMinterService>>();
      service.estimate_withdrawal_fee.mockResolvedValue({ Ok: success });

      const canister = minter(service);

      const res = await canister.estimateWithdrawalFee({
        certified: true,
        amount: undefined,
      });

      expect(service.estimate_withdrawal_fee).toHaveBeenCalled();
      expect(res).toEqual(success);
    });

    it("should throw MinterAmountTooHighError", async () => {
      const service = mock<ActorSubclass<CkDogeMinterService>>();

      const error = { Err: { AmountTooHigh: null } };
      service.estimate_withdrawal_fee.mockResolvedValue(error);

      const canister = minter(service);

      const call = () =>
        canister.estimateWithdrawalFee({
          certified: true,
          amount: 999_999_999n,
        });

      await expect(call).rejects.toThrowError(
        new MinterAmountTooHighError("Amount too high"),
      );
    });

    it("should throw MinterAmountTooLowError", async () => {
      const service = mock<ActorSubclass<CkDogeMinterService>>();

      const error = { Err: { AmountTooLow: { min_amount: 100_000n } } };
      service.estimate_withdrawal_fee.mockResolvedValue(error);

      const canister = minter(service);

      const call = () =>
        canister.estimateWithdrawalFee({
          certified: true,
          amount: 1n,
        });

      await expect(call).rejects.toThrowError(
        new MinterAmountTooLowError(
          `Amount too low, minimum: ${error.Err.AmountTooLow.min_amount}`,
        ),
      );
    });

    it("should throw unsupported response", async () => {
      const service = mock<ActorSubclass<CkDogeMinterService>>();

      const error = {
        Err: {
          Test: null,
        } as unknown as CkDogeMinterDid.EstimateWithdrawalFeeError,
      };
      service.estimate_withdrawal_fee.mockResolvedValue(error);

      const canister = minter(service);

      const call = () =>
        canister.estimateWithdrawalFee({
          certified: true,
          amount: 100n,
        });

      await expect(call).rejects.toThrowError(
        new MinterEstimateWithdrawalFeeError(
          `Unsupported response type in minter.estimateWithdrawalFee ${JSON.stringify(
            error.Err,
          )}`,
        ),
      );
    });

    it("should bubble errors", async () => {
      const service = mock<ActorSubclass<CkDogeMinterService>>();
      service.estimate_withdrawal_fee.mockImplementation(() => {
        throw new Error();
      });

      const canister = minter(service);

      await expect(
        async () =>
          await canister.estimateWithdrawalFee({
            certified: true,
            amount: undefined,
          }),
      ).rejects.toThrowError();
    });
  });

  describe("Minter Info", () => {
    it("should return minter info", async () => {
      const result: MinterInfo = {
        retrieve_doge_min_amount: 1n,
        min_confirmations: 12,
        deposit_doge_min_amount: 77n,
      };

      const service = mock<ActorSubclass<CkDogeMinterService>>();
      service.get_minter_info.mockResolvedValue(result);

      const canister = minter(service);

      const res = await canister.getMinterInfo({
        certified: true,
      });

      expect(service.get_minter_info).toHaveBeenCalled();
      expect(res).toEqual(result);
    });

    it("should bubble errors", async () => {
      const service = mock<ActorSubclass<CkDogeMinterService>>();
      service.get_minter_info.mockImplementation(() => {
        throw new Error();
      });

      const canister = minter(service);

      await expect(
        async () => await canister.getMinterInfo({ certified: true }),
      ).rejects.toThrowError();
    });
  });

  describe("Known utxos", () => {
    const utxosMock: CkDogeMinterDid.Utxo[] = [
      {
        height: 123,
        value: 123n,
        outpoint: { txid: arrayOfNumberToUint8Array([0, 0, 1]), vout: 123 },
      },
      {
        height: 456,
        value: 456n,
        outpoint: { txid: arrayOfNumberToUint8Array([1, 2, 1]), vout: 456 },
      },
    ];

    it("should return the known utxos of main account", async () => {
      const service = mock<ActorSubclass<CkDogeMinterService>>();
      service.get_known_utxos.mockResolvedValue(utxosMock);

      const canister = minter(service);

      const owner = Principal.fromText("aaaaa-aa");
      const res = await canister.getKnownUtxos({
        owner,
      });

      expect(service.get_known_utxos).toHaveBeenCalledWith({
        owner: toNullable(owner),
        subaccount: [],
      });
      expect(res).toEqual(utxosMock);
    });

    it("should return known utcos if a subaccount is provided", async () => {
      const service = mock<ActorSubclass<CkDogeMinterService>>();
      service.get_known_utxos.mockResolvedValue(utxosMock);

      const canister = minter(service);

      const owner = Principal.fromText("aaaaa-aa");
      const subaccount = arrayOfNumberToUint8Array([0, 0, 1]);
      const res = await canister.getKnownUtxos({
        owner,
        subaccount,
      });

      expect(service.get_known_utxos).toHaveBeenCalledWith({
        owner: toNullable(owner),
        subaccount: [subaccount],
      });
      expect(res).toEqual(utxosMock);
    });

    it("should bubble errors", () => {
      const service = mock<ActorSubclass<CkDogeMinterService>>();
      service.get_known_utxos.mockImplementation(() => {
        throw new Error();
      });

      const canister = minter(service);

      const owner = Principal.fromText("aaaaa-aa");

      expect(() =>
        canister.getKnownUtxos({
          owner,
        }),
      ).toThrowError();
    });
  });

  describe("Canister status", () => {
    it("should return canister status", async () => {
      const result = {
        status: { running: null },
        memory_size: 1_000_000n,
        cycles: 500_000_000n,
        version: 1n,
        ready_for_migration: false,
        settings: {
          freezing_threshold: 0n,
          wasm_memory_threshold: 0n,
          environment_variables: [],
          controllers: [],
          reserved_cycles_limit: 0n,
          log_visibility: { controllers: null },
          wasm_memory_limit: 0n,
          memory_allocation: 0n,
          compute_allocation: 0n,
        },
        query_stats: {
          response_payload_bytes_total: 0n,
          num_instructions_total: 0n,
          num_calls_total: 0n,
          request_payload_bytes_total: 0n,
        },
        idle_cycles_burned_per_day: 0n,
        module_hash: [],
        reserved_cycles: 0n,
        memory_metrics: {
          wasm_binary_size: 0n,
          wasm_chunk_store_size: 0n,
          canister_history_size: 0n,
          stable_memory_size: 0n,
          snapshots_size: 0n,
          wasm_memory_size: 0n,
          global_memory_size: 0n,
          custom_sections_size: 0n,
        },
      } as CkDogeMinterDid.CanisterStatusResponse;

      const service = mock<ActorSubclass<CkDogeMinterService>>();
      service.get_canister_status.mockResolvedValue(result);

      const canister = minter(service);

      const res = await canister.getCanisterStatus({
        certified: true,
      });

      expect(service.get_canister_status).toHaveBeenCalled();
      expect(res).toEqual(result);
    });

    it("should bubble errors", async () => {
      const service = mock<ActorSubclass<CkDogeMinterService>>();
      service.get_canister_status.mockImplementation(() => {
        throw new Error();
      });

      const canister = minter(service);

      await expect(
        async () => await canister.getCanisterStatus({ certified: true }),
      ).rejects.toThrowError();
    });
  });
});
