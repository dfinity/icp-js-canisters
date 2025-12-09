// As defined on Bitcoin network.
// e.g. https://developer.bitcoin.org/examples/testing.html
export enum BtcNetwork {
  Mainnet,
  Regtest,
  Testnet,
}

// See https://github.com/dfinity/ic/blob/a8da3aa23dc6f8f4708cb0cb8edce84c5bd8f225/rs/bitcoin/ckbtc/minter/src/address.rs#L18
export enum BtcAddressType {
  P2wpkhV0,
  P2pkh,
  P2sh,
  P2wsh,
  P2tr,
}
