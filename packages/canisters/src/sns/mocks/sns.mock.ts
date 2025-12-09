import { Principal } from "@icp-sdk/core/principal";
import type { ListSnsCanistersResponse } from "../../declarations/sns/root";
import type { Ticket } from "../../declarations/sns/swap";

export const rootCanisterIdMock: Principal = Principal.fromText(
  "pin7y-wyaaa-aaaaa-aacpa-cai",
);

export const ledgerCanisterIdMock: Principal = Principal.fromText(
  "ktxdj-qiaaa-aaaaa-aacqa-cai",
);

export const governanceCanisterIdMock: Principal = Principal.fromText(
  "ppmzm-3aaaa-aaaaa-aacpq-cai",
);

export const swapCanisterIdMock: Principal = Principal.fromText(
  "kuwf5-5qaaa-aaaaa-aacqq-cai",
);

export const indexCanisterIdMock: Principal = Principal.fromText(
  "qjdve-lqaaa-aaaaa-aaaeq-cai",
);

export const snsMock: ListSnsCanistersResponse = {
  root: [rootCanisterIdMock],
  ledger: [ledgerCanisterIdMock],
  governance: [governanceCanisterIdMock],
  swap: [swapCanisterIdMock],
  index: [indexCanisterIdMock],
  dapps: [],
  archives: [],
  extensions: [],
};

export const saleTicketMock: Ticket = {
  creation_time: 1n,
  ticket_id: 2n,
  account: [
    {
      owner: [Principal.fromText("aaaaa-aa")],
      subaccount: [],
    },
  ],
  amount_icp_e8s: 3n,
};
