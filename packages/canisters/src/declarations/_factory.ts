import { idlFactory as idlFactoryAssets } from "./assets/assets_assetstorage.idl";
import { idlFactory as idlFactoryCertifiedCkEthMinter } from "./cketh/minter.certified.idl";
import { idlFactory as idlFactoryCkEthMinter } from "./cketh/minter.idl";
import { idlFactory as idlFactoryCertifiedCkEthOrchestrator } from "./cketh/orchestrator.certified.idl";
import { idlFactory as idlFactoryCkEthOrchestrator } from "./cketh/orchestrator.idl";
import { idlFactory as idlFactoryCertifiedCmc } from "./cmc/cmc.certified.idl";
import { idlFactory as idlFactoryCmc } from "./cmc/cmc.idl";
import { idlFactory as idlFactoryCertifiedIcManagement } from "./ic-management/ic-management.certified.idl";
import { idlFactory as idlFactoryIcManagement } from "./ic-management/ic-management.idl";

import type { _SERVICE as AssetsService } from "./assets/assets_assetstorage";
import type { _SERVICE as CkEthMinterService } from "./cketh/minter";
import type { _SERVICE as CkEthOrchestratorService } from "./cketh/orchestrator";
import type { _SERVICE as CmcService } from "./cmc/cmc";
import type { _SERVICE as IcManagementService } from "./ic-management/ic-management";

export {
  idlFactoryAssets,
  idlFactoryCertifiedCkEthMinter,
  idlFactoryCertifiedCkEthOrchestrator,
  idlFactoryCertifiedCmc,
  idlFactoryCertifiedIcManagement,
  idlFactoryCkEthMinter,
  idlFactoryCkEthOrchestrator,
  idlFactoryCmc,
  idlFactoryIcManagement,
  type AssetsService,
  type CkEthMinterService,
  type CkEthOrchestratorService,
  type CmcService,
  type IcManagementService,
};
