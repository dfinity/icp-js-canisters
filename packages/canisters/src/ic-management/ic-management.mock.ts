import { Principal } from "@icp-sdk/core/principal";
import {
  toCanisterSettings,
  type CanisterSettings,
} from "./types/ic-management.params";

export const mockPrincipalText =
  "xlmdg-vkosz-ceopx-7wtgu-g3xmd-koiyc-awqaq-7modz-zf6r6-364rh-oqe";

export const mockPrincipal = Principal.fromText(mockPrincipalText);

export const mockCanisterId = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");

export const mockCanisterSettings: CanisterSettings = {
  freezingThreshold: BigInt(2),
  controllers: [mockPrincipalText],
  memoryAllocation: BigInt(4),
  computeAllocation: BigInt(10),
};

export const mappedMockCanisterSettings =
  toCanisterSettings(mockCanisterSettings);

const mockLocalSubnetId = [0, 0, 0, 0, 0, 0, 0, 1];

export const mockSnapshotId = Uint8Array.from([
  ...mockCanisterId.toUint8Array(),
  ...mockLocalSubnetId,
]);

export const mockSnapshotIdHex = "000000000000000201010000000000000001";
