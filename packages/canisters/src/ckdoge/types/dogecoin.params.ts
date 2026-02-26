import { nonNullish, toNullable, type QueryParams } from "@dfinity/utils";
import type { DogecoinDid } from "../../declarations";

export type DogecoinNetwork = "mainnet" | "regtest";

const mapDogecoinNetwork: Record<DogecoinNetwork, DogecoinDid.network> = {
  mainnet: { mainnet: null },
  regtest: { regtest: null },
};

export type GetUtxosParams = Omit<
  DogecoinDid.get_utxos_request,
  "network" | "filter"
> & {
  network: DogecoinNetwork;
  filter?: { page: Uint8Array } | { minConfirmations: number };
} & Omit<QueryParams, "certified">;

export const toGetUtxosParams = ({
  network,
  filter,
  ...rest
}: GetUtxosParams): DogecoinDid.get_utxos_request => ({
  filter: nonNullish(filter)
    ? toNullable(
        "minConfirmations" in filter
          ? { min_confirmations: filter.minConfirmations }
          : { page: filter.page },
      )
    : toNullable(),
  network: network === "regtest" ? { regtest: null } : { mainnet: null },
  ...rest,
});

export type GetBalanceParams = Omit<
  DogecoinDid.get_balance_request,
  "network" | "min_confirmations"
> & {
  network: DogecoinNetwork;
  minConfirmations?: number;
} & Omit<QueryParams, "certified">;

export const toGetBalanceParams = ({
  network,
  minConfirmations,
  ...rest
}: GetBalanceParams): DogecoinDid.get_balance_request => ({
  min_confirmations: toNullable(minConfirmations),
  network: mapDogecoinNetwork[network],
  ...rest,
});
