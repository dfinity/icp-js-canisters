import {
  arrayOfNumberToUint8Array,
  asciiStringToByteArray,
  numberToUint8Array,
} from "@dfinity/utils";
import type { Principal } from "@icp-sdk/core/principal";
import { sha256 } from "@noble/hashes/sha2";
import type { IcrcLedgerDid } from "../../ledger/icrc";

/**
 * Neuron subaccount is calculated as "sha256(0x0c . “neuron-stake” . controller . i)"
 *
 * @param params
 * @param {Principal} params.newController
 * @param {number} params.index
 * @returns
 */
export const neuronSubaccount = ({
  index,
  controller,
}: {
  index: number;
  controller: Principal;
}): IcrcLedgerDid.Subaccount => {
  const padding = asciiStringToByteArray("neuron-stake");
  const data = [
    0x0c,
    ...padding,
    ...controller.toUint8Array(),
    ...numberToUint8Array(index),
  ];
  // TODO(#238): Implement without library and make it compatible with NodeJS and browser
  const shaObj = sha256.create();
  shaObj.update(arrayOfNumberToUint8Array(data));
  return shaObj.digest();
};
