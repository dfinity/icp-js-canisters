import type { MockInstance } from "vitest";
import { mockIdentity } from "../mocks/identity.mock";
import type {
  QueryAndUpdateParams,
  QueryAndUpdatePromiseResolution,
  QueryAndUpdateRequestParams,
  QueryAndUpdateStrategy,
} from "../types/query-and-update.params";
import { nonNullish } from "../utils/nullish.utils";
import { queryAndUpdate } from "./query";

describe("query", () => {
  describe("queryAndUpdate", () => {
    const delay = 100;

    const requestResponse = "response";
    const queryResponse = "query response";
    const updateResponse = "update response";

    const requestErrorObj = new Error("Request failed");
    const queryErrorObj = new Error("Query failed");
    const updateErrorObj = new Error("Update failed");

    let params: {
      faster?: "query" | "update";
      requestError?: boolean;
      queryError?: boolean;
      updateError?: boolean;
      resolution?: QueryAndUpdatePromiseResolution;
      strategy?: QueryAndUpdateStrategy;
    } = {};

    const createMockParams = (): {
      mockParams: QueryAndUpdateParams<string>;
      requestMock: MockInstance;
      onLoadMock: MockInstance;
      onQueryErrorMock: MockInstance;
      onUpdateErrorMock: MockInstance;
    } => {
      const {
        faster,
        requestError,
        queryError,
        updateError,
        resolution,
        strategy,
      } = params;

      const requestMock = vi.fn().mockResolvedValue(requestResponse);
      const onLoadMock = vi.fn();
      const onQueryErrorMock = vi.fn();
      const onUpdateErrorMock = vi.fn();

      const mockQueryResult = vi.fn().mockResolvedValueOnce(queryResponse);
      const mockUpdateResult = vi.fn().mockResolvedValueOnce(updateResponse);

      const mockRequestFasterQuery = ({
        certified,
      }: QueryAndUpdateRequestParams) =>
        certified
          ? new Promise((resolve) =>
              setTimeout(() => resolve(mockUpdateResult()), delay),
            )
          : mockQueryResult();
      const mockRequestFasterUpdate = ({
        certified,
      }: QueryAndUpdateRequestParams) =>
        certified
          ? mockUpdateResult()
          : new Promise((resolve) =>
              setTimeout(() => resolve(mockQueryResult()), delay),
            );

      if (requestError) {
        requestMock.mockReset().mockRejectedValue(requestErrorObj);
      }

      if (queryError) {
        mockQueryResult.mockReset().mockRejectedValueOnce(queryErrorObj);
      }

      if (updateError) {
        mockUpdateResult.mockReset().mockRejectedValueOnce(updateErrorObj);
      }

      if (nonNullish(faster)) {
        requestMock.mockImplementation(
          faster === "query" ? mockRequestFasterQuery : mockRequestFasterUpdate,
        );
      }

      const mockParams: QueryAndUpdateParams<string> = {
        request: requestMock,
        onLoad: onLoadMock,
        onQueryError: onQueryErrorMock,
        onUpdateError: onUpdateErrorMock,
        identity: mockIdentity,
        resolution,
        strategy,
      };

      return {
        mockParams,
        requestMock,
        onLoadMock,
        onQueryErrorMock,
        onUpdateErrorMock,
      };
    };

    beforeEach(() => {
      vi.resetAllMocks();

      // We mock console just to avoid unnecessary logs while running the tests
      vi.spyOn(console, "error").mockImplementation(() => {});

      params = {};
    });

    describe("strategy: `query_and_update` (default)", () => {
      it("should make a `query` request (`certified: false`) and an `update` request (`certified: true`)", async () => {
        const { mockParams, requestMock } = createMockParams();

        requestMock.mockResolvedValue(requestResponse);

        await queryAndUpdate(mockParams);

        expect(requestMock).toHaveBeenCalledTimes(2);
        expect(requestMock).toHaveBeenNthCalledWith(1, {
          certified: false,
          identity: mockIdentity,
        });
        expect(requestMock).toHaveBeenNthCalledWith(2, {
          certified: true,
          identity: mockIdentity,
        });
      });

      describe("with race resolution", () => {
        it("should not wait for the slowest request to finish with `race` resolution (default)", async () => {
          params = { resolution: undefined };
          const { mockParams, requestMock } = createMockParams();

          requestMock
            .mockResolvedValueOnce("response-1")
            .mockResolvedValueOnce(
              new Promise((resolve) =>
                setTimeout(() => resolve("response-2"), delay),
              ),
            );

          const start = Date.now();
          await queryAndUpdate(mockParams);
          const duration = Date.now() - start;

          expect(duration).toBeLessThan(delay);
        });

        it("should wait for all requests to finish with `all_settled` resolution", async () => {
          params = { resolution: "all_settled" };
          const { mockParams, requestMock } = createMockParams();

          requestMock
            .mockResolvedValueOnce("response-1")
            .mockResolvedValueOnce(
              new Promise((resolve) =>
                setTimeout(() => resolve("response-2"), delay),
              ),
            );

          const start = Date.now();
          await queryAndUpdate(mockParams);
          const duration = Date.now() - start + delay / 50; // 2% margin in case of rounding

          expect(duration).toBeGreaterThanOrEqual(delay);
        });
      });

      describe("when both requests succeed", () => {
        it("should not call `onQueryError`", async () => {
          const { mockParams, onQueryErrorMock } = createMockParams();

          await queryAndUpdate(mockParams);

          expect(onQueryErrorMock).not.toHaveBeenCalled();
        });

        it("should not call `onUpdateError`", async () => {
          const { mockParams, onUpdateErrorMock } = createMockParams();

          await queryAndUpdate(mockParams);

          expect(onUpdateErrorMock).not.toHaveBeenCalled();
        });

        it("should not log the console error", async () => {
          const { mockParams } = createMockParams();

          await queryAndUpdate(mockParams);

          expect(console.error).not.toHaveBeenCalled();
        });
      });

      describe("when both requests fail", () => {
        beforeEach(() => {
          params = { requestError: true };
        });

        it("should not call `onLoad`", async () => {
          const { mockParams, onLoadMock } = createMockParams();

          await queryAndUpdate(mockParams);

          expect(onLoadMock).not.toHaveBeenCalled();
        });
      });

      describe("likely scenario: `query` is faster than `update`", () => {
        describe("resolution: `race` (default)", () => {
          describe("when `query` and `update` both succeed", () => {
            beforeEach(() => {
              params = { faster: "query", resolution: undefined };
            });

            it("should call `onLoad` only with `query` response", async () => {
              const { mockParams, onLoadMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onLoadMock).toHaveBeenCalledOnce();
              expect(onLoadMock).toHaveBeenNthCalledWith(1, {
                certified: false,
                response: queryResponse,
              });
            });
          });

          describe("when `query` succeeds and `update` fails", () => {
            beforeEach(() => {
              params = {
                faster: "query",
                resolution: undefined,
                updateError: true,
              };
            });

            it("should ignore `update` error and call `onLoad` with `query` response", async () => {
              const { mockParams, onLoadMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onLoadMock).toHaveBeenCalledOnce();
              expect(onLoadMock).toHaveBeenNthCalledWith(1, {
                certified: false,
                response: queryResponse,
              });
            });

            it("should not call `onQueryError`", async () => {
              const { mockParams, onQueryErrorMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onQueryErrorMock).not.toHaveBeenCalled();
            });

            it("should ignore `update` error and not call `onUpdateError`", async () => {
              const { mockParams, onUpdateErrorMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onUpdateErrorMock).not.toHaveBeenCalled();
            });

            it("should ignore `update` error and not log the console error", async () => {
              const { mockParams } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(console.error).not.toHaveBeenCalled();
            });
          });

          describe("when `query` fails and `update` succeeds", () => {
            beforeEach(() => {
              params = {
                faster: "query",
                resolution: undefined,
                queryError: true,
              };
            });

            it("should ignore `update` response and not call `onLoad`", async () => {
              const { mockParams, onLoadMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onLoadMock).not.toHaveBeenCalled();
            });

            it("should ignore `update` response and call `onQueryError` with query error", async () => {
              const { mockParams, onQueryErrorMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onQueryErrorMock).toHaveBeenCalledOnce();
              expect(onQueryErrorMock).toHaveBeenNthCalledWith(1, {
                error: queryErrorObj,
                identity: mockIdentity,
              });
            });

            it("should ignore `update` response and log the console error with `query` error", async () => {
              const { mockParams } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(console.error).toHaveBeenCalledOnce();
              expect(console.error).toHaveBeenNthCalledWith(1, queryErrorObj);
            });

            it("should not log the console error when `onUpdateError` is nullish", async () => {
              const { mockParams } = createMockParams();

              await queryAndUpdate({
                ...mockParams,
                onUpdateError: undefined,
              });

              expect(console.error).not.toHaveBeenCalled();
            });
          });

          describe("when `query` and `update` both fail", () => {
            beforeEach(() => {
              params = {
                faster: "query",
                resolution: undefined,
                queryError: true,
                updateError: true,
              };
            });

            it("should call `onQueryError` with `query` error", async () => {
              const { mockParams, onQueryErrorMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onQueryErrorMock).toHaveBeenCalledOnce();
              expect(onQueryErrorMock).toHaveBeenNthCalledWith(1, {
                error: queryErrorObj,
                identity: mockIdentity,
              });
            });

            it("should ignore `update` error and not call `onUpdateError`", async () => {
              const { mockParams, onUpdateErrorMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onUpdateErrorMock).not.toHaveBeenCalled();
            });

            it("should log the console error only with `query` error", async () => {
              const { mockParams } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(console.error).toHaveBeenCalledOnce();
              expect(console.error).toHaveBeenNthCalledWith(1, queryErrorObj);
            });

            it("should not log the console error when `onUpdateError` is nullish", async () => {
              const { mockParams } = createMockParams();

              await queryAndUpdate({
                ...mockParams,
                onUpdateError: undefined,
              });

              expect(console.error).not.toHaveBeenCalled();
            });
          });
        });

        describe("resolution: `all_settled`", () => {
          describe("when `query` and `update` both succeed", () => {
            beforeEach(() => {
              params = { faster: "query", resolution: "all_settled" };
            });

            it("should call `onLoad` with both responses", async () => {
              const { mockParams, onLoadMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onLoadMock).toHaveBeenCalledTimes(2);
              expect(onLoadMock).toHaveBeenNthCalledWith(1, {
                certified: false,
                response: queryResponse,
              });
              expect(onLoadMock).toHaveBeenNthCalledWith(2, {
                certified: true,
                response: updateResponse,
              });
            });
          });

          describe("when `query` succeeds and `update` fails", () => {
            beforeEach(() => {
              params = {
                faster: "query",
                resolution: "all_settled",
                updateError: true,
              };
            });

            it("should call `onLoad` with `query` response", async () => {
              const { mockParams, onLoadMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onLoadMock).toHaveBeenCalledOnce();
              expect(onLoadMock).toHaveBeenNthCalledWith(1, {
                certified: false,
                response: queryResponse,
              });
            });

            it("should not call `onQueryError", async () => {
              const { mockParams, onQueryErrorMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onQueryErrorMock).not.toHaveBeenCalled();
            });

            it("should call `onUpdateError` with `update` error", async () => {
              const { mockParams, onUpdateErrorMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onUpdateErrorMock).toHaveBeenCalledOnce();
              expect(onUpdateErrorMock).toHaveBeenNthCalledWith(1, {
                error: updateErrorObj,
                identity: mockIdentity,
              });
            });

            it("should log the console error with `update` error", async () => {
              const { mockParams } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(console.error).toHaveBeenCalledOnce();
              expect(console.error).toHaveBeenNthCalledWith(1, updateErrorObj);
            });

            it("should not log the console error when `onUpdateError` is nullish", async () => {
              const { mockParams } = createMockParams();

              await queryAndUpdate({
                ...mockParams,
                onUpdateError: undefined,
              });

              expect(console.error).not.toHaveBeenCalled();
            });
          });

          describe("when `query` fails and `update` succeeds", () => {
            beforeEach(() => {
              params = {
                faster: "query",
                resolution: "all_settled",
                queryError: true,
              };
            });

            it("should call `onLoad` with `update` response", async () => {
              const { mockParams, onLoadMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onLoadMock).toHaveBeenCalledOnce();
              expect(onLoadMock).toHaveBeenNthCalledWith(1, {
                certified: true,
                response: updateResponse,
              });
            });

            it("should call `onQueryError` with `query` error", async () => {
              const { mockParams, onQueryErrorMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onQueryErrorMock).toHaveBeenCalledOnce();
              expect(onQueryErrorMock).toHaveBeenNthCalledWith(1, {
                error: queryErrorObj,
                identity: mockIdentity,
              });
            });

            it("should not call `onUpdateError`", async () => {
              const { mockParams, onUpdateErrorMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onUpdateErrorMock).not.toHaveBeenCalled();
            });

            it("should log the console error with `query` error", async () => {
              const { mockParams } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(console.error).toHaveBeenCalledOnce();
              expect(console.error).toHaveBeenNthCalledWith(1, queryErrorObj);
            });

            it("should not log the console error when `onUpdateError` is nullish", async () => {
              const { mockParams } = createMockParams();

              await queryAndUpdate({
                ...mockParams,
                onUpdateError: undefined,
              });

              expect(console.error).not.toHaveBeenCalled();
            });
          });

          describe("when `query` and `update` both fail", () => {
            beforeEach(() => {
              params = {
                faster: "query",
                resolution: "all_settled",
                queryError: true,
                updateError: true,
              };
            });

            it("should call `onQueryError` with `query` error", async () => {
              const { mockParams, onQueryErrorMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onQueryErrorMock).toHaveBeenCalledOnce();
              expect(onQueryErrorMock).toHaveBeenNthCalledWith(1, {
                error: queryErrorObj,
                identity: mockIdentity,
              });
            });

            it("should call `onUpdateError` with `update` error", async () => {
              const { mockParams, onUpdateErrorMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onUpdateErrorMock).toHaveBeenCalledOnce();
              expect(onUpdateErrorMock).toHaveBeenNthCalledWith(1, {
                error: updateErrorObj,
                identity: mockIdentity,
              });
            });

            it("should log the console error with both errors", async () => {
              const { mockParams } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(console.error).toHaveBeenCalledTimes(2);
              expect(console.error).toHaveBeenNthCalledWith(1, queryErrorObj);
              expect(console.error).toHaveBeenNthCalledWith(2, updateErrorObj);
            });

            it("should not log the console error when `onUpdateError` is nullish", async () => {
              const { mockParams } = createMockParams();

              await queryAndUpdate({
                ...mockParams,
                onUpdateError: undefined,
              });

              expect(console.error).not.toHaveBeenCalled();
            });
          });
        });
      });

      describe("unlikely scenario: `query` is slower than `update`", () => {
        describe("resolution: `race` (default)", () => {
          describe("when `query` and `update` both succeed", () => {
            beforeEach(() => {
              params = { faster: "update", resolution: undefined };
            });

            it("should call `onLoad` only with `update` response", async () => {
              const { mockParams, onLoadMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onLoadMock).toHaveBeenCalledOnce();
              expect(onLoadMock).toHaveBeenNthCalledWith(1, {
                certified: true,
                response: updateResponse,
              });
            });
          });

          describe("when `query` succeeds and `update` fails", () => {
            beforeEach(() => {
              params = {
                faster: "update",
                resolution: undefined,
                updateError: true,
              };
            });

            it("should ignore `query` response and not call `onLoad`", async () => {
              const { mockParams, onLoadMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onLoadMock).not.toHaveBeenCalled();
            });

            it("should not call `onQueryError`", async () => {
              const { mockParams, onQueryErrorMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onQueryErrorMock).not.toHaveBeenCalled();
            });

            it("should ignore `query` response and call `onUpdateError` with `update` error", async () => {
              const { mockParams, onUpdateErrorMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onUpdateErrorMock).toHaveBeenCalledOnce();
              expect(onUpdateErrorMock).toHaveBeenNthCalledWith(1, {
                error: updateErrorObj,
                identity: mockIdentity,
              });
            });

            it("should ignore `query` response and log the console error with `update` error", async () => {
              const { mockParams } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(console.error).toHaveBeenCalledOnce();
              expect(console.error).toHaveBeenNthCalledWith(1, updateErrorObj);
            });

            it("should not log the console error when `onUpdateError` is nullish", async () => {
              const { mockParams } = createMockParams();

              await queryAndUpdate({
                ...mockParams,
                onUpdateError: undefined,
              });

              expect(console.error).not.toHaveBeenCalled();
            });
          });

          describe("when `query` fails and `update` succeeds", () => {
            beforeEach(() => {
              params = {
                faster: "update",
                resolution: undefined,
                queryError: true,
              };
            });

            it("should ignore `query` error and call `onLoad` with `update` response", async () => {
              const { mockParams, onLoadMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onLoadMock).toHaveBeenCalledOnce();
              expect(onLoadMock).toHaveBeenNthCalledWith(1, {
                certified: true,
                response: updateResponse,
              });
            });

            it("should ignore `query` error and not call `onQueryError`", async () => {
              const { mockParams, onQueryErrorMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onQueryErrorMock).not.toHaveBeenCalled();
            });

            it("should ignore `query` error and not log the console error", async () => {
              const { mockParams } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(console.error).not.toHaveBeenCalled();
            });
          });

          describe("when `query` and `update` both fail", () => {
            beforeEach(() => {
              params = {
                faster: "update",
                resolution: undefined,
                queryError: true,
                updateError: true,
              };
            });

            it("should ignore `query` error and not call `onQueryError`", async () => {
              const { mockParams, onQueryErrorMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onQueryErrorMock).not.toHaveBeenCalled();
            });

            it("should call `onUpdateError` with `update` error", async () => {
              const { mockParams, onUpdateErrorMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onUpdateErrorMock).toHaveBeenCalledOnce();
              expect(onUpdateErrorMock).toHaveBeenNthCalledWith(1, {
                error: updateErrorObj,
                identity: mockIdentity,
              });
            });

            it("should log the console error only with `update` error", async () => {
              const { mockParams } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(console.error).toHaveBeenCalledOnce();
              expect(console.error).toHaveBeenNthCalledWith(1, updateErrorObj);
            });

            it("should not log the console error when `onUpdateError` is nullish", async () => {
              const { mockParams } = createMockParams();

              await queryAndUpdate({
                ...mockParams,
                onUpdateError: undefined,
              });

              expect(console.error).not.toHaveBeenCalled();
            });
          });
        });

        describe("resolution: `all_settled`", () => {
          describe("when `query` and `update` both succeed", () => {
            beforeEach(() => {
              params = { faster: "update", resolution: "all_settled" };
            });

            it("should call `onLoad` only with `update` response", async () => {
              const { mockParams, onLoadMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onLoadMock).toHaveBeenCalledOnce();
              expect(onLoadMock).toHaveBeenNthCalledWith(1, {
                certified: true,
                response: updateResponse,
              });
            });
          });

          describe("when `query` succeeds and `update` fails", () => {
            beforeEach(() => {
              params = {
                faster: "update",
                resolution: "all_settled",
                updateError: true,
              };
            });

            it("should ignore `query` response and not call `onLoad`", async () => {
              const { mockParams, onLoadMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onLoadMock).not.toHaveBeenCalled();
            });

            it("should not call `onQueryError`", async () => {
              const { mockParams, onQueryErrorMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onQueryErrorMock).not.toHaveBeenCalled();
            });

            it("should call `onUpdateError` with `update` error", async () => {
              const { mockParams, onUpdateErrorMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onUpdateErrorMock).toHaveBeenCalledOnce();
              expect(onUpdateErrorMock).toHaveBeenNthCalledWith(1, {
                error: updateErrorObj,
                identity: mockIdentity,
              });
            });

            it("should log the console error with `update` error", async () => {
              const { mockParams } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(console.error).toHaveBeenCalledOnce();
              expect(console.error).toHaveBeenNthCalledWith(1, updateErrorObj);
            });

            it("should not log the console error when `onUpdateError` is nullish", async () => {
              const { mockParams } = createMockParams();

              await queryAndUpdate({
                ...mockParams,
                onUpdateError: undefined,
              });

              expect(console.error).not.toHaveBeenCalled();
            });
          });

          describe("when `query` fails and `update` succeeds", () => {
            beforeEach(() => {
              params = {
                faster: "update",
                resolution: "all_settled",
                queryError: true,
              };
            });

            it("should call `onLoad` with `update` response", async () => {
              const { mockParams, onLoadMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onLoadMock).toHaveBeenCalledOnce();
              expect(onLoadMock).toHaveBeenNthCalledWith(1, {
                certified: true,
                response: updateResponse,
              });
            });

            it("should call `onQueryError` with `query` error", async () => {
              const { mockParams, onQueryErrorMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onQueryErrorMock).toHaveBeenCalledOnce();
              expect(onQueryErrorMock).toHaveBeenNthCalledWith(1, {
                error: queryErrorObj,
                identity: mockIdentity,
              });
            });

            it("should not call `onUpdateError`", async () => {
              const { mockParams, onUpdateErrorMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onUpdateErrorMock).not.toHaveBeenCalled();
            });

            it("should ignore `query` error and not log the console error", async () => {
              const { mockParams } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(console.error).not.toHaveBeenCalled();
            });
          });

          describe("when `query` and `update` both fail", () => {
            beforeEach(() => {
              params = {
                faster: "update",
                resolution: "all_settled",
                queryError: true,
                updateError: true,
              };
            });

            it("should call `onQueryError` with `query` error", async () => {
              const { mockParams, onQueryErrorMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onQueryErrorMock).toHaveBeenCalledOnce();
              expect(onQueryErrorMock).toHaveBeenNthCalledWith(1, {
                error: queryErrorObj,
                identity: mockIdentity,
              });
            });

            it("should call `onUpdateError` with `update` error", async () => {
              const { mockParams, onUpdateErrorMock } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(onUpdateErrorMock).toHaveBeenCalledOnce();
              expect(onUpdateErrorMock).toHaveBeenNthCalledWith(1, {
                error: updateErrorObj,
                identity: mockIdentity,
              });
            });

            it("should log the console error only with `update` error", async () => {
              const { mockParams } = createMockParams();

              await queryAndUpdate(mockParams);

              expect(console.error).toHaveBeenCalledOnce();
              expect(console.error).toHaveBeenNthCalledWith(1, updateErrorObj);
            });

            it("should not log the console error when `onUpdateError` is nullish", async () => {
              const { mockParams } = createMockParams();

              await queryAndUpdate({
                ...mockParams,
                onUpdateError: undefined,
              });

              expect(console.error).not.toHaveBeenCalled();
            });
          });
        });
      });
    });

    describe("strategy: `query`", () => {
      beforeEach(() => {
        params = { strategy: "query" };
      });

      it("should only perform a `query` request (`certified: false`)", async () => {
        const { mockParams, requestMock } = createMockParams();

        requestMock.mockResolvedValue(requestResponse);

        await queryAndUpdate(mockParams);

        expect(requestMock).toHaveBeenCalledOnce();
        expect(requestMock).toHaveBeenNthCalledWith(1, {
          certified: false,
          identity: mockIdentity,
        });
      });

      it("should call `onLoad` with `query` response", async () => {
        const { mockParams, onLoadMock } = createMockParams();

        await queryAndUpdate(mockParams);

        expect(onLoadMock).toHaveBeenCalledOnce();
        expect(onLoadMock).toHaveBeenNthCalledWith(1, {
          certified: false,
          response: requestResponse,
        });
      });

      it("should call `onQueryError` if `query` fails", async () => {
        params = { ...params, requestError: true };

        const { mockParams, onQueryErrorMock } = createMockParams();

        await queryAndUpdate(mockParams);

        expect(onQueryErrorMock).toHaveBeenCalledOnce();
        expect(onQueryErrorMock).toHaveBeenNthCalledWith(1, {
          error: requestErrorObj,
          identity: mockIdentity,
        });
      });

      it("should not call `onUpdateError` if `query` fails", async () => {
        params = { ...params, requestError: true };

        const { mockParams, onUpdateErrorMock } = createMockParams();

        await queryAndUpdate(mockParams);

        expect(onUpdateErrorMock).not.toHaveBeenCalled();
      });

      it("should log the console error if `query` fails", async () => {
        params = { ...params, requestError: true };

        const { mockParams } = createMockParams();

        await queryAndUpdate(mockParams);

        expect(console.error).toHaveBeenCalledOnce();
        expect(console.error).toHaveBeenNthCalledWith(1, requestErrorObj);
      });

      it("should not log the console error when `onUpdateError` is nullish", async () => {
        params = { ...params, requestError: true };

        const { mockParams } = createMockParams();

        await queryAndUpdate({
          ...mockParams,
          onUpdateError: undefined,
        });

        expect(console.error).not.toHaveBeenCalled();
      });
    });

    describe("strategy: `update`", () => {
      beforeEach(() => {
        params = { strategy: "update" };
      });

      it("should only perform an `update` request (`certified: true`)", async () => {
        const { mockParams, requestMock } = createMockParams();

        requestMock.mockResolvedValue(requestResponse);

        await queryAndUpdate(mockParams);

        expect(requestMock).toHaveBeenCalledOnce();
        expect(requestMock).toHaveBeenNthCalledWith(1, {
          certified: true,
          identity: mockIdentity,
        });
      });

      it("should call `onLoad` with `update` response", async () => {
        const { mockParams, onLoadMock } = createMockParams();

        await queryAndUpdate(mockParams);

        expect(onLoadMock).toHaveBeenCalledOnce();
        expect(onLoadMock).toHaveBeenNthCalledWith(1, {
          certified: true,
          response: requestResponse,
        });
      });

      it("should not call `onQueryError` if `update` fails", async () => {
        params = { ...params, requestError: true };

        const { mockParams, onQueryErrorMock } = createMockParams();

        await queryAndUpdate(mockParams);

        expect(onQueryErrorMock).not.toHaveBeenCalled();
      });

      it("should call `onUpdateError` if `update` fails", async () => {
        params = { ...params, requestError: true };

        const { mockParams, onUpdateErrorMock } = createMockParams();

        await queryAndUpdate(mockParams);

        expect(onUpdateErrorMock).toHaveBeenCalledOnce();
        expect(onUpdateErrorMock).toHaveBeenNthCalledWith(1, {
          error: requestErrorObj,
          identity: mockIdentity,
        });
      });

      it("should log the console error if `update` fails", async () => {
        params = { ...params, requestError: true };

        const { mockParams } = createMockParams();

        await queryAndUpdate(mockParams);

        expect(console.error).toHaveBeenCalledOnce();
        expect(console.error).toHaveBeenNthCalledWith(1, requestErrorObj);
      });

      it("should not log the console error when `onUpdateError` is nullish", async () => {
        params = { ...params, requestError: true };

        const { mockParams } = createMockParams();

        await queryAndUpdate({
          ...mockParams,
          onUpdateError: undefined,
        });

        expect(console.error).not.toHaveBeenCalled();
      });
    });

    it("should work with null identity", async () => {
      const { mockParams, requestMock } = createMockParams();

      requestMock.mockResolvedValue(requestResponse);

      await queryAndUpdate({ ...mockParams, identity: null });

      expect(requestMock).toHaveBeenCalledTimes(2);
      expect(requestMock).toHaveBeenNthCalledWith(1, {
        certified: false,
        identity: null,
      });
      expect(requestMock).toHaveBeenNthCalledWith(2, {
        certified: true,
        identity: null,
      });
    });

    it("should work with undefined identity", async () => {
      const { mockParams, requestMock } = createMockParams();

      requestMock.mockResolvedValue(requestResponse);

      await queryAndUpdate({ ...mockParams, identity: undefined });

      expect(requestMock).toHaveBeenCalledTimes(2);
      expect(requestMock).toHaveBeenNthCalledWith(1, {
        certified: false,
        identity: undefined,
      });
      expect(requestMock).toHaveBeenNthCalledWith(2, {
        certified: true,
        identity: undefined,
      });
    });
  });
});
