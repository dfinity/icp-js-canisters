import { BtcAddressType, BtcNetwork } from "../enums/btc.enums";
import {
  ParseBtcAddressMalformedAddressError,
  ParseBtcAddressNoDataError,
  ParseBtcAddressUnsupportedAddressTypeError,
} from "../errors/btc.errors";
import { parseBtcAddress } from "./btc.utils";

describe("BTC utils", () => {
  it("parse Mainnet P2PKH", () => {
    const address = "17VZNX1SN5NtKa8UQFxwQbFeFc3iqRYhem";

    expect(parseBtcAddress({ address, network: BtcNetwork.Mainnet })).toEqual({
      address,
      network: BtcNetwork.Mainnet,
      type: BtcAddressType.P2pkh,
      parser: "base58",
    });
  });

  it("parse Testnet P2PKH", () => {
    const address = "mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn";

    expect(parseBtcAddress({ address, network: BtcNetwork.Testnet })).toEqual({
      address,
      network: BtcNetwork.Testnet,
      type: BtcAddressType.P2pkh,
      parser: "base58",
    });
  });

  it("parse Regtest P2PKH", () => {
    const address = "mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn";

    expect(parseBtcAddress({ address, network: BtcNetwork.Regtest })).toEqual({
      address,
      network: BtcNetwork.Regtest,
      type: BtcAddressType.P2pkh,
      parser: "base58",
    });
  });

  it("fails on invalid P2PKH", () => {
    const address = "17VZNX1SN5NtKa8UFFxwQbFeFc3iqRYhem";

    expect(() =>
      parseBtcAddress({ address, network: BtcNetwork.Mainnet }),
    ).toThrow(ParseBtcAddressMalformedAddressError);
    expect(() =>
      parseBtcAddress({ address, network: BtcNetwork.Testnet }),
    ).toThrow(ParseBtcAddressMalformedAddressError);
    expect(() =>
      parseBtcAddress({ address, network: BtcNetwork.Regtest }),
    ).toThrow(ParseBtcAddressMalformedAddressError);
  });

  it("parse Mainnet P2SH", () => {
    const address = "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy";

    expect(parseBtcAddress({ address, network: BtcNetwork.Mainnet })).toEqual({
      address,
      network: BtcNetwork.Mainnet,
      type: BtcAddressType.P2sh,
      parser: "base58",
    });
  });

  it("parse Testnet P2SH", () => {
    const address = "2MzQwSSnBHWHqSAqtTVQ6v47XtaisrJa1Vc";

    expect(parseBtcAddress({ address, network: BtcNetwork.Testnet })).toEqual({
      address,
      network: BtcNetwork.Testnet,
      type: BtcAddressType.P2sh,
      parser: "base58",
    });
  });

  it("parse Regtest P2SH", () => {
    const address = "2MzQwSSnBHWHqSAqtTVQ6v47XtaisrJa1Vc";

    expect(parseBtcAddress({ address, network: BtcNetwork.Regtest })).toEqual({
      address,
      network: BtcNetwork.Regtest,
      type: BtcAddressType.P2sh,
      parser: "base58",
    });
  });

  it("fails on invalid P2SH", () => {
    const address = "17VZNX1SN5NtKa8UFFxwQbFFFc3iqRYhem";

    expect(() =>
      parseBtcAddress({ address, network: BtcNetwork.Mainnet }),
    ).toThrow(ParseBtcAddressMalformedAddressError);
    expect(() =>
      parseBtcAddress({ address, network: BtcNetwork.Testnet }),
    ).toThrow(ParseBtcAddressMalformedAddressError);
    expect(() =>
      parseBtcAddress({ address, network: BtcNetwork.Regtest }),
    ).toThrow(ParseBtcAddressMalformedAddressError);
  });

  it("fails on bogus address", () => {
    const address = "x";

    expect(() =>
      parseBtcAddress({ address, network: BtcNetwork.Mainnet }),
    ).toThrow(ParseBtcAddressUnsupportedAddressTypeError);
    expect(() =>
      parseBtcAddress({ address, network: BtcNetwork.Testnet }),
    ).toThrow(ParseBtcAddressUnsupportedAddressTypeError);
    expect(() =>
      parseBtcAddress({ address, network: BtcNetwork.Regtest }),
    ).toThrow(ParseBtcAddressUnsupportedAddressTypeError);
  });

  it("fails on empty address", () => {
    const address = "";

    expect(() =>
      parseBtcAddress({ address, network: BtcNetwork.Mainnet }),
    ).toThrow(ParseBtcAddressNoDataError);
    expect(() =>
      parseBtcAddress({ address, network: BtcNetwork.Testnet }),
    ).toThrow(ParseBtcAddressNoDataError);
    expect(() =>
      parseBtcAddress({ address, network: BtcNetwork.Regtest }),
    ).toThrow(ParseBtcAddressNoDataError);
  });

  it("parse Mainnet Bech32 P2WPKH", () => {
    const [a, b] = [
      "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4",
      "bc1q973xrrgje6etkkn9q9azzsgpxeddats8ckvp5s",
    ];

    expect(
      parseBtcAddress({ address: a, network: BtcNetwork.Mainnet }),
    ).toEqual({
      address: a,
      network: BtcNetwork.Mainnet,
      type: BtcAddressType.P2wpkhV0,
      parser: "bip-173",
    });
    expect(
      parseBtcAddress({ address: b, network: BtcNetwork.Mainnet }),
    ).toEqual({
      address: b,
      network: BtcNetwork.Mainnet,
      type: BtcAddressType.P2wpkhV0,
      parser: "bip-173",
    });
  });

  it("parse Testnet Bech32 P2WPKH", () => {
    const address = "tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx";

    expect(parseBtcAddress({ address, network: BtcNetwork.Testnet })).toEqual({
      address,
      network: BtcNetwork.Testnet,
      type: BtcAddressType.P2wpkhV0,
      parser: "bip-173",
    });
  });

  it("parse Regtest Bech32 P2WPKH", () => {
    const address = "bcrt1q6z64a43mjgkcq0ul2znwneq3spghrlau9slefp";

    expect(parseBtcAddress({ address, network: BtcNetwork.Regtest })).toEqual({
      address,
      network: BtcNetwork.Regtest,
      type: BtcAddressType.P2wpkhV0,
      parser: "bip-173",
    });
  });

  it("fails on invalid Bech32", () => {
    const address = "bc1qw508d6qejxtdg4y5r3zrrvary0c5xw7kv8f3t4";

    expect(() =>
      parseBtcAddress({ address, network: BtcNetwork.Mainnet }),
    ).toThrow(ParseBtcAddressMalformedAddressError);
    expect(() =>
      parseBtcAddress({ address, network: BtcNetwork.Testnet }),
    ).toThrow(ParseBtcAddressMalformedAddressError);
    expect(() =>
      parseBtcAddress({ address, network: BtcNetwork.Regtest }),
    ).toThrow(ParseBtcAddressMalformedAddressError);
  });

  describe("minter canister samples", () => {
    it("parse Mainnet P2wpkhV0", () => {
      const [a, b] = [
        "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4",
        "BC1QW508D6QEJXTDG4Y5R3ZARVARY0C5XW7KV8F3T4",
      ];

      expect(
        parseBtcAddress({ address: a, network: BtcNetwork.Mainnet }),
      ).toEqual({
        address: a,
        network: BtcNetwork.Mainnet,
        type: BtcAddressType.P2wpkhV0,
        parser: "bip-173",
      });

      expect(
        parseBtcAddress({ address: b, network: BtcNetwork.Mainnet }),
      ).toEqual({
        address: b,
        network: BtcNetwork.Mainnet,
        type: BtcAddressType.P2wpkhV0,
        parser: "bip-173",
      });
    });

    it("should throw invalid checksum", () => {
      const address = "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t5";

      expect(() => {
        parseBtcAddress({ address, network: BtcNetwork.Regtest });
      }).toThrow(ParseBtcAddressMalformedAddressError);
    });
  });

  describe("p2wsh and P2tr address type", () => {
    it("Mainnet Bech32 P2WSH", () => {
      const address =
        "bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3";

      expect(parseBtcAddress({ address, network: BtcNetwork.Mainnet })).toEqual(
        {
          address,
          network: BtcNetwork.Mainnet,
          type: BtcAddressType.P2wsh,
          parser: "bip-173",
        },
      );
    });

    it("Testnet Bech32 P2WSH", () => {
      const address =
        "tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sl5k7";

      expect(parseBtcAddress({ address, network: BtcNetwork.Testnet })).toEqual(
        {
          address,
          network: BtcNetwork.Testnet,
          type: BtcAddressType.P2wsh,
          parser: "bip-173",
        },
      );
    });

    it("Regtest Bech32 P2WSH", () => {
      const address =
        "bcrt1q5n2k3frgpxces3dsw4qfpqk4kksv0cz96pldxdwxrrw0d5ud5hcqzzx7zt";

      expect(parseBtcAddress({ address, network: BtcNetwork.Regtest })).toEqual(
        {
          address,
          network: BtcNetwork.Regtest,
          type: BtcAddressType.P2wsh,
          parser: "bip-173",
        },
      );
    });

    it("fails on Regtest Bech32 P2WSH", () => {
      const address =
        "bcrt1q5n2k3frgpxces3dsw4qfpqk4kksv0cz96pldxdwxrrw0d5ud5hcqzzx7zt";

      expect(parseBtcAddress({ address, network: BtcNetwork.Regtest })).toEqual(
        {
          address,
          network: BtcNetwork.Regtest,
          type: BtcAddressType.P2wsh,
          parser: "bip-173",
        },
      );
    });

    it("Mainnet Bech32m P2tr", () => {
      const address =
        "bc1pz37fc4cn9ah8anwm4xqqhvxygjf9rjf2resrw8h8w4tmvcs0863sa2e586";

      expect(parseBtcAddress({ address, network: BtcNetwork.Mainnet })).toEqual(
        {
          address,
          network: BtcNetwork.Mainnet,
          type: BtcAddressType.P2tr,
          parser: "bip-173",
        },
      );
    });
  });
});
