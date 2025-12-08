import { nonNullish, toNullable, type QueryParams } from "@dfinity/utils";
import type { CkBtcBitcoinDid } from "../../declarations";

export type BitcoinNetwork = "testnet" | "mainnet" | "regtest";

const mapBitcoinNetwork: Record<BitcoinNetwork, CkBtcBitcoinDid.network> = {
  mainnet: { mainnet: null },
  testnet: { testnet: null },
  regtest: { regtest: null },
};

export type GetUtxosParams = Omit<
  CkBtcBitcoinDid.get_utxos_request,
  "network" | "filter"
> & {
  network: BitcoinNetwork;
  filter?: { page: Uint8Array } | { minConfirmations: number };
} & Omit<QueryParams, "certified">;

export const toGetUtxosParams = ({
  network,
  filter,
  ...rest
}: GetUtxosParams): CkBtcBitcoinDid.get_utxos_request => ({
  filter: nonNullish(filter)
    ? toNullable(
        "minConfirmations" in filter
          ? { min_confirmations: filter.minConfirmations }
          : { page: filter.page },
      )
    : toNullable(),
  network: network === "testnet" ? { testnet: null } : { mainnet: null },
  ...rest,
});

export type GetBalanceParams = Omit<
  CkBtcBitcoinDid.get_balance_request,
  "network" | "min_confirmations"
> & {
  network: BitcoinNetwork;
  minConfirmations?: number;
} & Omit<QueryParams, "certified">;

export const toGetBalanceParams = ({
  network,
  minConfirmations,
  ...rest
}: GetBalanceParams): CkBtcBitcoinDid.get_balance_request => ({
  min_confirmations: toNullable(minConfirmations),
  network: mapBitcoinNetwork[network],
  ...rest,
});
