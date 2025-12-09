import { idlFactory as idlFactoryAssets } from "./assets/assets_assetstorage.idl";
import { idlFactory as idlFactoryCertifiedBitcoin } from "./ckbtc/bitcoin.certified.idl";
import { idlFactory as idlFactoryBitcoin } from "./ckbtc/bitcoin.idl";
import { idlFactory as idlFactoryCertifiedCkBtcMinter } from "./ckbtc/minter.certified.idl";
import { idlFactory as idlFactoryCkBtcMinter } from "./ckbtc/minter.idl";
import { idlFactory as idlFactoryCertifiedCkEthMinter } from "./cketh/minter.certified.idl";
import { idlFactory as idlFactoryCkEthMinter } from "./cketh/minter.idl";
import { idlFactory as idlFactoryCertifiedCkEthOrchestrator } from "./cketh/orchestrator.certified.idl";
import { idlFactory as idlFactoryCkEthOrchestrator } from "./cketh/orchestrator.idl";
import { idlFactory as idlFactoryCertifiedCmc } from "./cmc/cmc.certified.idl";
import { idlFactory as idlFactoryCmc } from "./cmc/cmc.idl";
import { idlFactory as idlFactoryCertifiedIcManagement } from "./ic-management/ic-management.certified.idl";
import { idlFactory as idlFactoryIcManagement } from "./ic-management/ic-management.idl";
import { idlFactory as idlFactoryCertifiedIcpIndex } from "./ledger-icp/index.certified.idl";
import { idlFactory as idlFactoryIcpIndex } from "./ledger-icp/index.idl";
import { idlFactory as idlFactoryCertifiedIcpLedger } from "./ledger-icp/ledger.certified.idl";
import { idlFactory as idlFactoryIcpLedger } from "./ledger-icp/ledger.idl";

import type { _SERVICE as AssetsService } from "./assets/assets_assetstorage";
import type { _SERVICE as BitcoinService } from "./ckbtc/bitcoin";
import type { _SERVICE as CkBtcMinterService } from "./ckbtc/minter";
import type { _SERVICE as CkEthMinterService } from "./cketh/minter";
import type { _SERVICE as CkEthOrchestratorService } from "./cketh/orchestrator";
import type { _SERVICE as CmcService } from "./cmc/cmc";
import type { _SERVICE as IcManagementService } from "./ic-management/ic-management";
import type { _SERVICE as IcpIndexService } from "./ledger-icp/index";
import type { _SERVICE as IcpLedgerService } from "./ledger-icp/ledger";

export {
  idlFactoryAssets,
  idlFactoryBitcoin,
  idlFactoryCertifiedBitcoin,
  idlFactoryCertifiedCkBtcMinter,
  idlFactoryCertifiedCkEthMinter,
  idlFactoryCertifiedCkEthOrchestrator,
  idlFactoryCertifiedCmc,
  idlFactoryCertifiedIcManagement,
  idlFactoryCertifiedIcpIndex,
  idlFactoryCertifiedIcpLedger,
  idlFactoryCkBtcMinter,
  idlFactoryCkEthMinter,
  idlFactoryCkEthOrchestrator,
  idlFactoryCmc,
  idlFactoryIcManagement,
  idlFactoryIcpIndex,
  idlFactoryIcpLedger,
  type AssetsService,
  type BitcoinService,
  type CkBtcMinterService,
  type CkEthMinterService,
  type CkEthOrchestratorService,
  type CmcService,
  type IcManagementService,
  type IcpIndexService,
  type IcpLedgerService,
};
