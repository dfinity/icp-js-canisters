import type { BtcAddressType, BtcNetwork } from "../enums/btc.enums";

export interface BtcAddress {
  address: string;
  network?: BtcNetwork;
}

export interface BtcAddressInfo extends Required<BtcAddress> {
  parser: "bip-173" | "base58";
  type: BtcAddressType;
}
