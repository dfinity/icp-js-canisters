import type { Icrc21ConsentMessageRequest } from "../types/ledger_converters";

export const mockConsentMessageRequest: Icrc21ConsentMessageRequest = {
  method: "icrc1_transfer",
  arg: new Uint8Array([1, 2, 3]),
  userPreferences: {
    metadata: {
      language: "en-US",
    },
    deriveSpec: {
      GenericDisplay: null,
    },
  },
};
