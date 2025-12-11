import type * as path from "path";

// Check if we're in a Node.js environment
// Not really reliable, we must find a better way to do it
const isNode = typeof window === "undefined";

// Browser-safe no-op implementation using actual path function types
// @ts-expect-error - path is not defined in the browser
const browserPath: typeof path = {};

// Export either the real path module or the polyfill
const pathPolyfill: typeof path = isNode
  ? // In Node.js, use the real path module with dynamic import
    // This allows bundlers to properly handle the conditional import
    await import("path").then((mod) => mod.default)
  : // In browser, use the polyfill
    browserPath;

export default pathPolyfill;
