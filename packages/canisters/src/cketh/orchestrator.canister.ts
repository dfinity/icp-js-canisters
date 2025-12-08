import { Canister, createServices, type QueryParams } from "@dfinity/utils";
import type {
  _SERVICE as CkETHOrchestratorService,
  OrchestratorInfo,
} from "../declarations/cketh/orchestrator";
import { idlFactory as certifiedIdlFactory } from "../declarations/cketh/orchestrator.certified.idl";
import { idlFactory } from "../declarations/cketh/orchestrator.idl";
import type { CkETHOrchestratorCanisterOptions } from "./types/canister.options";

/**
 * Class representing the CkETH Orchestrator Canister, which manages the Ledger and Index canisters of ckERC20 tokens.
 * @extends {Canister<CkETHOrchestratorService>}
 * @see {@link https://github.com/dfinity/ic/tree/master/rs/ethereum/ledger-suite-orchestrator|Source Code}
 */
export class CkETHOrchestratorCanister extends Canister<CkETHOrchestratorService> {
  /**
   * Creates an instance of CkETHOrchestratorCanister.
   * @param {CkETHOrchestratorCanisterOptions<CkETHOrchestratorService>} options - Options for creating the canister.
   * @returns {CkETHOrchestratorCanister} A new instance of CkETHOrchestratorCanister.
   */
  static create(
    options: CkETHOrchestratorCanisterOptions<CkETHOrchestratorService>,
  ): CkETHOrchestratorCanister {
    const { service, certifiedService, canisterId } =
      createServices<CkETHOrchestratorService>({
        options,
        idlFactory,
        certifiedIdlFactory,
      });

    return new CkETHOrchestratorCanister(canisterId, service, certifiedService);
  }

  /**
   * Retrieves orchestrator information, which contains the list of existing ckERC20 Ledger and Index canisters.
   * @param {QueryParams} [params={}] - The query parameters.
   * @param {boolean} [params.certified] - Whether to execute a certified (update) call.
   * @returns {Promise<OrchestratorInfo>} A promise that resolves to the orchestrator information.
   */
  getOrchestratorInfo = ({
    certified,
  }: QueryParams = {}): Promise<OrchestratorInfo> => {
    const { get_orchestrator_info } = this.caller({ certified });
    return get_orchestrator_info();
  };
}
