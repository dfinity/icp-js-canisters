import {
  Canister,
  type CanisterOptions,
  createServices,
  toNullable,
} from "@dfinity/utils";
import {
  type CyclesLedgerService,
  idlFactoryCertifiedCyclesLedger,
  idlFactoryCyclesLedger,
} from "../../declarations";
import { MAINNET_CYCLES_LEDGER_CANISTER_ID } from "./constants/canister_ids";
import type { WithdrawParams } from "./types/cycles-ledger.params";
import type { WithdrawResult } from "./types/cycles-ledger.responses";

export class CyclesLedgerCanister extends Canister<CyclesLedgerService> {
  static create({
    canisterId: optionsCanisterId,
    ...options
  }: CanisterOptions<CyclesLedgerService>) {
    const { service, certifiedService, canisterId } =
      createServices<CyclesLedgerService>({
        options: {
          ...options,
          canisterId: optionsCanisterId ?? MAINNET_CYCLES_LEDGER_CANISTER_ID,
        },
        idlFactory: idlFactoryCyclesLedger,
        certifiedIdlFactory: idlFactoryCertifiedCyclesLedger,
      });

    return new CyclesLedgerCanister(canisterId, service, certifiedService);
  }

  /**
   * Withdraws cycles from the ledger to a target canister.
   *
   * @param {WithdrawParams} params - The withdrawal parameters.
   * @param {bigint} params.amount - The number of cycles to withdraw.
   * @param {Principal} params.to - The principal ID of the target canister.
   * @param {Uint8Array} [params.fromSubaccount] - Optional. The subaccount from which cycles are deducted.
   * @param {bigint} [params.createdAtTime] - Optional. The timestamp when the transaction is created.
   *
   * @returns {Promise<WithdrawResult>} The result of the withdrawal operation.
   *
   * @see https://github.com/dfinity/cycles-ledger#withdrawing-cycles
   */
  withdraw = async ({
    fromSubaccount,
    createdAtTime,
    ...rest
  }: WithdrawParams): Promise<WithdrawResult> => {
    const { withdraw } = this.caller({ certified: true });
    return await withdraw({
      from_subaccount: toNullable(fromSubaccount),
      created_at_time: toNullable(createdAtTime),
      ...rest,
    });
  };
}
