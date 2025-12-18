import { Ed25519KeyIdentity } from "@icp-sdk/core/identity";
import { utf8ToBytes } from "@noble/hashes/utils";

// yields n7obp-cx27z-e4ytc-ipt7n-urffz-txqa5-el2vn-7vpqc-jjoh3-wrob6-bqe
const assetsSeed = new Uint8Array(32);
utf8ToBytes("test").forEach((byte, i) => {
  assetsSeed[i] = byte;
});

export const assetsIdentity = Ed25519KeyIdentity.generate(assetsSeed);
