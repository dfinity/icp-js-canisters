import {
  type CanisterOptions,
  arrayOfNumberToUint8Array,
} from "@dfinity/utils";
import type { ActorSubclass } from "@icp-sdk/core/agent";
import { mock } from "vitest-mock-extended";
import type { CkBtcBitcoinDid, CkBtcBitcoinService } from "../declarations";
import { BitcoinCanister } from "./bitcoin.canister";
import { bitcoinAddressMock, bitcoinCanisterIdMock } from "./mocks/minter.mock";
import type { GetBalanceParams, GetUtxosParams } from "./types/bitcoin.params";

describe("BitcoinCanister", () => {
  const createBitcoinCanister = (
    services: Pick<CanisterOptions<CkBtcBitcoinService>, "serviceOverride">,
  ): BitcoinCanister =>
    BitcoinCanister.create({
      canisterId: bitcoinCanisterIdMock,
      ...services,
    });

  describe("bitcoinGetUtxosQuery", () => {
    const params: Omit<GetUtxosParams, "certified"> = {
      network: "testnet",
      filter: { minConfirmations: 2 },
      address: bitcoinAddressMock,
    };

    const response: CkBtcBitcoinDid.get_utxos_response = {
      next_page: [],
      tip_height: 123,
      tip_block_hash: new Uint8Array([1, 2, 3]),
      utxos: [
        {
          height: 456,
          value: 789n,
          outpoint: {
            txid: new Uint8Array([4, 5, 6]),
            vout: 1,
          },
        },
        {
          height: 789,
          value: 7n,
          outpoint: {
            txid: new Uint8Array([7, 8, 9]),
            vout: 2,
          },
        },
      ],
    };

    it("returns get utxos result when success", async () => {
      const service = mock<ActorSubclass<CkBtcBitcoinService>>();
      service.bitcoin_get_utxos_query.mockResolvedValue(response);

      const { getUtxosQuery } = createBitcoinCanister({
        serviceOverride: service,
      });

      const res = await getUtxosQuery({
        ...params,
      });

      expect(res).toEqual(response);
      expect(service.bitcoin_get_utxos_query).toHaveBeenCalledWith({
        network: { testnet: null },
        filter: [{ min_confirmations: 2 }],
        address: bitcoinAddressMock,
      });
      expect(service.bitcoin_get_utxos).not.toHaveBeenCalled();
    });

    it("call get utxos with min_confirmations", async () => {
      const service = mock<ActorSubclass<CkBtcBitcoinService>>();
      service.bitcoin_get_utxos_query.mockResolvedValue(response);

      const { getUtxosQuery } = createBitcoinCanister({
        serviceOverride: service,
      });

      await getUtxosQuery({
        ...params,
      });

      expect(service.bitcoin_get_utxos_query).toHaveBeenCalledWith({
        network: { testnet: null },
        filter: [{ min_confirmations: 2 }],
        address: bitcoinAddressMock,
      });
    });

    it("call get utxos with page", async () => {
      const service = mock<ActorSubclass<CkBtcBitcoinService>>();
      service.bitcoin_get_utxos_query.mockResolvedValue(response);

      const { getUtxosQuery } = createBitcoinCanister({
        serviceOverride: service,
      });

      const page = arrayOfNumberToUint8Array([1, 2, 3]);
      const pageParams: Omit<GetUtxosParams, "certified"> = {
        ...params,
        filter: {
          page,
        },
      };

      await getUtxosQuery({
        ...pageParams,
      });

      expect(service.bitcoin_get_utxos_query).toHaveBeenCalledWith({
        network: { testnet: null },
        filter: [{ page }],
        address: bitcoinAddressMock,
      });
    });

    it("throws Error", async () => {
      const error = new Error("Test");
      const service = mock<ActorSubclass<CkBtcBitcoinService>>();
      service.bitcoin_get_utxos_query.mockRejectedValue(error);

      const { getUtxosQuery } = createBitcoinCanister({
        serviceOverride: service,
      });

      const call = () =>
        getUtxosQuery({
          ...params,
        });

      await expect(call).rejects.toThrowError(Error);
    });

    it("should not call certified end point", async () => {
      const service = mock<ActorSubclass<CkBtcBitcoinService>>();
      service.bitcoin_get_utxos_query.mockResolvedValue(response);

      const { getUtxosQuery } = createBitcoinCanister({
        serviceOverride: service,
      });

      await getUtxosQuery({
        ...params,
      });

      expect(service.bitcoin_get_utxos).not.toHaveBeenCalled();
    });
  });

  describe("bitcoinGetBalanceQuery", () => {
    const params: Omit<GetBalanceParams, "certified"> = {
      network: "testnet",
      minConfirmations: 2,
      address: bitcoinAddressMock,
    };

    const response: CkBtcBitcoinDid.satoshi = 1000n;

    it("returns balance result when success", async () => {
      const service = mock<ActorSubclass<CkBtcBitcoinService>>();
      service.bitcoin_get_balance_query.mockResolvedValue(response);

      const { getBalanceQuery } = createBitcoinCanister({
        serviceOverride: service,
      });

      const res = await getBalanceQuery({
        ...params,
      });

      expect(res).toEqual(response);
      expect(service.bitcoin_get_balance_query).toHaveBeenCalledWith({
        network: { testnet: null },
        min_confirmations: [2],
        address: bitcoinAddressMock,
      });
    });

    it("throws Error", async () => {
      const error = new Error("Test");
      const service = mock<ActorSubclass<CkBtcBitcoinService>>();
      service.bitcoin_get_balance_query.mockRejectedValue(error);

      const { getBalanceQuery } = createBitcoinCanister({
        serviceOverride: service,
      });

      const call = () =>
        getBalanceQuery({
          ...params,
        });

      await expect(call).rejects.toThrowError(Error);
    });

    it("should not call certified end point", async () => {
      const service = mock<ActorSubclass<CkBtcBitcoinService>>();
      service.bitcoin_get_balance_query.mockResolvedValue(response);

      const { getBalanceQuery } = createBitcoinCanister({
        serviceOverride: service,
      });

      await getBalanceQuery({
        ...params,
      });

      expect(service.bitcoin_get_balance).not.toHaveBeenCalled();
    });
  });
});
