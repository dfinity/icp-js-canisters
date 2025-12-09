// Source: https://github.com/dfinity/ic/blob/master/rs/sns/swap/gen/ic_sns_swap.pb.v1.rs - Lifecycle
export enum SnsSwapLifecycle {
  Unspecified = 0,
  Pending = 1,
  Open = 2,
  Committed = 3,
  Aborted = 4,
  Adopted = 5,
}

// Source: https://gitlab.com/dfinity-lab/public/ic/-/blob/5936d73770dbd16dab9b23379367a8bd5513fb88/rs/sns/swap/proto/ic_sns_swap/pb/v1/swap.proto#L887
export enum GetOpenTicketErrorType {
  TYPE_UNSPECIFIED = 0,
  TYPE_SALE_NOT_OPEN = 1,
  TYPE_SALE_CLOSED = 2,
}

// Source: https://gitlab.com/dfinity-lab/public/ic/-/blob/5936d73770dbd16dab9b23379367a8bd5513fb88/rs/sns/swap/proto/ic_sns_swap/pb/v1/swap.proto#L928
export enum NewSaleTicketResponseErrorType {
  TYPE_UNSPECIFIED = 0,
  TYPE_SALE_NOT_OPEN = 1,
  TYPE_SALE_CLOSED = 2,
  // There is already an open ticket associated with the caller.
  //
  // When this is the `error_type`, then the field existing_ticket
  // is set and contains the ticket itself.
  TYPE_TICKET_EXISTS = 3,
  // The amount sent by the user is not within the Sale parameters.
  //
  // When this is the `error_type`, then the field invalid_user_amount
  // is set and describes minimum and maximum amounts.
  TYPE_INVALID_USER_AMOUNT = 4,
  // The specified subaccount is not a valid subaccount (length != 32 bytes).
  TYPE_INVALID_SUBACCOUNT = 5,
  // The specified principal is forbidden from creating tickets.
  TYPE_INVALID_PRINCIPAL = 6,
}
