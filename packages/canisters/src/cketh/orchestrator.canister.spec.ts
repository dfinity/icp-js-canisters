import type { ActorSubclass } from "@icp-sdk/core/agent";
import { Principal } from "@icp-sdk/core/principal";
import { mock } from "vitest-mock-extended";
import type {
  _SERVICE as CkETHOrchestratorService,
  ManagedCanisters,
  OrchestratorInfo,
} from "../declarations/cketh/orchestrator";
import { minterCanisterIdMock } from "./mocks/minter.mock";
import { CkETHOrchestratorCanister } from "./orchestrator.canister";

describe("ckETH orchestrator canister", () => {
  const orchestrator = (
    service: ActorSubclass<CkETHOrchestratorService>,
  ): CkETHOrchestratorCanister =>
    CkETHOrchestratorCanister.create({
      // ckSepoliaETH Orchestrator Canister ID on mainnet
      canisterId: Principal.from("2s5qh-7aaaa-aaaar-qadya-cai"),
      certifiedServiceOverride: service,
    });

  describe("Get orchestrator info", () => {
    it("should return the info", async () => {
      const ckSepoliaUSDCInfoMock: ManagedCanisters = {
        ledger: [
          {
            Installed: {
              canister_id: Principal.from("yfumr-cyaaa-aaaar-qaela-cai"),
              installed_wasm_hash:
                "57e2a728f9ffcb1a7d9e101dbd1260f8b9f3246bf5aa2ad3e2c750e125446838",
            },
          },
        ],
        index: [
          {
            Installed: {
              canister_id: Principal.from("ycvkf-paaaa-aaaar-qaelq-cai"),
              installed_wasm_hash:
                "6fb62c7e9358ca5c937a5d25f55700459ed09a293d0826c09c631b64ba756594",
            },
          },
        ],
        archives: [],
        ckerc20_token_symbol: "ckSepoliaUSDC",
        erc20_contract: {
          chain_id: 11_155_111n,
          address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        },
      };

      const mockCanisterId = Principal.from("yfumr-cyaaa-aaaar-qaela-cai");

      const orchestratorInfoMock: OrchestratorInfo = {
        minter_id: [minterCanisterIdMock],
        more_controller_ids: [],
        cycles_management: {
          cycles_for_archive_creation: 1_000_000_000_000n,
          cycles_for_index_creation: 1_000_000_000_000n,
          cycles_top_up_increment: 500_000_000_000n,
          cycles_for_ledger_creation: 2_000_000_000_000n,
        },
        managed_canisters: [ckSepoliaUSDCInfoMock],
        ledger_suite_version: [
          {
            archive_compressed_wasm_hash: "1234",
            ledger_compressed_wasm_hash: "abcd",
            index_compressed_wasm_hash: "efgdh",
          },
        ],
        managed_pre_existing_ledger_suites: [
          [
            {
              token_symbol: "def",
              ledger: [{ Created: { canister_id: mockCanisterId } }],
              index: [{ Created: { canister_id: mockCanisterId } }],
              archives: [mockCanisterId],
            },
          ],
        ],
      };

      const service = mock<ActorSubclass<CkETHOrchestratorService>>();
      service.get_orchestrator_info.mockResolvedValue(orchestratorInfoMock);

      const canister = orchestrator(service);

      const res = await canister.getOrchestratorInfo();

      expect(service.get_orchestrator_info).toHaveBeenCalled();
      expect(res).toEqual(orchestratorInfoMock);
    });

    it("should bubble errors", () => {
      const service = mock<ActorSubclass<CkETHOrchestratorService>>();
      service.get_orchestrator_info.mockImplementation(() => {
        throw new Error();
      });

      const canister = orchestrator(service);

      expect(() => canister.getOrchestratorInfo()).toThrowError();
    });
  });
});
