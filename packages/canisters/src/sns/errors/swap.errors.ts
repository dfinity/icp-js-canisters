import type { InvalidUserAmount, Ticket } from "../../declarations/sns/swap";
import type {
  GetOpenTicketErrorType,
  NewSaleTicketResponseErrorType,
} from "../enums/swap.enums";

export class SnsSwapNewTicketError extends Error {
  public errorType: NewSaleTicketResponseErrorType;
  public invalidUserAmount?: InvalidUserAmount;
  public existingTicket?: Ticket;

  constructor({
    errorType,
    invalidUserAmount,
    existingTicket,
  }: {
    errorType: NewSaleTicketResponseErrorType;
    invalidUserAmount?: InvalidUserAmount;
    existingTicket?: Ticket;
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
