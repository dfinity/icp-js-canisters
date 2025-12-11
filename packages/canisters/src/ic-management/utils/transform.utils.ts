import { fromNullable, nonNullish } from "@dfinity/utils";
import type { ActorConfig, CallConfig } from "@icp-sdk/core/agent";
import { Principal } from "@icp-sdk/core/principal";

type CallTransform = Required<ActorConfig>["callTransform"];

type QueryTransform = Required<ActorConfig>["queryTransform"];

/**
 * Transformer function for service creation with `callTransform` or `queryTransform`.
 *
 * This function maps the `effective_canister_id` for calls to the Management Canister (`aaaaa-aa`).
 *
 * Original source `getManagementCanister` in agent-js.
 *
 * Providing a transformer is required to determine the effective_canister_id when the request is an update call to the Management Canister (aaaaa-aa).
 *
 * @link https://internetcomputer.org/docs/current/references/ic-interface-spec/#http-effective-canister-id
 **/
// eslint-disable-next-line local-rules/prefer-object-params
export const transform: CallTransform | QueryTransform = (
  methodName: string,
  args: (Record<string, unknown> & {
    canister_id?: unknown;
    target_canister?: unknown;
    specified_id?: [] | [unknown];
  })[],
  _callConfig: CallConfig,
): { effectiveCanisterId: Principal } => {
  const [first] = args;

  if (nonNullish(first) && typeof first === "object") {
    if (
      methodName === "install_chunked_code" &&
      nonNullish(first.target_canister)
    ) {
      return { effectiveCanisterId: Principal.from(first.target_canister) };
    }

    if (
      methodName === "provisional_create_canister_with_cycles" &&
      nonNullish(first.specified_id)
    ) {
      const specifiedId = fromNullable(first.specified_id);

      if (nonNullish(specifiedId)) {
        return {
          effectiveCanisterId: Principal.from(specifiedId),
        };
      }
    }

    if (nonNullish(first.canister_id)) {
      return { effectiveCanisterId: Principal.from(first.canister_id) };
    }
  }

  return { effectiveCanisterId: Principal.fromHex("") };
};
