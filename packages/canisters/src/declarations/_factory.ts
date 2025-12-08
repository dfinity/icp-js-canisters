import { idlFactory as idlFactoryAssets } from "./assets/assets_assetstorage.idl";
import { idlFactory as idlFactoryCertifiedCkBtcBitcoin } from "./ckbtc/bitcoin.certified.idl";
import { idlFactory as idlFactoryCkBtcBitcoin } from "./ckbtc/bitcoin.idl";
import { idlFactory as idlFactoryCertifiedCkBtcMinter } from "./ckbtc/minter.certified.idl";
import { idlFactory as idlFactoryCkBtcMinter } from "./ckbtc/minter.idl";
import { idlFactory as idlFactoryCertifiedCmc } from "./cmc/cmc.certified.idl";
import { idlFactory as idlFactoryCmc } from "./cmc/cmc.idl";
import { idlFactory as idlFactoryCertifiedIcManagement } from "./ic-management/ic-management.certified.idl";
import { idlFactory as idlFactoryIcManagement } from "./ic-management/ic-management.idl";

import type { _SERVICE as AssetsService } from "./assets/assets_assetstorage";
import type { _SERVICE as CkBtcBitcoinService } from "./ckbtc/bitcoin";
import type { _SERVICE as CkBtcMinterService } from "./ckbtc/minter";
import type { _SERVICE as CmcService } from "./cmc/cmc";
import type { _SERVICE as IcManagementService } from "./ic-management/ic-management";

export {
  idlFactoryAssets,
  idlFactoryCertifiedCkBtcBitcoin,
  idlFactoryCertifiedCkBtcMinter,
  idlFactoryCertifiedCmc,
  idlFactoryCertifiedIcManagement,
  idlFactoryCkBtcBitcoin,
  idlFactoryCkBtcMinter,
  idlFactoryCmc,
  idlFactoryIcManagement,
  type AssetsService,
  type CkBtcBitcoinService,
  type CkBtcMinterService,
  type CmcService,
  type IcManagementService,
};
