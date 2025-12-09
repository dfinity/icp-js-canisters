import { createServices, type CanisterOptions } from "@dfinity/utils";
import {
  idlFactoryCertifiedSnsWasm,
  idlFactorySnsWasm,
  type SnsWasmDid,
  type SnsWasmService,
} from "../declarations";
import { MAINNET_SNS_WASM_CANISTER_ID } from "./constants/canister_ids";

export class SnsWasmCanister {
  private constructor(
    private readonly service: SnsWasmService,
    private readonly certifiedService: SnsWasmService,
  ) {}

  public static create(options: CanisterOptions<SnsWasmService> = {}) {
    const { service, certifiedService } = createServices<SnsWasmService>({
      options: {
        ...options,
        canisterId: options.canisterId ?? MAINNET_SNS_WASM_CANISTER_ID,
      },
      idlFactory: idlFactorySnsWasm,
      certifiedIdlFactory: idlFactoryCertifiedSnsWasm,
    });

    return new SnsWasmCanister(service, certifiedService);
  }

  public listSnses = async ({
    certified = true,
  }: {
    certified?: boolean;
  }): Promise<SnsWasmDid.DeployedSns[]> => {
    const service = certified ? this.certifiedService : this.service;

    const { instances } = await service.list_deployed_snses({});
    return instances;
  };
}
