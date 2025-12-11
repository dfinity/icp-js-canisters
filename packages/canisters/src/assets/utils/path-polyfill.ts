import type * as path from "path";

// Check if we're in a Node.js environment
// Not really reliable, we must find a better way to do it
const isNode = typeof window === "undefined";

// Browser-safe no-op implementation using actual path function types
// @ts-expect-error - path is not defined in the browser
const browserPath: typeof path = {};

const pathPolyfill: typeof path = isNode
  ? // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("path")
  : browserPath;

export default pathPolyfill;
