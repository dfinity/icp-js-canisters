import { Principal } from "@icp-sdk/core/principal";

export const GOVERNANCE_CANISTER_ID = Principal.fromText(
  "rrkah-fqaaa-aaaaa-aaaaq-cai",
);

export const MAINNET_GOVERNANCE_CANISTER_ID = Principal.fromText(
  "rrkah-fqaaa-aaaaa-aaaaq-cai",
);

export const MAINNET_GENESIS_TOKEN_CANISTER_ID = Principal.fromText(
  "renrk-eyaaa-aaaaa-aaada-cai",
);

// TODO(L2-828): Sns-wasm canister is not yet deployed on mainnet
export const MAINNET_SNS_WASM_CANISTER_ID = Principal.fromText(
  "r7inp-6aaaa-aaaaa-aaabq-cai",
);
