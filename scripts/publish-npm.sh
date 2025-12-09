#!/usr/bin/env bash

# Reference: NPM RRFC --if-needed https://github.com/npm/rfcs/issues/466

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

# Tips: libs use by other libs first
DFINITY_LIBS=utils,zod-schemas,nns-proto,nns,sns

for lib in $(echo $DFINITY_LIBS | sed "s/,/ /g"); do
  publish_npm "$lib" "dfinity"
done

ICP_SDK=canisters

for lib in $(echo $ICP_SDK | sed "s/,/ /g"); do
  publish_npm "$lib" "icp-sdk"
done

DFINITY_LEGACY_LIBS=cmc,ic-management,ckbtc,cketh,ledger-icrc,ledger-icp

for lib in $(echo $DFINITY_LEGACY_LIBS | sed "s/,/ /g"); do
  publish_npm "$lib" "dfinity"
done
