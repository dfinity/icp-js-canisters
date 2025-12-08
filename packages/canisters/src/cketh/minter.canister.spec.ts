import { arrayOfNumberToUint8Array, toNullable } from "@dfinity/utils";
import type { ActorSubclass } from "@icp-sdk/core/agent";
import { Principal } from "@icp-sdk/core/principal";
import { mock } from "vitest-mock-extended";
import type {
  _SERVICE as CkETHMinterService,
  MinterInfo,
  RetrieveErc20Request,
  RetrieveEthRequest,
} from "../declarations/cketh/minter";
import {
  LedgerAmountTooLowError,
  LedgerInsufficientAllowanceError,
  LedgerInsufficientFundsError,
  LedgerTemporaryUnavailableError,
  LedgerWithdrawalError,
  MinterAmountTooLowError,
  MinterError,
  MinterInsufficientAllowanceError,
  MinterInsufficientFundsError,
  MinterRecipientAddressBlockedError,
  MinterTemporaryUnavailableError,
  MinterTokenNotSupported,
} from "./errors/minter.errors";
import { CkETHMinterCanister } from "./minter.canister";
import {
  ckETHSmartContractAddressMock,
  ethAddressMock,
  ledgerCanisterIdMock,
  minterCanisterIdMock,
} from "./mocks/minter.mock";

describe("ckETH minter canister", () => {
  const minter = (
    service: ActorSubclass<CkETHMinterService>,
  ): CkETHMinterCanister =>
    CkETHMinterCanister.create({
      canisterId: minterCanisterIdMock,
      certifiedServiceOverride: service,
    });

  const nonCertifiedMinter = (
    service: ActorSubclass<CkETHMinterService>,
  ): CkETHMinterCanister =>
    CkETHMinterCanister.create({
      canisterId: minterCanisterIdMock,
      serviceOverride: service,
    });

  const gasFeeEstimate = {
    max_priority_fee_per_gas: 123n,
    max_fee_per_gas: 456n,
    max_transaction_fee: 7n,
  };

  describe("Smart contract address", () => {
    it("should return the helper smart contract address", async () => {
      const service = mock<ActorSubclass<CkETHMinterService>>();
      service.smart_contract_address.mockResolvedValue(
        ckETHSmartContractAddressMock,
      );

      const canister = minter(service);

      const res = await canister.getSmartContractAddress();

      expect(service.smart_contract_address).toHaveBeenCalled();
      expect(res).toEqual(ckETHSmartContractAddressMock);
    });

    it("should bubble errors", () => {
      const service = mock<ActorSubclass<CkETHMinterService>>();
      service.smart_contract_address.mockImplementation(() => {
        throw new Error();
      });

      const canister = minter(service);

      expect(() => canister.getSmartContractAddress()).toThrowError();
    });
  });

  describe("Withdraw ETH", () => {
    const success: RetrieveEthRequest = {
      block_index: 1n,
    };
    const ok = { Ok: success };

    const params = {
      address: ethAddressMock,
      amount: 123_000n,
    };

    it("should return Ok", async () => {
      const service = mock<ActorSubclass<CkETHMinterService>>();
      service.withdraw_eth.mockResolvedValue(ok);

      const canister = minter(service);

      const res = await canister.withdrawEth(params);

      const { address, ...rest } = params;

      expect(service.withdraw_eth).toHaveBeenCalledExactlyOnceWith({
        recipient: address,
        from_subaccount: toNullable(),
        ...rest,
      });

      expect(res).toEqual(success);
    });

    it("should call with subaccount numbers", async () => {
      const service = mock<ActorSubclass<CkETHMinterService>>();
      service.withdraw_eth.mockResolvedValue(ok);

      const canister = minter(service);

      const fromSubaccount = arrayOfNumberToUint8Array([1, 2, 3]);

      await canister.withdrawEth({
        ...params,
        fromSubaccount,
      });

      const { address, ...rest } = params;

      expect(service.withdraw_eth).toHaveBeenCalledExactlyOnceWith({
        recipient: address,
        from_subaccount: toNullable(fromSubaccount),
        ...rest,
      });
    });

    it("should call with subaccount uintarray", async () => {
      const service = mock<ActorSubclass<CkETHMinterService>>();
      service.withdraw_eth.mockResolvedValue(ok);

      const canister = minter(service);

      const fromSubaccount = arrayOfNumberToUint8Array([1, 2, 3]);

      await canister.withdrawEth({
        ...params,
        fromSubaccount,
      });

      const { address, ...rest } = params;

      expect(service.withdraw_eth).toHaveBeenCalledExactlyOnceWith({
        recipient: address,
        from_subaccount: toNullable(fromSubaccount),
        ...rest,
      });
    });

    it("should throw MinterTemporarilyUnavailable", async () => {
      const service = mock<ActorSubclass<CkETHMinterService>>();

      const error = { Err: { TemporarilyUnavailable: "unavailable" } };
      service.withdraw_eth.mockResolvedValue(error);

      const canister = minter(service);

      const call = () => canister.withdrawEth(params);

      await expect(call).rejects.toThrowError(
        new MinterTemporaryUnavailableError(error.Err.TemporarilyUnavailable),
      );
    });

    it("should throw MinterAmountTooLowError", async () => {
      const service = mock<ActorSubclass<CkETHMinterService>>();

      const error = { Err: { AmountTooLow: { min_withdrawal_amount: 123n } } };
      service.withdraw_eth.mockResolvedValue(error);

      const canister = minter(service);

      const call = () => canister.withdrawEth(params);

      await expect(call).rejects.toThrowError(
        new MinterAmountTooLowError({
          details: error.Err.AmountTooLow.min_withdrawal_amount,
        }),
      );
    });

    it("should throw MinterRecipientAddressBlockedError", async () => {
      const service = mock<ActorSubclass<CkETHMinterService>>();

      const error = {
        Err: { RecipientAddressBlocked: { address: ethAddressMock } },
      };
      service.withdraw_eth.mockResolvedValue(error);

      const canister = minter(service);

      const call = () => canister.withdrawEth(params);

      await expect(call).rejects.toThrowError(
        new MinterRecipientAddressBlockedError({
          details: error.Err.RecipientAddressBlocked.address,
        }),
      );
    });

    it("should throw MinterInsufficientFundsError", async () => {
      const service = mock<ActorSubclass<CkETHMinterService>>();

      const error = { Err: { InsufficientFunds: { balance: 123n } } };
      service.withdraw_eth.mockResolvedValue(error);

      const canister = minter(service);

      const call = () => canister.withdrawEth(params);

      await expect(call).rejects.toThrowError(
        new MinterInsufficientFundsError({
          details: error.Err.InsufficientFunds.balance,
        }),
      );
    });

    it("should throw MinterInsufficientAllowanceError", async () => {
      const service = mock<ActorSubclass<CkETHMinterService>>();

      const error = { Err: { InsufficientAllowance: { allowance: 123n } } };
      service.withdraw_eth.mockResolvedValue(error);

      const canister = minter(service);

      const call = () => canister.withdrawEth(params);

      await expect(call).rejects.toThrowError(
        new MinterInsufficientAllowanceError({
          details: error.Err.InsufficientAllowance.allowance,
        }),
      );
    });

    it("should throw unsupported response", async () => {
      const service = mock<ActorSubclass<CkETHMinterService>>();

      const error = { Err: { Test: null } as unknown };
      // @ts-expect-error we explicity want the results to throw some error type
      service.withdraw_eth.mockResolvedValue(error);

      const canister = minter(service);

      const call = () => canister.withdrawEth(params);

      await expect(call).rejects.toThrowError(
        new MinterError({
          msg: "Unsupported response type in minter.withdrawEth",
          details: error.Err,
        }),
      );
    });
  });

  describe("Withdraw Erc20", () => {
    const success: RetrieveErc20Request = {
      ckerc20_block_index: 1n,
      cketh_block_index: 2n,
    };
    const ok = { Ok: success };

    const params = {
      address: ethAddressMock,
      ledgerCanisterId: ledgerCanisterIdMock,
      amount: 123_000n,
    };

    const account = arrayOfNumberToUint8Array([7, 8, 9]);

    it("should return Ok", async () => {
      const service = mock<ActorSubclass<CkETHMinterService>>();
      service.withdraw_erc20.mockResolvedValue(ok);

      const canister = minter(service);

      const res = await canister.withdrawErc20(params);

      const { address, ledgerCanisterId: _, ...rest } = params;

      expect(service.withdraw_erc20).toHaveBeenCalledExactlyOnceWith({
        recipient: address,
        ckerc20_ledger_id: ledgerCanisterIdMock,
        from_cketh_subaccount: toNullable(),
        from_ckerc20_subaccount: toNullable(),
        ...rest,
      });

      expect(res).toEqual(success);
    });

    it("should call with ckEth subaccount", async () => {
      const service = mock<ActorSubclass<CkETHMinterService>>();
      service.withdraw_erc20.mockResolvedValue(ok);

      const canister = minter(service);

      await canister.withdrawErc20({
        ...params,
        fromCkEthSubaccount: account,
      });

      const { address, ledgerCanisterId: _, ...rest } = params;

      expect(service.withdraw_erc20).toHaveBeenCalledExactlyOnceWith({
        recipient: address,
        ckerc20_ledger_id: ledgerCanisterIdMock,
        from_cketh_subaccount: toNullable(account),
        from_ckerc20_subaccount: toNullable(),
        ...rest,
      });
    });

    it("should call with ckErc20 subaccount", async () => {
      const service = mock<ActorSubclass<CkETHMinterService>>();
      service.withdraw_erc20.mockResolvedValue(ok);

      const canister = minter(service);

      await canister.withdrawErc20({
        ...params,
        fromCkErc20Subaccount: account,
      });

      const { address, ledgerCanisterId: _, ...rest } = params;

      expect(service.withdraw_erc20).toHaveBeenCalledExactlyOnceWith({
        recipient: address,
        ckerc20_ledger_id: ledgerCanisterIdMock,
        from_cketh_subaccount: toNullable(),
        from_ckerc20_subaccount: toNullable(account),
        ...rest,
      });
    });

    it("should call with ckEth and ckErc20 subaccount", async () => {
      const service = mock<ActorSubclass<CkETHMinterService>>();
      service.withdraw_erc20.mockResolvedValue(ok);

      const canister = minter(service);

      await canister.withdrawErc20({
        ...params,
        fromCkEthSubaccount: account,
        fromCkErc20Subaccount: account,
      });

      const { address, ledgerCanisterId: _, ...rest } = params;

      expect(service.withdraw_erc20).toHaveBeenCalledExactlyOnceWith({
        recipient: address,
        ckerc20_ledger_id: ledgerCanisterIdMock,
        from_cketh_subaccount: toNullable(account),
        from_ckerc20_subaccount: toNullable(account),
        ...rest,
      });
    });

    it("should throw MinterTemporarilyUnavailable", async () => {
      const service = mock<ActorSubclass<CkETHMinterService>>();

      const error = { Err: { TemporarilyUnavailable: "unavailable" } };
      service.withdraw_erc20.mockResolvedValue(error);

      const canister = minter(service);

      const call = () => canister.withdrawErc20(params);

      await expect(call).rejects.toThrowError(
        new MinterTemporaryUnavailableError(error.Err.TemporarilyUnavailable),
      );
    });

    it("should throw MinterRecipientAddressBlockedError", async () => {
      const service = mock<ActorSubclass<CkETHMinterService>>();

      const error = {
        Err: { RecipientAddressBlocked: { address: ethAddressMock } },
      };
      service.withdraw_erc20.mockResolvedValue(error);

      const canister = minter(service);

      const call = () => canister.withdrawErc20(params);

      await expect(call).rejects.toThrowError(
        new MinterRecipientAddressBlockedError({
          details: error.Err.RecipientAddressBlocked.address,
        }),
      );
    });

    it("should throw MinterTokenNotSupported", async () => {
      const service = mock<ActorSubclass<CkETHMinterService>>();

      const error = {
        Err: {
          TokenNotSupported: {
            supported_tokens: [
              {
                erc20_contract_address: "abc",
                ledger_canister_id: ledgerCanisterIdMock,
                ckerc20_token_symbol: "def",
              },
              {
                erc20_contract_address: "xyz",
                ledger_canister_id: minterCanisterIdMock,
                ckerc20_token_symbol: "trs",
              },
            ],
          },
        },
      };
      service.withdraw_erc20.mockResolvedValue(error);

      const canister = minter(service);

      const call = () => canister.withdrawErc20(params);

      await expect(call).rejects.toThrowError(
        new MinterTokenNotSupported({
          details: error.Err.TokenNotSupported.supported_tokens,
        }),
      );
    });

    describe("Ledger error", () => {
      describe("CkErc20LedgerError", () => {
        it("should throw TemporarilyUnavailable", async () => {
          const service = mock<ActorSubclass<CkETHMinterService>>();

          const error = {
            Err: {
              CkErc20LedgerError: {
                error: {
                  TemporarilyUnavailable: "unavailable",
                },
                cketh_block_index: 123n,
              },
            },
          };
          service.withdraw_erc20.mockResolvedValue(error);

          const canister = minter(service);

          const call = () => canister.withdrawErc20(params);

          await expect(call).rejects.toThrowError(
            new LedgerTemporaryUnavailableError({
              msg: error.Err.CkErc20LedgerError.error.TemporarilyUnavailable,
              details: {
                ckEthBlockIndex: error.Err.CkErc20LedgerError.cketh_block_index,
              },
            }),
          );
        });

        it("should throw InsufficientAllowance", async () => {
          const service = mock<ActorSubclass<CkETHMinterService>>();

          const error = {
            Err: {
              CkErc20LedgerError: {
                error: {
                  InsufficientAllowance: {
                    token_symbol: "USDC",
                    ledger_id: ledgerCanisterIdMock,
                    allowance: 123n,
                    failed_burn_amount: 456n,
                  },
                },
                cketh_block_index: 123n,
              },
            },
          };
          service.withdraw_erc20.mockResolvedValue(error);

          const canister = minter(service);

          const call = () => canister.withdrawErc20(params);

          await expect(call).rejects.toThrowError(
            new LedgerInsufficientAllowanceError({
              details: {
                error: error.Err.CkErc20LedgerError.error.InsufficientAllowance,
                ckEthBlockIndex: error.Err.CkErc20LedgerError.cketh_block_index,
              },
            }),
          );
        });

        it("should throw AmountTooLow", async () => {
          const service = mock<ActorSubclass<CkETHMinterService>>();

          const error = {
            Err: {
              CkErc20LedgerError: {
                error: {
                  AmountTooLow: {
                    minimum_burn_amount: 123n,
                    token_symbol: "USDC",
                    ledger_id: ledgerCanisterIdMock,
                    failed_burn_amount: 456n,
                  },
                },
                cketh_block_index: 123n,
              },
            },
          };
          service.withdraw_erc20.mockResolvedValue(error);

          const canister = minter(service);

          const call = () => canister.withdrawErc20(params);

          await expect(call).rejects.toThrowError(
            new LedgerAmountTooLowError({
              details: {
                error: error.Err.CkErc20LedgerError.error.AmountTooLow,
                ckEthBlockIndex: error.Err.CkErc20LedgerError.cketh_block_index,
              },
            }),
          );
        });

        it("should throw InsufficientFunds", async () => {
          const service = mock<ActorSubclass<CkETHMinterService>>();

          const error = {
            Err: {
              CkErc20LedgerError: {
                error: {
                  InsufficientFunds: {
                    balance: 123n,
                    token_symbol: "USCC",
                    ledger_id: ledgerCanisterIdMock,
                    failed_burn_amount: 456n,
                  },
                },
                cketh_block_index: 123n,
              },
            },
          };
          service.withdraw_erc20.mockResolvedValue(error);

          const canister = minter(service);

          const call = () => canister.withdrawErc20(params);

          await expect(call).rejects.toThrowError(
            new LedgerInsufficientFundsError({
              details: {
                error: error.Err.CkErc20LedgerError.error.InsufficientFunds,
                ckEthBlockIndex: error.Err.CkErc20LedgerError.cketh_block_index,
              },
            }),
          );
        });

        it("should throw unsupported response", async () => {
          const service = mock<ActorSubclass<CkETHMinterService>>();

          const error = {
            Err: {
              CkErc20LedgerError: {
                error: { Test: null } as unknown,
                cketh_block_index: 123n,
              },
            },
          };

          // @ts-expect-error we explicity want the results to throw some error type
          service.withdraw_erc20.mockResolvedValue(error);

          const canister = minter(service);

          const call = () => canister.withdrawErc20(params);

          await expect(call).rejects.toThrowError(
            new LedgerWithdrawalError({
              msg: "Unsupported response type in ledger for minter.withdrawErc20",
              details: {
                error: error.Err.CkErc20LedgerError.error,
                ckEthBlockIndex: error.Err.CkErc20LedgerError.cketh_block_index,
              },
            }),
          );
        });
      });

      describe("CkEthLedgerError", () => {
        it("should throw TemporarilyUnavailable", async () => {
          const service = mock<ActorSubclass<CkETHMinterService>>();

          const error = {
            Err: {
              CkEthLedgerError: {
                error: {
                  TemporarilyUnavailable: "unavailable",
                },
              },
            },
          };
          service.withdraw_erc20.mockResolvedValue(error);

          const canister = minter(service);

          const call = () => canister.withdrawErc20(params);

          await expect(call).rejects.toThrowError(
            new LedgerTemporaryUnavailableError({
              msg: error.Err.CkEthLedgerError.error.TemporarilyUnavailable,
            }),
          );
        });

        it("should throw InsufficientAllowance", async () => {
          const service = mock<ActorSubclass<CkETHMinterService>>();

          const error = {
            Err: {
              CkEthLedgerError: {
                error: {
                  InsufficientAllowance: {
                    token_symbol: "USDC",
                    ledger_id: ledgerCanisterIdMock,
                    allowance: 123n,
                    failed_burn_amount: 456n,
                  },
                },
              },
            },
          };
          service.withdraw_erc20.mockResolvedValue(error);

          const canister = minter(service);

          const call = () => canister.withdrawErc20(params);

          await expect(call).rejects.toThrowError(
            new LedgerInsufficientAllowanceError({
              details: {
                error: error.Err.CkEthLedgerError.error.InsufficientAllowance,
              },
            }),
          );
        });

        it("should throw AmountTooLow", async () => {
          const service = mock<ActorSubclass<CkETHMinterService>>();

          const error = {
            Err: {
              CkEthLedgerError: {
                error: {
                  AmountTooLow: {
                    minimum_burn_amount: 123n,
                    token_symbol: "USDC",
                    ledger_id: ledgerCanisterIdMock,
                    failed_burn_amount: 456n,
                  },
                },
              },
            },
          };
          service.withdraw_erc20.mockResolvedValue(error);

          const canister = minter(service);

          const call = () => canister.withdrawErc20(params);

          await expect(call).rejects.toThrowError(
            new LedgerAmountTooLowError({
              details: {
                error: error.Err.CkEthLedgerError.error.AmountTooLow,
              },
            }),
          );
        });

        it("should throw InsufficientFunds", async () => {
          const service = mock<ActorSubclass<CkETHMinterService>>();

          const error = {
            Err: {
              CkEthLedgerError: {
                error: {
                  InsufficientFunds: {
                    balance: 123n,
                    token_symbol: "USCC",
                    ledger_id: ledgerCanisterIdMock,
                    failed_burn_amount: 456n,
                  },
                },
              },
            },
          };
          service.withdraw_erc20.mockResolvedValue(error);

          const canister = minter(service);

          const call = () => canister.withdrawErc20(params);

          await expect(call).rejects.toThrowError(
            new LedgerInsufficientFundsError({
              details: {
                error: error.Err.CkEthLedgerError.error.InsufficientFunds,
              },
            }),
          );
        });

        it("should throw unsupported response", async () => {
          const service = mock<ActorSubclass<CkETHMinterService>>();

          const error = {
            Err: {
              CkEthLedgerError: {
                error: { Test: null } as unknown,
              },
            },
          };

          // @ts-expect-error we explicity want the results to throw some error type
          service.withdraw_erc20.mockResolvedValue(error);

          const canister = minter(service);

          const call = () => canister.withdrawErc20(params);

          await expect(call).rejects.toThrowError(
            new LedgerWithdrawalError({
              msg: "Unsupported response type in ledger for minter.withdrawErc20",
              details: {
                error: error.Err.CkEthLedgerError.error,
              },
            }),
          );
        });
      });
    });

    it("should throw unsupported response", async () => {
      const service = mock<ActorSubclass<CkETHMinterService>>();

      const error = { Err: { Test: null } as unknown };
      // @ts-expect-error we explicity want the results to throw some error type
      service.withdraw_erc20.mockResolvedValue(error);

      const canister = minter(service);

      const call = () => canister.withdrawErc20(params);

      await expect(call).rejects.toThrowError(
        new MinterError({
          msg: "Unsupported response type in minter.withdrawErc20",
          details: error.Err,
        }),
      );
    });
  });

  describe("Estimate withdrawal fee", () => {
    const eip1559Result = {
      ...gasFeeEstimate,
      gas_limit: 89n,
      timestamp: toNullable(99999999n),
    };

    it("should return estimated fee", async () => {
      const service = mock<ActorSubclass<CkETHMinterService>>();
      service.eip_1559_transaction_price.mockResolvedValue(eip1559Result);

      const canister = minter(service);

      const res = await canister.eip1559TransactionPrice({});

      expect(service.eip_1559_transaction_price).toHaveBeenCalledWith([]);
      expect(res).toEqual(eip1559Result);
    });

    it("should return estimated fee for a particular Erc20 ledger ID", async () => {
      const service = mock<ActorSubclass<CkETHMinterService>>();
      service.eip_1559_transaction_price.mockResolvedValue(eip1559Result);

      const canister = minter(service);

      const res = await canister.eip1559TransactionPrice({
        ckErc20LedgerId: ledgerCanisterIdMock,
      });

      expect(service.eip_1559_transaction_price).toHaveBeenCalledWith([
        { ckerc20_ledger_id: ledgerCanisterIdMock },
      ]);
      expect(res).toEqual(eip1559Result);
    });

    it("should bubble errors", async () => {
      const service = mock<ActorSubclass<CkETHMinterService>>();
      service.eip_1559_transaction_price.mockRejectedValue(new Error());

      const canister = minter(service);

      const call = () => canister.eip1559TransactionPrice({ certified: true });

      await expect(call).rejects.toThrowError();
    });

    it("should bubble errors non-certified", async () => {
      const service = mock<ActorSubclass<CkETHMinterService>>();
      service.eip_1559_transaction_price.mockRejectedValue(new Error());

      const canister = nonCertifiedMinter(service);

      const call = () => canister.eip1559TransactionPrice({ certified: false });

      await expect(call).rejects.toThrowError();
    });
  });

  describe("Retrieve Eth status", () => {
    it("should return status", async () => {
      const result = {
        TxCreated: null,
      };

      const service = mock<ActorSubclass<CkETHMinterService>>();
      service.retrieve_eth_status.mockResolvedValue(result);

      const canister = minter(service);

      const params = 123n;

      const res = await canister.retrieveEthStatus(params);

      expect(service.retrieve_eth_status).toHaveBeenCalledWith(params);
      expect(res).toEqual(result);
    });

    it("should bubble errors", async () => {
      const service = mock<ActorSubclass<CkETHMinterService>>();
      service.retrieve_eth_status.mockRejectedValue(new Error());

      const canister = minter(service);

      const call = () => canister.retrieveEthStatus(123n);

      await expect(call).rejects.toThrowError();
    });
  });

  describe("Minter Info", () => {
    it("should return minter info", async () => {
      const result: MinterInfo = {
        eth_balance: toNullable(1n),
        last_observed_block_number: toNullable(2n),
        last_gas_fee_estimate: toNullable({
          ...gasFeeEstimate,
          timestamp: 999999n,
        }),
        minimum_withdrawal_amount: toNullable(3n),
        minter_address: toNullable(ckETHSmartContractAddressMock),
        ethereum_block_height: toNullable({ Safe: null }),
        erc20_helper_contract_address: [],
        erc20_balances: [
          [
            {
              balance: 123n,
              erc20_contract_address: ethAddressMock,
            },
          ],
        ],
        eth_helper_contract_address: toNullable(ckETHSmartContractAddressMock),
        cketh_ledger_id: [ledgerCanisterIdMock],
        smart_contract_address: toNullable(ckETHSmartContractAddressMock),
        supported_ckerc20_tokens: [],
        last_erc20_scraped_block_number: [5892643n],
        last_eth_scraped_block_number: [5892601n],
        evm_rpc_id: toNullable(
          Principal.fromText("7hfb6-caaaa-aaaar-qadga-cai"),
        ),
        deposit_with_subaccount_helper_contract_address: toNullable(
          ckETHSmartContractAddressMock,
        ),
        last_deposit_with_subaccount_scraped_block_number: [123n],
      };

      const service = mock<ActorSubclass<CkETHMinterService>>();
      service.get_minter_info.mockResolvedValue(result);

      const canister = minter(service);

      const res = await canister.getMinterInfo({
        certified: true,
      });

      expect(service.get_minter_info).toHaveBeenCalled();
      expect(res).toEqual(result);
    });

    it("should bubble errors", async () => {
      const service = mock<ActorSubclass<CkETHMinterService>>();
      service.get_minter_info.mockImplementation(() => {
        throw new Error();
      });

      const canister = minter(service);

      await expect(
        async () => await canister.getMinterInfo({ certified: true }),
      ).rejects.toThrowError();
    });
  });
});
