import { idlFactory as idlFactoryAssets } from "./assets/assets_assetstorage.idl";
import { idlFactory as idlFactoryCertifiedCmc } from "./cmc/cmc.certified.idl";
import { idlFactory as idlFactoryCmc } from "./cmc/cmc.idl";
import { idlFactory as idlFactoryCertifiedIcManagement } from "./ic-management/ic-management.certified.idl";
import { idlFactory as idlFactoryIcManagement } from "./ic-management/ic-management.idl";
import { idlFactory as idlFactoryCertifiedNnsGenesisToken } from "./nns/genesis_token.certified.idl";
import { idlFactory as idlFactoryNnsGenesisToken } from "./nns/genesis_token.idl";
import { idlFactory as idlFactoryCertifiedNnsGovernance } from "./nns/governance.certified.idl";
import { idlFactory as idlFactoryNnsGovernance } from "./nns/governance.idl";
import { idlFactory as idlFactoryCertifiedNnsGovernanceTest } from "./nns/governance_test.certified.idl";
import { idlFactory as idlFactoryNnsGovernanceTest } from "./nns/governance_test.idl";
import { idlFactory as idlFactoryCertifiedNnsSnsWasm } from "./nns/sns_wasm.certified.idl";
import { idlFactory as idlFactoryNnsSnsWasm } from "./nns/sns_wasm.idl";

import type { _SERVICE as AssetsService } from "./assets/assets_assetstorage";
import type { _SERVICE as CmcService } from "./cmc/cmc";
import type { _SERVICE as IcManagementService } from "./ic-management/ic-management";
import type { _SERVICE as NnsGenesisTokenService } from "./nns/genesis_token";
import type { _SERVICE as NnsGovernanceService } from "./nns/governance";
import type { _SERVICE as NnsGovernanceTestService } from "./nns/governance_test";
import type { _SERVICE as NnsSnsWasmcService } from "./nns/sns_wasm";

export {
  idlFactoryAssets,
  idlFactoryCertifiedCmc,
  idlFactoryCertifiedIcManagement,
  idlFactoryCertifiedNnsGenesisToken,
  idlFactoryCertifiedNnsGovernance,
  idlFactoryCertifiedNnsGovernanceTest,
  idlFactoryCertifiedNnsSnsWasm,
  idlFactoryCmc,
  idlFactoryIcManagement,
  idlFactoryNnsGenesisToken,
  idlFactoryNnsGovernance,
  idlFactoryNnsGovernanceTest,
  idlFactoryNnsSnsWasm,
  type AssetsService,
  type CmcService,
  type IcManagementService,
  type NnsGenesisTokenService,
  type NnsGovernanceService,
  type NnsGovernanceTestService,
  type NnsSnsWasmcService,
};
