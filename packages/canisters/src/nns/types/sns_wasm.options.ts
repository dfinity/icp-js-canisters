import type { CanisterOptions } from "@dfinity/utils";
import type { _SERVICE as SnsWasmService } from "../../declarations/nns/sns_wasm";

export type SnsWasmCanisterOptions = CanisterOptions<SnsWasmService>;
