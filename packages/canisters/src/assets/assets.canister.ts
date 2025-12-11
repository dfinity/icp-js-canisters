import {
  Actor,
  type ActorConfig,
  type ActorSubclass,
} from "@icp-sdk/core/agent";
import { type AssetsService, idlFactoryAssets } from "../declarations";

/**
 * Create an assets canister actor
 * @param config Configuration to make calls to the Replica.
 */
export const getAssetsCanister = (
  config: ActorConfig,
): ActorSubclass<AssetsService> =>
  Actor.createActor<AssetsService>(idlFactoryAssets, config);
