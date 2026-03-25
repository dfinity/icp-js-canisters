#!/usr/bin/env bash

# Publish patch releases for packages whose exact version does not yet exist on npm.
# Unlike publish-npm.sh (which compares shasums against the "latest" tag), this script
# checks whether the local version already exists on the registry. This makes it safe
# to run on patch branches based on older release tags where other packages are behind
# "latest". Publishes with --tag patch so the npm "latest" pointer is never moved.

source "$(dirname "$0")/publish-packages.sh"

function publish_patch() {
  local lib=$1
  local org=$2

  LOCAL_VERSION=$(npm --silent pack -w packages/"$lib" --json | jq -r '.[] | .version')

  NPM_VERSION_EXISTS=$(npm show "@$org/$lib@$LOCAL_VERSION" version 2>/dev/null || true)

  if [ -n "$NPM_VERSION_EXISTS" ]; then
    echo "@$org/$lib@$LOCAL_VERSION already published to NPM. Skipping."
  else
    echo "Publishing @$org/$lib@$LOCAL_VERSION..."
    npm publish --workspace=packages/"$lib" --provenance --access public --tag patch
  fi
}

for_each_package publish_patch
