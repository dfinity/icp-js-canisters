#!/usr/bin/env bash

# Reference: NPM RRFC --if-needed https://github.com/npm/rfcs/issues/466

source "$(dirname "$0")/publish-packages.sh"

function publish_npm() {
  local lib=$1
  local org=$2

  LOCAL_SHASUM=$(npm --silent pack -w packages/"$lib" --json | jq '.[] | .shasum' | sed -r 's/^"|"$//g')

  NPM_TARBALL=$(npm show "@$org/$lib" dist.tarball 2>/dev/null || true)

  if [ -z "$NPM_TARBALL" ]; then
    echo "@"$org"/$lib not found on NPM. Publishing new package..."
    npm publish --workspace="packages/$lib" --provenance --access public
  else
    NPM_SHASUM=$(curl -s "$NPM_TARBALL" 2>&1 | shasum | cut -f1 -d' ')

    if [ "$LOCAL_SHASUM" == "$NPM_SHASUM" ]; then
      echo "No changes in @$org/$lib need to be published to NPM."
    else
      npm publish --workspace=packages/"$lib" --provenance --access public
    fi
  fi
}

for_each_package publish_npm
