import type * as fs from "fs";

// Check if we're in a Node.js environment
// Not really reliable, we must find a better way to do it
const isNode = typeof window === "undefined";

// Browser-safe no-op implementation using actual fs function types
// @ts-expect-error - fs is not defined in the browser
const browserFs: typeof fs = {};

// Export either the real fs module or the polyfill
const fsPolyfill: typeof fs = isNode
  ? // In Node.js, use the real fs module with dynamic import
    // This allows bundlers to properly handle the conditional import
    await import("fs").then((mod) => mod.default)
  : // In browser, use the polyfill
    browserFs;

export default fsPolyfill;
