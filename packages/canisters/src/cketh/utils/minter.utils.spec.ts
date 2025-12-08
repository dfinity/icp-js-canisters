import { Principal } from "@icp-sdk/core/principal";
import { encodePrincipalToEthAddress } from "./minter.utils";

describe("minter-utils", () => {
  const mockPrincipalExample1 = Principal.from(
    "esd5n-wtdqq-kimdw-qrxjr-7luer-zjhez-hsauj-pu5ox-2y6ov-g53g4-xqe",
  );
  const ethExample1 =
    "0x1d638414860ed08dd31fae848e527264f20512fa75d7d63cea9bbb372f020000";

  const mockPrincipalExample2 = Principal.from(
    "auycm-ouxjf-el73p-7cfpm-73w3q-fd7xc-ubevq-ea4vt-vpe2n-rs7e5-qqe",
  );
  const ethExample2 =
    "0x1d974948bfedff115ecfeedb8147fb8a8125604072b3abc9a6c65f2761020000";

  const mockPrincipalExample3 = Principal.from(
    "ouoed-xoejt-4ssko-nf4tu-w3wbu-x2lz7-qfili-67oyv-kz4kf-nmo7q-yqe",
  );
  const ethExample3 =
    "0x1dc44cf92929cd2f274b6ec1a5f4bcfe0542d1efbb155678a2b58efc31020000";

  const mockPrincipalExample4 = Principal.from(
    "k2t6j-2nvnp-4zjm3-25dtz-6xhaa-c7boj-5gayf-oj3xs-i43lp-teztq-6ae",
  );
  const ethExample4 =
    "0x1db56bf994b37ae8e79f5ce000be1727a6060ae4eef24736b7cc999c3c020000";

  const mockPrincipalExample5 = Principal.from(
    "opspt-7okml-4664d-lqdny-uuuto-6nars-7am7t-jebvm-j3xj2-j4tdu-vqe",
  );
  const ethExample5 =
    "0x1dca62f9ef706b80db8a5293779a08cbe067e69206ac4eee9d27931d2b020000";

  const mockPrincipalExample6 = Principal.from(
    "ezu3d-2mifu-k3bh4-oqhrj-mbrql-5p67r-pp6pr-dbfra-unkx5-sxdtv-rae",
  );
  const ethExample6 =
    "0x1d882d15b09f8e81e29606305f5fefc5eff3e2309620a3557ecae39d62020000";

  const mockPrincipalExample7 = Principal.from(
    "47gy6-2c22d-voqoy-eflbe-gwml3-zwe52-r6lx7-rexro-ebluo-2rqcd-sae",
  );
  const ethExample7 =
    "0x1d5ad0eae83b042ac243598bde6c4eea3e5dff125e2e2057476a3010e4020000";

  const mockPrincipalExample8 = Principal.from("2chl6-4hpzw-vqaaa-aaaaa-c");
  const ethExample8 =
    "0x09efcdab00000000000100000000000000000000000000000000000000000000";

  it("should encode principal into fixed 32-byte representation suitable for calling Ethereum smart contracts", () => {
    expect(encodePrincipalToEthAddress(mockPrincipalExample1)).toEqual(
      ethExample1,
    );

    expect(encodePrincipalToEthAddress(mockPrincipalExample2)).toEqual(
      ethExample2,
    );

    expect(encodePrincipalToEthAddress(mockPrincipalExample3)).toEqual(
      ethExample3,
    );

    expect(encodePrincipalToEthAddress(mockPrincipalExample4)).toEqual(
      ethExample4,
    );

    expect(encodePrincipalToEthAddress(mockPrincipalExample5)).toEqual(
      ethExample5,
    );

    expect(encodePrincipalToEthAddress(mockPrincipalExample6)).toEqual(
      ethExample6,
    );

    expect(encodePrincipalToEthAddress(mockPrincipalExample7)).toEqual(
      ethExample7,
    );

    expect(encodePrincipalToEthAddress(mockPrincipalExample8)).toEqual(
      ethExample8,
    );
  });
});
