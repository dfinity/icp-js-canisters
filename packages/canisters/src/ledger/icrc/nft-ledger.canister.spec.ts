import type { ActorSubclass } from "@icp-sdk/core/agent";
import { mock } from "vitest-mock-extended";
import type { _SERVICE as IcrcNftLedgerService } from "../../declarations/ledger-icrc/icrc_nft-ledger";
import {
  ledgerCanisterIdMock,
  tokenMetadataResponseMock,
} from "./mocks/ledger.mock";
import { IcrcNftLedgerCanister } from "./nft-ledger.canister";

describe("NFT Ledger canister", () => {
  describe("collectionMetadata", () => {
    it("should return the collection metadata", async () => {
      const service = mock<ActorSubclass<IcrcNftLedgerService>>();
      service.icrc7_collection_metadata.mockResolvedValue(
        tokenMetadataResponseMock,
      );

      const canister = IcrcNftLedgerCanister.create({
        canisterId: ledgerCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const res = await canister.collectionMetadata({});

      expect(res).toEqual(tokenMetadataResponseMock);
    });

    it("should fail when the canister call fails", async () => {
      const mockError = new Error("Canister call failed");
      const service = mock<ActorSubclass<IcrcNftLedgerService>>();
      service.icrc7_collection_metadata.mockRejectedValue(mockError);

      const canister = IcrcNftLedgerCanister.create({
        canisterId: ledgerCanisterIdMock,
        certifiedServiceOverride: service,
      });

      await expect(canister.collectionMetadata({})).rejects.toThrowError(
        mockError,
      );
    });
  });
});
