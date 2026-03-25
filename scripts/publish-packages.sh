#!/usr/bin/env bash

# Shared package lists and iteration helper used by publish-npm.sh and publish-patch.sh.
# When adding a new package to the monorepo, update the lists here only.

# Tips: libs used by other libs first
DFINITY_LIBS=utils,zod-schemas,nns-proto

ICP_SDK=canisters

DFINITY_LEGACY_LIBS=cmc,ic-management,ckbtc,cketh,ledger-icrc,ledger-icp,nns,sns

function for_each_package() {
  local callback=$1

  for lib in $(echo $DFINITY_LIBS | sed "s/,/ /g"); do
    $callback "$lib" "dfinity"
  done

  for lib in $(echo $ICP_SDK | sed "s/,/ /g"); do
    $callback "$lib" "icp-sdk"
  done

  for lib in $(echo $DFINITY_LEGACY_LIBS | sed "s/,/ /g"); do
    $callback "$lib" "dfinity"
  done
}
