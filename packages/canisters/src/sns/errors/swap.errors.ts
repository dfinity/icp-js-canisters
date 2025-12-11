import type { SnsSwapDid } from "../../declarations";
import type {
  GetOpenTicketErrorType,
  NewSaleTicketResponseErrorType,
} from "../enums/swap.enums";

export class SnsSwapNewTicketError extends Error {
  public errorType: NewSaleTicketResponseErrorType;
  public invalidUserAmount?: SnsSwapDid.InvalidUserAmount;
  public existingTicket?: SnsSwapDid.Ticket;

  constructor({
    errorType,
    invalidUserAmount,
    existingTicket,
  }: {
    errorType: NewSaleTicketResponseErrorType;
    invalidUserAmount?: SnsSwapDid.InvalidUserAmount;
    existingTicket?: SnsSwapDid.Ticket;
  }) {
    super();
    this.errorType = errorType;
    this.invalidUserAmount = invalidUserAmount;
    this.existingTicket = existingTicket;
  }
}

export class SnsSwapGetOpenTicketError extends Error {
  constructor(public errorType: GetOpenTicketErrorType) {
    super();
  }
}
