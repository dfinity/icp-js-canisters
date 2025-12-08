import { idlFactory as idlFactoryAssets } from "./assets/assets_assetstorage.idl";
import { idlFactory as idlFactoryCertifiedCmc } from "./cmc/cmc.certified.idl";
import { idlFactory as idlFactoryCmc } from "./cmc/cmc.idl";
import { idlFactory as idlFactoryCertifiedIcManagement } from "./ic-management/ic-management.certified.idl";
import { idlFactory as idlFactoryIcManagement } from "./ic-management/ic-management.idl";
import { idlFactory as idlFactoryCertifiedIcpIndex } from "./ledger-icp/index.certified.idl";
import { idlFactory as idlFactoryIcpIndex } from "./ledger-icp/index.idl";
import { idlFactory as idlFactoryCertifiedIcpLedger } from "./ledger-icp/ledger.certified.idl";
import { idlFactory as idlFactoryIcpLedger } from "./ledger-icp/ledger.idl";

import type { _SERVICE as AssetsService } from "./assets/assets_assetstorage";
import type { _SERVICE as CmcService } from "./cmc/cmc";
import type { _SERVICE as IcManagementService } from "./ic-management/ic-management";
import type { _SERVICE as IcpIndexService } from "./ledger-icp/index";
import type { _SERVICE as IcpLedgerService } from "./ledger-icp/ledger";

export {
  idlFactoryAssets,
  idlFactoryCertifiedCmc,
  idlFactoryCertifiedIcManagement,
  idlFactoryCertifiedIcpIndex,
  idlFactoryCertifiedIcpLedger,
  idlFactoryCmc,
  idlFactoryIcManagement,
  idlFactoryIcpIndex,
  idlFactoryIcpLedger,
  type AssetsService,
  type CmcService,
  type IcManagementService,
  type IcpIndexService,
  type IcpLedgerService,
};
