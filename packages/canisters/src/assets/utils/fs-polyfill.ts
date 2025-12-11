import type * as fs from "fs";

// Check if we're in a Node.js environment
// Not really reliable, we must find a better way to do it
const isNode = typeof window === "undefined";

// Browser-safe no-op implementation using actual fs function types
// @ts-expect-error - fs is not defined in the browser
const browserFs: typeof fs = {};

// Export either the real fs module or the polyfill
const fsPolyfill: typeof fs = isNode
  ? // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("fs")
  : browserFs;

export default fsPolyfill;
