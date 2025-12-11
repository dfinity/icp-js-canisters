import type { E8s } from "./common";

/**
 * The parameters to create a sale ticket (payment flow)
 */
export interface NewSaleTicketParams {
  subaccount?: Uint8Array;
  amount_icp_e8s: E8s;
}
