import { idlFactory as idlFactoryAssets } from "./assets/assets_assetstorage.idl";
import { idlFactory as idlFactoryCertifiedCmc } from "./cmc/cmc.certified.idl";
import { idlFactory as idlFactoryCmc } from "./cmc/cmc.idl";

import type { _SERVICE as AssetsActor } from "./assets/assets_assetstorage";
import type { _SERVICE as CmcService } from "./cmc/cmc";

export {
  idlFactoryAssets,
  idlFactoryCertifiedCmc,
  idlFactoryCmc,
  type AssetsActor,
  type CmcService,
};
