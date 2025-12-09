import type { Principal } from "@icp-sdk/core/principal";
import type { IcrcLedgerDid } from "../../../declarations";

// Source: https://github.com/dfinity/icrc-1#standard-metadata-entries
export enum IcrcMetadataResponseEntries {
  SYMBOL = "icrc1:symbol",
  NAME = "icrc1:name",
  DECIMALS = "icrc1:decimals",
  FEE = "icrc1:fee",
  LOGO = "icrc1:logo",
}

export type IcrcTokenMetadataResponse = [
  string | IcrcMetadataResponseEntries,
  IcrcLedgerDid.Value,
][];

export interface IcrcAccount {
  owner: Principal;
  subaccount?: IcrcLedgerDid.Subaccount;
}

export interface IcrcTokenMetadata {
  name: string;
  symbol: string;
  fee: bigint;
  decimals: number;
  icon?: string;
}
