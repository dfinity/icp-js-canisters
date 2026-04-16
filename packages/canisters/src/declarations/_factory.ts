import type { _SERVICE as AssetsService } from "./assets/assets_assetstorage";
import { idlFactory as idlFactoryCertifiedAssets } from "./assets/assets_assetstorage.certified.idl";
import { idlFactory as idlFactoryAssets } from "./assets/assets_assetstorage.idl";
import type { _SERVICE as BitcoinService } from "./ckbtc/bitcoin";
import { idlFactory as idlFactoryCertifiedBitcoin } from "./ckbtc/bitcoin.certified.idl";
import { idlFactory as idlFactoryBitcoin } from "./ckbtc/bitcoin.idl";
import type { _SERVICE as CkBtcMinterService } from "./ckbtc/minter";
import { idlFactory as idlFactoryCertifiedCkBtcMinter } from "./ckbtc/minter.certified.idl";
import { idlFactory as idlFactoryCkBtcMinter } from "./ckbtc/minter.idl";
import type { _SERVICE as CkEthMinterService } from "./cketh/minter";
import { idlFactory as idlFactoryCertifiedCkEthMinter } from "./cketh/minter.certified.idl";
import { idlFactory as idlFactoryCkEthMinter } from "./cketh/minter.idl";
import type { _SERVICE as CkEthOrchestratorService } from "./cketh/orchestrator";
import { idlFactory as idlFactoryCertifiedCkEthOrchestrator } from "./cketh/orchestrator.certified.idl";
import { idlFactory as idlFactoryCkEthOrchestrator } from "./cketh/orchestrator.idl";
import type { _SERVICE as CmcService } from "./cmc/cmc";
import { idlFactory as idlFactoryCertifiedCmc } from "./cmc/cmc.certified.idl";
import { idlFactory as idlFactoryCmc } from "./cmc/cmc.idl";
import type { _SERVICE as CyclesLedgerService } from "./cycles-ledger/cycles-ledger";
import { idlFactory as idlFactoryCertifiedCyclesLedger } from "./cycles-ledger/cycles-ledger.certified.idl";
import { idlFactory as idlFactoryCyclesLedger } from "./cycles-ledger/cycles-ledger.idl";
import type { _SERVICE as IcManagementService } from "./ic-management/ic-management";
import { idlFactory as idlFactoryCertifiedIcManagement } from "./ic-management/ic-management.certified.idl";
import { idlFactory as idlFactoryIcManagement } from "./ic-management/ic-management.idl";
import type { _SERVICE as IcpIndexService } from "./ledger-icp/index";
import { idlFactory as idlFactoryCertifiedIcpIndex } from "./ledger-icp/index.certified.idl";
import { idlFactory as idlFactoryIcpIndex } from "./ledger-icp/index.idl";
import type { _SERVICE as IcpLedgerService } from "./ledger-icp/ledger";
import { idlFactory as idlFactoryCertifiedIcpLedger } from "./ledger-icp/ledger.certified.idl";
import { idlFactory as idlFactoryIcpLedger } from "./ledger-icp/ledger.idl";
import type { _SERVICE as IcrcIcrc1Service } from "./ledger-icrc/icrc_icrc-1";
import type { _SERVICE as IcrcIndexService } from "./ledger-icrc/icrc_index";
import { idlFactory as idlFactoryCertifiedIcrcIndex } from "./ledger-icrc/icrc_index.certified.idl";
import { idlFactory as idlFactoryIcrcIndex } from "./ledger-icrc/icrc_index.idl";
import type { _SERVICE as IcrcLedgerService } from "./ledger-icrc/icrc_ledger";
import { idlFactory as idlFactoryCertifiedIcrcLedger } from "./ledger-icrc/icrc_ledger.certified.idl";
import { idlFactory as idlFactoryIcrcLedger } from "./ledger-icrc/icrc_ledger.idl";
import type { _SERVICE as IcrcNftLedgerService } from "./ledger-icrc/icrc_nft-ledger";
import { idlFactory as idlFactoryCertifiedIcrcNftLedger } from "./ledger-icrc/icrc_nft-ledger.certified.idl";
import { idlFactory as idlFactoryIcrcNftLedger } from "./ledger-icrc/icrc_nft-ledger.idl";
import type { _SERVICE as NnsGenesisTokenService } from "./nns/genesis_token";
import { idlFactory as idlFactoryCertifiedNnsGenesisToken } from "./nns/genesis_token.certified.idl";
import { idlFactory as idlFactoryNnsGenesisToken } from "./nns/genesis_token.idl";
import type { _SERVICE as NnsGovernanceService } from "./nns/governance";
import { idlFactory as idlFactoryCertifiedNnsGovernance } from "./nns/governance.certified.idl";
import { idlFactory as idlFactoryNnsGovernance } from "./nns/governance.idl";
import type { _SERVICE as NnsGovernanceTestService } from "./nns/governance_test";
import { idlFactory as idlFactoryCertifiedNnsGovernanceTest } from "./nns/governance_test.certified.idl";
import { idlFactory as idlFactoryNnsGovernanceTest } from "./nns/governance_test.idl";
import type { _SERVICE as SnsWasmService } from "./nns/sns_wasm";
import { idlFactory as idlFactoryCertifiedSnsWasm } from "./nns/sns_wasm.certified.idl";
import { idlFactory as idlFactorySnsWasm } from "./nns/sns_wasm.idl";
import type { _SERVICE as SnsGovernanceService } from "./sns/governance";
import { idlFactory as idlFactoryCertifiedSnsGovernance } from "./sns/governance.certified.idl";
import { idlFactory as idlFactorySnsGovernance } from "./sns/governance.idl";
import type { _SERVICE as SnsGovernanceTestService } from "./sns/governance_test";
import { idlFactory as idlFactoryCertifiedSnsGovernanceTest } from "./sns/governance_test.certified.idl";
import { idlFactory as idlFactorySnsGovernanceTest } from "./sns/governance_test.idl";
import type { _SERVICE as SnsRootService } from "./sns/root";
import { idlFactory as idlFactoryCertifiedSnsRoot } from "./sns/root.certified.idl";
import { idlFactory as idlFactorySnsRoot } from "./sns/root.idl";
import type { _SERVICE as SnsSwapService } from "./sns/swap";
import { idlFactory as idlFactoryCertifiedSnsSwap } from "./sns/swap.certified.idl";
import { idlFactory as idlFactorySnsSwap } from "./sns/swap.idl";

export {
  idlFactoryAssets,
  idlFactoryBitcoin,
  idlFactoryCertifiedAssets,
  idlFactoryCertifiedBitcoin,
  idlFactoryCertifiedCkBtcMinter,
  idlFactoryCertifiedCkEthMinter,
  idlFactoryCertifiedCkEthOrchestrator,
  idlFactoryCertifiedCmc,
  idlFactoryCertifiedCyclesLedger,
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
  idlFactoryCyclesLedger,
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
  type CyclesLedgerService,
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
