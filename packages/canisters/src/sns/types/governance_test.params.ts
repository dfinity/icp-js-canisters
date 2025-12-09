import type { QueryParams } from "@dfinity/utils";
import type { SnsGovernanceDid } from "../../declarations";
import type { E8s } from "./common";

export interface SnsAddMaturityParams extends QueryParams {
  id: SnsGovernanceDid.NeuronId;
  amountE8s: E8s;
}
