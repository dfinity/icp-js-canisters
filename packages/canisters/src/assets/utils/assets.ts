import type { AssetsService } from "../../declarations";

export type AssetDetails = Awaited<ReturnType<AssetsService["list"]>>[number];

/**
 * Compare two arrays of asset entries by their keys.
 * @param a First array of asset entries.
 * @param b Second array of asset entries.
 * @returns True if the arrays have the same length and the same keys, false otherwise.
 */
export const entriesEqual = ({
  a,
  b,
}: {
  a: AssetDetails[];
  b: AssetDetails[];
}): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  return a.every((entry, index) => entry.key === b[index].key);
};
