import { Canister, createServices, type QueryParams } from "@dfinity/utils";
import {
  type CkEthOrchestratorDid,
  type CkEthOrchestratorService,
  idlFactoryCertifiedCkEthOrchestrator,
  idlFactoryCkEthOrchestrator,
} from "../declarations";
import type { CkEthOrchestratorCanisterOptions } from "./types/canister.options";

/**
 * Class representing the CkEth Orchestrator Canister, which manages the Ledger and Index canisters of ckERC20 tokens.
 * @extends {Canister<CkEthOrchestratorService>}
 * @see {@link https://github.com/dfinity/ic/tree/master/rs/ethereum/ledger-suite-orchestrator|Source Code}
 */
export class CkEthOrchestratorCanister extends Canister<CkEthOrchestratorService> {
  /**
   * Creates an instance of CkEthOrchestratorCanister.
   * @param {CkEthOrchestratorCanisterOptions<CkEthOrchestratorService>} options - Options for creating the canister.
   * @returns {CkEthOrchestratorCanister} A new instance of CkEthOrchestratorCanister.
   */
  static create(
    options: CkEthOrchestratorCanisterOptions<CkEthOrchestratorService>,
  ): CkEthOrchestratorCanister {
    const { service, certifiedService, canisterId } =
      createServices<CkEthOrchestratorService>({
        options,
        idlFactory: idlFactoryCkEthOrchestrator,
        certifiedIdlFactory: idlFactoryCertifiedCkEthOrchestrator,
      });

    return new CkEthOrchestratorCanister(canisterId, service, certifiedService);
  }

  /**
   * Retrieves orchestrator information, which contains the list of existing ckERC20 Ledger and Index canisters.
   * @param {QueryParams} [params={}] - The query parameters.
   * @param {boolean} [params.certified] - Whether to execute a certified (update) call.
   * @returns {Promise<OrchestratorInfo>} A promise that resolves to the orchestrator information.
   */
  getOrchestratorInfo = ({
    certified,
  }: QueryParams = {}): Promise<CkEthOrchestratorDid.OrchestratorInfo> => {
    const { get_orchestrator_info } = this.caller({ certified });
    return get_orchestrator_info();
  };
}
