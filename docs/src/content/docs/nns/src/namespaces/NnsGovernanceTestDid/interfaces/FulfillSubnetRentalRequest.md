---
title: FulfillSubnetRentalRequest
editUrl: false
next: true
prev: true
---

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:231

Creates a rented subnet from a rental request (in the Subnet Rental
canister).

## Properties

### node_ids

> **node_ids**: \[\] \| \[`Principal`[]\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:262

Which nodes will be members of the subnet.

---

### replica_version_id

> **replica_version_id**: \[\] \| \[`string`\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:258

What software the nodes will run.

This must be approved by a prior proposal to bless an IC OS version.

This is a FULL git commit ID in the ic repo. (Therefore, it must be a 40
character hexidecimal string, not an abbreviated git commit ID.)

One way to find a suitable value is with the following command:

ic-admin \
get-subnet 0 \
--nns-urls https://nns.ic0.app \
| grep replica_version_id

Where to obtain a recent version of ic-admin:

https://github.com/dfinity/ic/releases/latest

---

### user

> **user**: \[\] \| \[`Principal`\]

Defined in: packages/canisters/declarations/nns/governance_test.d.ts:238

Identifies which rental request to fulfill.

(Identifying the rental request by user works, because a user can have at
most one rental request in the Subnet Rental canister).
