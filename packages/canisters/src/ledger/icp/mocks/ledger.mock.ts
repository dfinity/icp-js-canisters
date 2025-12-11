import { Principal } from "@icp-sdk/core/principal";
import { AccountIdentifier } from "../account_identifier";

export const mockAccountIdentifier = AccountIdentifier.fromHex(
  "d3e13d4777e22367532053190b6c6ccf57444a61337e996242b1abfb52cf92c8",
);

export const mockPrincipalText =
  "xlmdg-vkosz-ceopx-7wtgu-g3xmd-koiyc-awqaq-7modz-zf6r6-364rh-oqe";

export const mockPrincipal = Principal.fromText(mockPrincipalText);
