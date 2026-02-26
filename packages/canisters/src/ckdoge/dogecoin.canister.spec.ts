import {
  type CanisterOptions,
  arrayOfNumberToUint8Array,
} from "@dfinity/utils";
import type { ActorSubclass } from "@icp-sdk/core/agent";
import { mock } from "vitest-mock-extended";
import type { DogecoinDid, DogecoinService } from "../declarations";
import { DogecoinCanister } from "./dogecoin.canister";
import {
  dogecoinAddressMock,
  dogecoinCanisterIdMock,
} from "./mocks/minter.mock";
import type { GetBalanceParams, GetUtxosParams } from "./types/dogecoin.params";

describe("DogecoinCanister", () => {
  const createDogecoinCanister = (
    services: Pick<CanisterOptions<DogecoinService>, "serviceOverride">,
  ): DogecoinCanister =>
    DogecoinCanister.create({
      canisterId: dogecoinCanisterIdMock,
      ...services,
    });

  describe("dogecoinGetUtxosQuery", () => {
    const params: Omit<GetUtxosParams, "certified"> = {
      network: "regtest",
      filter: { minConfirmations: 2 },
      address: dogecoinAddressMock,
    };

    const response: DogecoinDid.get_utxos_response = {
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
      const service = mock<ActorSubclass<DogecoinService>>();
      service.dogecoin_get_utxos_query.mockResolvedValue(response);

      const { getUtxosQuery } = createDogecoinCanister({
        serviceOverride: service,
      });

      const res = await getUtxosQuery({
        ...params,
      });

      expect(res).toEqual(response);
      expect(service.dogecoin_get_utxos_query).toHaveBeenCalledWith({
        network: { regtest: null },
        filter: [{ min_confirmations: 2 }],
        address: dogecoinAddressMock,
      });
      expect(service.dogecoin_get_utxos).not.toHaveBeenCalled();
    });

    it("call get utxos with min_confirmations", async () => {
      const service = mock<ActorSubclass<DogecoinService>>();
      service.dogecoin_get_utxos_query.mockResolvedValue(response);

      const { getUtxosQuery } = createDogecoinCanister({
        serviceOverride: service,
      });

      await getUtxosQuery({
        ...params,
      });

      expect(service.dogecoin_get_utxos_query).toHaveBeenCalledWith({
        network: { regtest: null },
        filter: [{ min_confirmations: 2 }],
        address: dogecoinAddressMock,
      });
    });

    it("call get utxos with page", async () => {
      const service = mock<ActorSubclass<DogecoinService>>();
      service.dogecoin_get_utxos_query.mockResolvedValue(response);

      const { getUtxosQuery } = createDogecoinCanister({
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

      expect(service.dogecoin_get_utxos_query).toHaveBeenCalledWith({
        network: { regtest: null },
        filter: [{ page }],
        address: dogecoinAddressMock,
      });
    });

    it("throws Error", async () => {
      const error = new Error("Test");
      const service = mock<ActorSubclass<DogecoinService>>();
      service.dogecoin_get_utxos_query.mockRejectedValue(error);

      const { getUtxosQuery } = createDogecoinCanister({
        serviceOverride: service,
      });

      const call = () =>
        getUtxosQuery({
          ...params,
        });

      await expect(call).rejects.toThrowError(Error);
    });

    it("should not call certified end point", async () => {
      const service = mock<ActorSubclass<DogecoinService>>();
      service.dogecoin_get_utxos_query.mockResolvedValue(response);

      const { getUtxosQuery } = createDogecoinCanister({
        serviceOverride: service,
      });

      await getUtxosQuery({
        ...params,
      });

      expect(service.dogecoin_get_utxos).not.toHaveBeenCalled();
    });
  });

  describe("dogecoinGetBalanceQuery", () => {
    const params: Omit<GetBalanceParams, "certified"> = {
      network: "regtest",
      minConfirmations: 2,
      address: dogecoinAddressMock,
    };

    const response: DogecoinDid.koinu = 1000n;

    it("returns balance result when success", async () => {
      const service = mock<ActorSubclass<DogecoinService>>();
      service.dogecoin_get_balance_query.mockResolvedValue(response);

      const { getBalanceQuery } = createDogecoinCanister({
        serviceOverride: service,
      });

      const res = await getBalanceQuery({
        ...params,
      });

      expect(res).toEqual(response);
      expect(service.dogecoin_get_balance_query).toHaveBeenCalledWith({
        network: { regtest: null },
        min_confirmations: [2],
        address: dogecoinAddressMock,
      });
    });

    it("throws Error", async () => {
      const error = new Error("Test");
      const service = mock<ActorSubclass<DogecoinService>>();
      service.dogecoin_get_balance_query.mockRejectedValue(error);

      const { getBalanceQuery } = createDogecoinCanister({
        serviceOverride: service,
      });

      const call = () =>
        getBalanceQuery({
          ...params,
        });

      await expect(call).rejects.toThrowError(Error);
    });

    it("should not call certified end point", async () => {
      const service = mock<ActorSubclass<DogecoinService>>();
      service.dogecoin_get_balance_query.mockResolvedValue(response);

      const { getBalanceQuery } = createDogecoinCanister({
        serviceOverride: service,
      });

      await getBalanceQuery({
        ...params,
      });

      expect(service.dogecoin_get_balance).not.toHaveBeenCalled();
    });
  });
});
