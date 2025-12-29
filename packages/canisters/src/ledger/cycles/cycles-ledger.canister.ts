import { Canister, type CanisterOptions, createServices } from "@dfinity/utils";
import {
  type CyclesLedgerDid,
  type CyclesLedgerService,
  idlFactoryCertifiedCyclesLedger,
  idlFactoryCyclesLedger,
} from "../../declarations";
import { MAINNET_CYCLES_LEDGER_CANISTER_ID } from "./constants/canister_ids";
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
   * @param {Object} params - The withdrawal parameters.
   * @param {CyclesLedgerDid.WithdrawArgs} params.args - The withdrawal arguments containing:
   *   - `amount`: The number of cycles to withdraw.
   *   - `to`: The principal ID of the target canister.
   *   - `from_subaccount` (optional): The subaccount from which cycles are deducted.
   *   - `created_at_time` (optional): The timestamp when the transaction is created.
   *
   * @returns {Promise<WithdrawResult>} The result of the withdrawal operation.
   *
   * @see https://github.com/dfinity/cycles-ledger#withdrawing-cycles
   */
  withdraw = async ({
    args,
  }: {
    args: CyclesLedgerDid.WithdrawArgs;
  }): Promise<WithdrawResult> => {
    const { withdraw } = this.caller({ certified: true });
    return await withdraw(args);
  };
}
