# Hacking

This document lists a couple of useful information to develop libraries of this repo locally.

## Table of contents

- [Prerequisite](#prerequisite)
- [Build and test](#build-and-test)
- [How-to test local changes with nns-dapp](#nns-js-how-to-test-local-changes-with-nns-dapp)
- [Candid files](#candid-files)
- [Update peer dependencies](#update-peer-dependencies)
- [Patch release](#patch-release)

## Prerequisite

Make sure you have a recent version of [Node.js installed](https://nodejs.org/en/) (LTS recommended).

You will also need `npm` v7+ as this repo is configured with [workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces).

## Build and test

From root directory, to build or test all packages:

```bash
npm run build/test
```

To build or test a particular package - e.g. `sns`:

```bash
npm run build/test --workspace=packages/sns
```

Because of dependencies between the packages you need to make sure to build
`packages/utils` and `packages/ledger-icrc` before you can build/test any of the
other packages.

## nns-js: How-to test local changes with nns-dapp

### In this directory

Build the libraries you want to test:

```bash
npm run build --workspace=packages/the-library-you-want-to-test
```

**Note: Try building all the workspaces at once if you get any problem.**

### In NNS-Dapp

```bash
# navigate to frontend directory
cd frontend
# remove node modules
rm -r node_modules
# reinstall modules
npm ci
# remove the library you want to test
npm rm @dfinity/the-library-you-want-to-test
# install the library pointing to local ic-js
npm i /User/path/to/packages/the-library-you-want-to-test
```

**Note: Don't commit the changes in package.json nor in package-lock.json.**

## Candid files

The `did` files, related `.js` and `.d.ts` are generated automatically.

1. [import-candid](./scripts/import-candid) generates the `.did` files
2. [compile-idl-js](./scripts/compile-idl-js) extract and write the related `.js` and `.d.ts`

The files of the [candid](./candid) folders are shared across packages. Their architecture is the following:

- `something.did`: the candid definition
- `something.d.ts`: the TypeScript definition for the types and service of the `did` files (1)
- `something.idl.js`: the factory js file (1)
- `something.idl.d.ts`: the TypeScript definition of the above factory file
- `something.certified.idl.js`: the factory js file for the certified calls (1)
- `something.certified.idl.d.ts`: the TypeScript definition of the above factory file

(1) auto-generated with [`@icp-sdk/bindgen`](https://github.com/dfinity/icp-js-bindgen)

# Update peer dependencies

Saving peer dependencies in `package-lock.json` needs npm >= v7.

```bash
npm rm @icp-sdk/core --workspaces
npm i @icp-sdk/core --save-peer --workspaces
```

## Patch release

Sometimes a fix needs to be backported to an older version of a package (e.g. consumers pinned to `@dfinity/utils@^4.0.0` need a bug fix that landed on a newer major/minor). This section describes how to create a patch release without affecting the `latest` npm tag.

### 1. Find the release tag

Identify the monorepo release tag where the package had the version you want to patch. You can check the [release notes](https://github.com/dfinity/icp-js-canisters/releases) to find which tag shipped the version you need, or inspect tags locally. For example, to patch `@dfinity/utils@4.0.2`:

```bash
# Check which tag had the target version
for tag in v88 v89 v90; do
  echo "--- $tag ---"
  git show $tag:packages/utils/package.json | head -5
done
```

### 2. Create a patch branch

Branch from the release tag using the naming convention `release/<tag>/patch-<N>`. The branch **must** start with `release/` for the publish workflow to work.

```bash
git checkout -b release/v89/patch-1 v89
```

### 3. Apply the fixes

Create feature branches off the patch branch, open PRs targeting it (e.g. targeting `release/v89/patch-1` instead of `main`), and go through the normal review process. The changes themselves can be cherry-picked from `main` or written manually — either way they should be peer-reviewed before merging into the patch branch.

```bash
# Example: cherry-pick onto a feature branch for review
git checkout -b fix/backport-toBase64 release/v89/patch-1
git cherry-pick <commit-hash-1>
git cherry-pick <commit-hash-2>
git push -u origin fix/backport-toBase64
# Then open a PR targeting release/v89/patch-1
```

### 4. Bump the version

Open a PR targeting the patch branch that updates `version` in both `packages/<lib>/package.json` and `package-lock.json`.

### 5. Create a tracking PR

Once the patch branch is ready, create a **draft PR** targeting `main` for visibility. This PR should **not** be merged — it only exists to track the patch and list the PRs that were merged into the patch branch.

### 6. Publish via the workflow

Go to **Actions > Publish Release > Run workflow**, select the patch branch (e.g. `release/v89/patch-1`), choose tag **`patch`**, and run it.

The [`publish-patch.sh`](./scripts/publish-patch.sh) script checks if each package's exact version already exists on npm. Only packages with a new version are published, and they are tagged as `patch` (never moves the `latest` pointer).

### 7. Create release notes

After publishing, create a GitHub release for the tag. Use a tag name that identifies the package and version (e.g. `@dfinity/utils@4.0.3`). The publish workflow only auto-triggers on `v*` tags (monorepo releases), so patch release notes won't re-trigger a publish.

### Example: `@dfinity/utils` v4.0.3

The `toBase64` chunk-loss fix ([#1485](https://github.com/dfinity/icp-js-canisters/pull/1485)) and performance improvement ([#1487](https://github.com/dfinity/icp-js-canisters/pull/1487)) were cherry-picked from v96 onto v89 (which had `@dfinity/utils@4.0.2`) and published as `@dfinity/utils@4.0.3` via branch [`release/v89/patch-1`](https://github.com/dfinity/icp-js-canisters/tree/release/v89/patch-1). See tracking PR [#1495](https://github.com/dfinity/icp-js-canisters/pull/1495).
