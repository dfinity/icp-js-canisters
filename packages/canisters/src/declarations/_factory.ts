import { idlFactory as idlFactoryCertifiedAssets } from "./assets/assets_assetstorage.certified.idl";
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
import { idlFactory as idlFactoryCertifiedIcrcIndex } from "./ledger-icrc/icrc_index.certified.idl";
import { idlFactory as idlFactoryIcrcIndex } from "./ledger-icrc/icrc_index.idl";
import { idlFactory as idlFactoryCertifiedIcrcLedger } from "./ledger-icrc/icrc_ledger.certified.idl";
import { idlFactory as idlFactoryIcrcLedger } from "./ledger-icrc/icrc_ledger.idl";
import { idlFactory as idlFactoryCertifiedIcrcNftLedger } from "./ledger-icrc/icrc_nft-ledger.certified.idl";
import { idlFactory as idlFactoryIcrcNftLedger } from "./ledger-icrc/icrc_nft-ledger.idl";
import { idlFactory as idlFactoryCertifiedNnsGenesisToken } from "./nns/genesis_token.certified.idl";
import { idlFactory as idlFactoryNnsGenesisToken } from "./nns/genesis_token.idl";
import { idlFactory as idlFactoryCertifiedNnsGovernance } from "./nns/governance.certified.idl";
import { idlFactory as idlFactoryNnsGovernance } from "./nns/governance.idl";
import { idlFactory as idlFactoryCertifiedNnsGovernanceTest } from "./nns/governance_test.certified.idl";
import { idlFactory as idlFactoryNnsGovernanceTest } from "./nns/governance_test.idl";
import { idlFactory as idlFactoryCertifiedSnsWasm } from "./nns/sns_wasm.certified.idl";
import { idlFactory as idlFactorySnsWasm } from "./nns/sns_wasm.idl";
import { idlFactory as idlFactoryCertifiedSnsGovernance } from "./sns/governance.certified.idl";
import { idlFactory as idlFactorySnsGovernance } from "./sns/governance.idl";
import { idlFactory as idlFactoryCertifiedSnsGovernanceTest } from "./sns/governance_test.certified.idl";
import { idlFactory as idlFactorySnsGovernanceTest } from "./sns/governance_test.idl";
import { idlFactory as idlFactoryCertifiedSnsRoot } from "./sns/root.certified.idl";
import { idlFactory as idlFactorySnsRoot } from "./sns/root.idl";
import { idlFactory as idlFactoryCertifiedSnsSwap } from "./sns/swap.certified.idl";
import { idlFactory as idlFactorySnsSwap } from "./sns/swap.idl";

import type { _SERVICE as AssetsService } from "./assets/assets_assetstorage";
import type { _SERVICE as BitcoinService } from "./ckbtc/bitcoin";
import type { _SERVICE as CkBtcMinterService } from "./ckbtc/minter";
import type { _SERVICE as CkEthMinterService } from "./cketh/minter";
import type { _SERVICE as CkEthOrchestratorService } from "./cketh/orchestrator";
import type { _SERVICE as CmcService } from "./cmc/cmc";
import type { _SERVICE as IcManagementService } from "./ic-management/ic-management";
import type { _SERVICE as IcpIndexService } from "./ledger-icp/index";
import type { _SERVICE as IcpLedgerService } from "./ledger-icp/ledger";
import type { _SERVICE as IcrcIcrc1Service } from "./ledger-icrc/icrc_icrc-1";
import type { _SERVICE as IcrcIndexService } from "./ledger-icrc/icrc_index";
import type { _SERVICE as IcrcLedgerService } from "./ledger-icrc/icrc_ledger";
import type { _SERVICE as IcrcNftLedgerService } from "./ledger-icrc/icrc_nft-ledger";
import type { _SERVICE as NnsGenesisTokenService } from "./nns/genesis_token";
import type { _SERVICE as NnsGovernanceService } from "./nns/governance";
import type { _SERVICE as NnsGovernanceTestService } from "./nns/governance_test";
import type { _SERVICE as SnsWasmService } from "./nns/sns_wasm";
import type { _SERVICE as SnsGovernanceService } from "./sns/governance";
import type { _SERVICE as SnsGovernanceTestService } from "./sns/governance_test";
import type { _SERVICE as SnsRootService } from "./sns/root";
import type { _SERVICE as SnsSwapService } from "./sns/swap";

export {
  idlFactoryAssets,
  idlFactoryBitcoin,
  idlFactoryCertifiedAssets,
  idlFactoryCertifiedBitcoin,
  idlFactoryCertifiedCkBtcMinter,
  idlFactoryCertifiedCkEthMinter,
  idlFactoryCertifiedCkEthOrchestrator,
  idlFactoryCertifiedCmc,
  idlFactoryCertifiedIcManagement,
  idlFactoryCertifiedIcpIndex,
  idlFactoryCertifiedIcpLedger,
  idlFactoryCertifiedIcrcIndex,
  idlFactoryCertifiedIcrcLedger,
  idlFactoryCertifiedIcrcNftLedger,
  idlFactoryCertifiedNnsGenesisToken,
  idlFactoryCertifiedNnsGovernance,
  idlFactoryCertifiedNnsGovernanceTest,
  idlFactoryCertifiedSnsGovernance,
  idlFactoryCertifiedSnsGovernanceTest,
  idlFactoryCertifiedSnsRoot,
  idlFactoryCertifiedSnsSwap,
  idlFactoryCertifiedSnsWasm,
  idlFactoryCkBtcMinter,
  idlFactoryCkEthMinter,
  idlFactoryCkEthOrchestrator,
  idlFactoryCmc,
  idlFactoryIcManagement,
  idlFactoryIcpIndex,
  idlFactoryIcpLedger,
  idlFactoryIcrcIndex,
  idlFactoryIcrcLedger,
  idlFactoryIcrcNftLedger,
  idlFactoryNnsGenesisToken,
  idlFactoryNnsGovernance,
  idlFactoryNnsGovernanceTest,
  idlFactorySnsGovernance,
  idlFactorySnsGovernanceTest,
  idlFactorySnsRoot,
  idlFactorySnsSwap,
  idlFactorySnsWasm,
  type AssetsService,
  type BitcoinService,
  type CkBtcMinterService,
  type CkEthMinterService,
  type CkEthOrchestratorService,
  type CmcService,
  type IcManagementService,
  type IcpIndexService,
  type IcpLedgerService,
  type IcrcIcrc1Service,
  type IcrcIndexService,
  type IcrcLedgerService,
  type IcrcNftLedgerService,
  type NnsGenesisTokenService,
  type NnsGovernanceService,
  type NnsGovernanceTestService,
  type SnsGovernanceService,
  type SnsGovernanceTestService,
  type SnsRootService,
  type SnsSwapService,
  type SnsWasmService,
};
