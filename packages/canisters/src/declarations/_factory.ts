import { idlFactory as idlFactoryAssets } from "./assets/assets_assetstorage.idl";
import { idlFactory as idlFactoryCertifiedCmc } from "./cmc/cmc.certified.idl";
import { idlFactory as idlFactoryCmc } from "./cmc/cmc.idl";
import { idlFactory as idlFactoryCertifiedIcManagement } from "./ic-management/ic-management.certified.idl";
import { idlFactory as idlFactoryIcManagement } from "./ic-management/ic-management.idl";
import { idlFactory as idlFactoryCertifiedIcrcIndexNg } from "./ledger-icrc/icrc_index-ng.certified.idl";
import { idlFactory as idlFactoryIcrcIndexNg } from "./ledger-icrc/icrc_index-ng.idl";
import { idlFactory as idlFactoryCertifiedIcrcIndex } from "./ledger-icrc/icrc_index.certified.idl";
import { idlFactory as idlFactoryIcrcIndex } from "./ledger-icrc/icrc_index.idl";
import { idlFactory as idlFactoryCertifiedIcrcLedger } from "./ledger-icrc/icrc_ledger.certified.idl";
import { idlFactory as idlFactoryIcrcLedger } from "./ledger-icrc/icrc_ledger.idl";
import { idlFactory as idlFactoryCertifiedIcrcNftLedger } from "./ledger-icrc/icrc_nft-ledger.certified.idl";
import { idlFactory as idlFactoryIcrcNftLedger } from "./ledger-icrc/icrc_nft-ledger.idl";

import type { _SERVICE as AssetsService } from "./assets/assets_assetstorage";
import type { _SERVICE as CmcService } from "./cmc/cmc";
import type { _SERVICE as IcManagementService } from "./ic-management/ic-management";
import type { _SERVICE as IcrcIndexService } from "./ledger-icrc/icrc_index";
import type { _SERVICE as IcrcIndexNgService } from "./ledger-icrc/icrc_index-ng";
import type { _SERVICE as IcrcLedgerService } from "./ledger-icrc/icrc_ledger";
import type { _SERVICE as IcrcNftLedgerService } from "./ledger-icrc/icrc_nft-ledger";

export {
  idlFactoryAssets,
  idlFactoryCertifiedCmc,
  idlFactoryCertifiedIcManagement,
  idlFactoryCertifiedIcrcIndex,
  idlFactoryCertifiedIcrcIndexNg,
  idlFactoryCertifiedIcrcLedger,
  idlFactoryCertifiedIcrcNftLedger,
  idlFactoryCmc,
  idlFactoryIcManagement,
  idlFactoryIcrcIndex,
  idlFactoryIcrcIndexNg,
  idlFactoryIcrcLedger,
  idlFactoryIcrcNftLedger,
  type AssetsService,
  type CmcService,
  type IcManagementService,
  type IcrcIndexNgService,
  type IcrcIndexService,
  type IcrcLedgerService,
  type IcrcNftLedgerService,
};
