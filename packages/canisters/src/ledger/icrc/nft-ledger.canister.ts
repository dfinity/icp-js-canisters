import { Canister, createServices, type QueryParams } from "@dfinity/utils";
import {
  idlFactoryCertifiedIcrcNftLedger,
  idlFactoryIcrcNftLedger,
  type IcrcNftLedgerService,
} from "../../declarations";
import type { IcrcLedgerCanisterOptions } from "./types/canister.options";
import type { IcrcTokenMetadataResponse } from "./types/ledger.responses";

export class IcrcNftLedgerCanister extends Canister<IcrcNftLedgerService> {
  static create(options: IcrcLedgerCanisterOptions<IcrcNftLedgerService>) {
    const { service, certifiedService, canisterId } =
      createServices<IcrcNftLedgerService>({
        options,
        idlFactory: idlFactoryIcrcNftLedger,
        certifiedIdlFactory: idlFactoryCertifiedIcrcNftLedger,
      });

    return new IcrcNftLedgerCanister(canisterId, service, certifiedService);
  }

  /**
   * The collection metadata.
   *
   * @link https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-7/ICRC-7.md#icrc7_collection_metadata
   *
   * @param {QueryParams} params The parameters to get the metadata of the collection.
   * @returns {Promise<IcrcTokenMetadataResponse>} The metadata as a list of metadata type and its value.
   */
  collectionMetadata = (
    params: QueryParams,
  ): Promise<IcrcTokenMetadataResponse> =>
    this.caller(params).icrc7_collection_metadata();
}
