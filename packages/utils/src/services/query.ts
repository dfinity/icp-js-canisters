import type { QueryAndUpdateParams } from "../types/query-and-update.params";
import { isNullish } from "../utils/nullish.utils";

/**
 * This service performs a query (not-certified) call and/or an update (certified) call, and handles the results.
 *
 * It is useful because it can do both type of calls for security reasons.
 * For example, malicious nodes can forge transactions and balance when calling an Index canister, if no update is performed to certify the results.
 *
 * Furthermore, it can handle the results of the calls in different ways:
 * - `query` only performs a query call.
 * - `update` only performs an update call.
 * - `query_and_update` performs both calls.
 *
 * The resolution can be:
 * - `all_settled` waits for all calls to settle.
 * - `race` waits for the first call to settle (typically, `query` is the fastest one).
 *
 * Once the call(s) are done, the response is handled by the `onLoad` callback.
 * However, if an error occurs, it is handled by the error callbacks, if provided: one for the query call and one for the update call.
 * If no error callback is provided for the update call, the error is logged to the console.
 *
 * @param {QueryAndUpdateParams<R, E>} params The parameters to perform the request.
 * @param {QueryAndUpdateRequest<R>} params.request The request to perform.
 * @param {QueryAndUpdateOnResponse<R>} params.onLoad The callback to handle the response of the request.
 * @param {QueryAndUpdateOnQueryError<E>} [params.onQueryError] The callback to handle the error of the `query` request.
 * @param {QueryAndUpdateOnUpdateError<E>} [params.onUpdateError] The callback to handle the error of the `update` request.
 * @param {QueryAndUpdateStrategy} [params.strategy="query_and_update"] The strategy to use. Default is `query_and_update`.
 * @param {QueryAndUpdateIdentity} params.identity The identity to use for the request.
 * @param {QueryAndUpdatePromiseResolution} [params.resolution="race"] The resolution to use. Default is `race`.
 *
 * @template R The type of the response.
 * @template E The type of the error.
 *
 * @returns A promise that resolves when the request is done.
 */
export const queryAndUpdate = async <R, E = unknown>({
  request,
  onLoad,
  onQueryError,
  onUpdateError,
  strategy = "query_and_update",
  identity,
  resolution = "race",
}: QueryAndUpdateParams<R, E>): Promise<void> => {
  let certifiedDone = false;

  const queryOrUpdate = (certified: boolean) =>
    request({ certified, identity })
      .then((response) => {
        if (certifiedDone) {
          return;
        }

        onLoad({ certified, response });
      })
      .catch((error: E) => {
        if (!certified) {
          onQueryError?.({ error, identity });
        }

        if (certifiedDone) {
          return;
        }

        if (isNullish(onUpdateError)) {
          console.error(error);

          return;
        }

        if (!certified) {
          return;
        }

        onUpdateError({ error, identity });
      })
      .finally(() => (certifiedDone = certifiedDone || certified));

  const requests: Array<Promise<void>> =
    strategy === "query"
      ? [queryOrUpdate(false)]
      : strategy === "update"
        ? [queryOrUpdate(true)]
        : [queryOrUpdate(false), queryOrUpdate(true)];

  await (resolution === "all_settled"
    ? Promise.allSettled(requests)
    : Promise.race(requests));
};
