import { idlFactory as idlFactoryAssets } from "./assets/assets_assetstorage.idl";
import { idlFactory as idlFactoryCertifiedCmc } from "./cmc/cmc.certified.idl";
import { idlFactory as idlFactoryCmc } from "./cmc/cmc.idl";
import { idlFactory as idlFactoryCertifiedIcManagement } from "./ic-management/ic-management.certified.idl";
import { idlFactory as idlFactoryIcManagement } from "./ic-management/ic-management.idl";
import { idlFactory as idlFactoryCertifiedSnsGovernance } from "./sns/governance.certified.idl";
import { idlFactory as idlFactorySnsGovernance } from "./sns/governance.idl";
import { idlFactory as idlFactoryCertifiedSnsGovernanceTest } from "./sns/governance_test.certified.idl";
import { idlFactory as idlFactorySnsGovernanceTest } from "./sns/governance_test.idl";
import { idlFactory as idlFactoryCertifiedSnsRoot } from "./sns/root.certified.idl";
import { idlFactory as idlFactorySnsRoot } from "./sns/root.idl";
import { idlFactory as idlFactoryCertifiedSnsSwap } from "./sns/swap.certified.idl";
import { idlFactory as idlFactorySnsSwap } from "./sns/swap.idl";

import type { _SERVICE as AssetsService } from "./assets/assets_assetstorage";
import type { _SERVICE as CmcService } from "./cmc/cmc";
import type { _SERVICE as IcManagementService } from "./ic-management/ic-management";
import type { _SERVICE as SnsGovernanceService } from "./sns/governance";
import type { _SERVICE as SnsGovernanceTestService } from "./sns/governance_test";
import type { _SERVICE as SnsRootService } from "./sns/root";
import type { _SERVICE as SnsSwapService } from "./sns/swap";

export {
  idlFactoryAssets,
  idlFactoryCertifiedCmc,
  idlFactoryCertifiedIcManagement,
  idlFactoryCertifiedSnsGovernance,
  idlFactoryCertifiedSnsGovernanceTest,
  idlFactoryCertifiedSnsRoot,
  idlFactoryCertifiedSnsSwap,
  idlFactoryCmc,
  idlFactoryIcManagement,
  idlFactorySnsGovernance,
  idlFactorySnsGovernanceTest,
  idlFactorySnsRoot,
  idlFactorySnsSwap,
  type AssetsService,
  type CmcService,
  type IcManagementService,
  type SnsGovernanceService,
  type SnsGovernanceTestService,
  type SnsRootService,
  type SnsSwapService,
};
