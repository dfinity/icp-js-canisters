import esbuild from "esbuild";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  readPackageJsonPeerAndExports,
  rootPeerDependencies,
} from "./build.utils.mjs";

const {
  peerDependencies: workspacePeerDependencies,
  exports: workspaceExports,
} = readPackageJsonPeerAndExports(join(process.cwd(), "package.json"));

const externalPeerDependencies = [
  ...Object.keys(rootPeerDependencies()),
  ...Object.keys(workspacePeerDependencies),
];

const dist = join(process.cwd(), "dist");

const createDistFolder = () => {
  if (!existsSync(dist)) {
    mkdirSync(dist);
  }
};

/**
 * When building a subpath-only library, the files to bundle are determined
 * based on the `exports` field in the package.json, which defines what the consumer
 * can access and which bundled files are exposed.
 *
 * It is assumed that the corresponding TypeScript source files share the same
 * names as their related JavaScript output files, which is accurate since
 * esbuild preserves file names when generating outputs.
 *
 * @returns {string[]} Absolute paths to the TypeScript source files to bundle.
 */
const multiPathsLibEntryPoints = () => {
  const paths = Object.values(workspaceExports)
    // This guard is useful because a single-entry library uses an object
    // for the "import" field, unlike a multi-path library, which uses
    // a string path.
    .filter(({ import: i }) => typeof i === "string")
    .map(({ import: i }) => {
      // trim leading ./ otherwise join() treat the . as a folder
      // replace extension js from its corresponding ts file
      const file = i.replace(/^\.\//, "").replace(/\.js$/, ".ts");
      return join(process.cwd(), "src", file);
    });

  if (paths.length === 0) {
    console.error("No source files to bundle.");
    process.exit(1);
  }

  const unknownPaths = paths.filter((path) => !existsSync(path));

  if (unknownPaths.length > 0) {
    console.error(`Some source files are missing: ${unknownPaths.join(",")}`);
    process.exit(1);
  }

  return paths;
};

/**
 * For a single-entry library, there is only one entry point, which is always
 * defined as `index.ts`.
 *
 * @type {string} The source file
 */
const singleLibEntryPoint = "src/index.ts";

const buildBrowser = ({ multi } = { multi: false }) => {
  esbuild
    .build({
      ...(multi === true
        ? {
            entryPoints: multiPathsLibEntryPoints(),
            outdir: process.cwd(),
          }
        : {
            entryPoints: [singleLibEntryPoint],
            outdir: dist,
          }),
      bundle: true,
      sourcemap: true,
      minify: true,
      splitting: true,
      format: "esm",
      define: { global: "window" },
      target: ["esnext"],
      platform: "browser",
      conditions: ["worker", "browser"],
      // TODO: remove the extra external dependencies once we have a better way
      // to handle the conditional imports in the assets submodule
      external: [...externalPeerDependencies, "fs", "path"],
    })
    .catch(() => process.exit(1));
};

const buildNode = ({ multi, format }) => {
  esbuild
    .build({
      ...(multi === true
        ? {
            entryPoints: multiPathsLibEntryPoints(),
            outdir: process.cwd(),
            outExtension: { ".js": ".mjs" },
          }
        : {
            entryPoints: [singleLibEntryPoint],
            outfile:
              format === "cjs"
                ? join(dist, "cjs", "index.cjs.js")
                : join(dist, "index.mjs"),
          }),
      bundle: true,
      sourcemap: true,
      minify: true,
      ...(format === "esm" && {
        format,
        banner: {
          js: "import { createRequire as topLevelCreateRequire } from 'module';\n const require = topLevelCreateRequire(import.meta.url);",
        },
      }),
      platform: "node",
      target: ["node20", "esnext"],
      external: externalPeerDependencies,
    })
    .catch(() => process.exit(1));
};

const writeNodeCjsRootEntry = () => {
  writeFileSync(
    join(dist, "index.cjs.js"),
    "module.exports = require('./cjs/index.cjs.js');",
  );
};

/**
 * Build the libraries for the browser and Node.
 * @param multi True to generate a subpath-only import library
 * @param nodeFormat Output format for NodeJS bundle: esm (default) or cjs
 */
export const build = (
  { multi, nodeFormat } = { multi: false, nodeFormat: "esm" },
) => {
  if (multi === undefined) {
    console.error("Missing parameter 'multi'");
    process.exit(1);
  }

  if (nodeFormat === undefined) {
    console.error("Missing parameter 'nodeFormat'");
    process.exit(1);
  }

  if (!multi) {
    createDistFolder();
  }

  buildBrowser({ multi });
  buildNode({ format: nodeFormat, multi });

  if (nodeFormat === "cjs") {
    writeNodeCjsRootEntry();
  }
};
