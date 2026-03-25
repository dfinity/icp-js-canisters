#!/usr/bin/env bash

# Reference: NPM RRFC --if-needed https://github.com/npm/rfcs/issues/466

function publish_npm() {
  local lib=$1
  local org=$2

  LOCAL_VERSION=$(npm --silent pack -w packages/"$lib" --json | jq -r '.[] | .version')

  NPM_VERSION_EXISTS=$(npm show "@$org/$lib@$LOCAL_VERSION" version 2>/dev/null || true)

  if [ -n "$NPM_VERSION_EXISTS" ]; then
    echo "@$org/$lib@$LOCAL_VERSION already published to NPM. Skipping."
  else
    echo "Publishing @$org/$lib@$LOCAL_VERSION..."
    npm publish --workspace=packages/"$lib" --provenance --access public
  fi
}

# Tips: libs use by other libs first
DFINITY_LIBS=utils,zod-schemas,nns-proto

for lib in $(echo $DFINITY_LIBS | sed "s/,/ /g"); do
  publish_npm "$lib" "dfinity"
done

ICP_SDK=canisters

for lib in $(echo $ICP_SDK | sed "s/,/ /g"); do
  publish_npm "$lib" "icp-sdk"
done

DFINITY_LEGACY_LIBS=cmc,ic-management,ckbtc,cketh,ledger-icrc,ledger-icp,nns,sns

for lib in $(echo $DFINITY_LEGACY_LIBS | sed "s/,/ /g"); do
  publish_npm "$lib" "dfinity"
done
