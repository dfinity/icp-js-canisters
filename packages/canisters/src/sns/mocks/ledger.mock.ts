import {
  IcrcMetadataResponseEntries,
  type IcrcValue,
} from "@dfinity/ledger-icrc";
import { Principal } from "@icp-sdk/core/principal";

export const tokenMetadataResponseMock: [
  string | IcrcMetadataResponseEntries,
  IcrcValue,
][] = [
  [IcrcMetadataResponseEntries.DECIMALS, { Nat: BigInt(8) }],
  [IcrcMetadataResponseEntries.NAME, { Text: "Beta Test" }],
  [IcrcMetadataResponseEntries.SYMBOL, { Text: "BTA" }],
  [IcrcMetadataResponseEntries.FEE, { Nat: BigInt(1000) }],
];

export const mockPrincipalText =
  "xlmdg-vkosz-ceopx-7wtgu-g3xmd-koiyc-awqaq-7modz-zf6r6-364rh-oqe";

export const mockPrincipal = Principal.fromText(mockPrincipalText);
