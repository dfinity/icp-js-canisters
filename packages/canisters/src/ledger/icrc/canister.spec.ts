import { arrayOfNumberToUint8Array, createServices } from "@dfinity/utils";
import type { ActorSubclass } from "@icp-sdk/core/agent";
import { Principal } from "@icp-sdk/core/principal";
import { mock } from "vitest-mock-extended";
import { idlFactory as certifiedIdlFactory } from "../../declarations/ledger-icrc/icrc_ledger.certified.idl";
import { idlFactory } from "../../declarations/ledger-icrc/icrc_ledger.idl";
import { IcrcCanister } from "./canister";
import { ledgerCanisterIdMock } from "./mocks/ledger.mock";
import type { IcrcLedgerCanisterOptions } from "./types/canister.options";
import type { IcrcCanisterService } from "./types/canister.types";

describe("ICRC canister", () => {
  class MockCanister extends IcrcCanister<IcrcCanisterService> {
    static create(options: IcrcLedgerCanisterOptions<IcrcCanisterService>) {
      const { service, certifiedService, canisterId } =
        createServices<IcrcCanisterService>({
          options,
          idlFactory,
          certifiedIdlFactory,
        });

      return new MockCanister(canisterId, service, certifiedService);
    }
  }

  const owner = Principal.fromText("aaaaa-aa");

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("balance", () => {
    it("should return the balance of main account", async () => {
      const service = mock<ActorSubclass<IcrcCanisterService>>();
      const balance = BigInt(100);
      service.icrc1_balance_of.mockResolvedValue(balance);

      const canister = MockCanister.create({
        canisterId: ledgerCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const res = await canister.balance({
        owner,
      });

      expect(service.icrc1_balance_of).toHaveBeenCalledExactlyOnceWith({
        owner,
        subaccount: [],
      });
      expect(res).toEqual(balance);
    });

    it("should return the balance of subaccount", async () => {
      const service = mock<ActorSubclass<IcrcCanisterService>>();
      const balance = BigInt(100);
      service.icrc1_balance_of.mockResolvedValue(balance);

      const canister = MockCanister.create({
        canisterId: ledgerCanisterIdMock,
        certifiedServiceOverride: service,
      });

      const subaccount = arrayOfNumberToUint8Array([0, 0, 1]);
      const res = await canister.balance({
        owner,
        subaccount,
      });

      expect(res).toEqual(balance);
    });

    it("should accept to be called as query", async () => {
      const service = mock<ActorSubclass<IcrcCanisterService>>();
      const balance = BigInt(100);
      service.icrc1_balance_of.mockResolvedValue(balance);

      const canister = MockCanister.create({
        canisterId: ledgerCanisterIdMock,
        serviceOverride: service,
      });

      const res = await canister.balance({
        owner,
        certified: false,
      });

      expect(service.icrc1_balance_of).toHaveBeenCalledExactlyOnceWith({
        owner,
        subaccount: [],
      });
      expect(res).toEqual(balance);
    });

    it("should fail when the canister call fails", async () => {
      const mockError = new Error("Canister call failed");
      const service = mock<ActorSubclass<IcrcCanisterService>>();
      service.icrc1_balance_of.mockRejectedValue(mockError);

      const canister = MockCanister.create({
        canisterId: ledgerCanisterIdMock,
        certifiedServiceOverride: service,
      });

      await expect(canister.balance({ owner })).rejects.toThrowError(mockError);
    });
  });
});
