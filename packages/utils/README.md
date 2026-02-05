# utils-js

A collection of utilities and constants for NNS/SNS projects.

[![npm version](https://img.shields.io/npm/v/@dfinity/utils.svg?logo=npm)](https://www.npmjs.com/package/@dfinity/utils) [![GitHub license](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Table of contents

- [Installation](#installation)
- [Features](#features)

## Installation

You can use `utils-js` by installing it in your project.

```bash
npm i @dfinity/utils
```

The bundle needs peer dependencies, be sure that following resources are available in your project as well.

```bash
npm i @icp-sdk/core
```

## Features

`utils-js` implements following features:

<!-- TSDOC_START -->

### :toolbox: Functions

- [convertStringToE8s](#gear-convertstringtoe8s)
- [isNullish](#gear-isnullish)
- [nonNullish](#gear-nonnullish)
- [notEmptyString](#gear-notemptystring)
- [isEmptyString](#gear-isemptystring)
- [queryAndUpdate](#gear-queryandupdate)
- [defaultAgent](#gear-defaultagent)
- [createAgent](#gear-createagent)
- [createServices](#gear-createservices)
- [assertNonNullish](#gear-assertnonnullish)
- [asNonNullish](#gear-asnonnullish)
- [assertPercentageNumber](#gear-assertpercentagenumber)
- [assertNever](#gear-assertnever)
- [uint8ArrayToBigInt](#gear-uint8arraytobigint)
- [bigIntToUint8Array](#gear-biginttouint8array)
- [numberToUint8Array](#gear-numbertouint8array)
- [arrayBufferToUint8Array](#gear-arraybuffertouint8array)
- [uint8ArrayToArrayOfNumber](#gear-uint8arraytoarrayofnumber)
- [arrayOfNumberToUint8Array](#gear-arrayofnumbertouint8array)
- [asciiStringToByteArray](#gear-asciistringtobytearray)
- [hexStringToUint8Array](#gear-hexstringtouint8array)
- [uint8ArraysEqual](#gear-uint8arraysequal)
- [uint8ArrayToHexString](#gear-uint8arraytohexstring)
- [candidNumberArrayToBigInt](#gear-candidnumberarraytobigint)
- [encodeBase32](#gear-encodebase32)
- [decodeBase32](#gear-decodebase32)
- [uint8ArrayToBase64](#gear-uint8arraytobase64)
- [base64ToUint8Array](#gear-base64touint8array)
- [bigEndianCrc32](#gear-bigendiancrc32)
- [jsonReplacer](#gear-jsonreplacer)
- [jsonReviver](#gear-jsonreviver)
- [hashObject](#gear-hashobject)
- [hashText](#gear-hashtext)
- [secondsToDuration](#gear-secondstoduration)
- [nowInBigIntNanoSeconds](#gear-nowinbigintnanoseconds)
- [toBigIntNanoSeconds](#gear-tobigintnanoseconds)
- [debounce](#gear-debounce)
- [toNullable](#gear-tonullable)
- [fromNullable](#gear-fromnullable)
- [fromDefinedNullable](#gear-fromdefinednullable)
- [fromNullishNullable](#gear-fromnullishnullable)
- [principalToSubAccount](#gear-principaltosubaccount)
- [smallerVersion](#gear-smallerversion)

#### :gear: convertStringToE8s

Receives a string representing a number and returns the big int or error.

| Function             | Type                                                  |
| -------------------- | ----------------------------------------------------- |
| `convertStringToE8s` | `(value: string) => bigint or FromStringToTokenError` |

Parameters:

- `amount`: - in string format

Returns:

bigint | FromStringToTokenError

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/parser/token.ts#L12)

#### :gear: isNullish

Checks if a given argument is null or undefined.

| Function    | Type                                                                     |
| ----------- | ------------------------------------------------------------------------ |
| `isNullish` | `<T>(argument: T or null or undefined) => argument is null or undefined` |

Parameters:

- `argument`: - The argument to check.

Returns:

`true` if the argument is null or undefined; otherwise, `false`.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/nullish.utils.ts#L8)

#### :gear: nonNullish

Checks if a given argument is neither null nor undefined.

| Function     | Type                                                                  |
| ------------ | --------------------------------------------------------------------- |
| `nonNullish` | `<T>(argument: T or null or undefined) => argument is NonNullable<T>` |

Parameters:

- `argument`: - The argument to check.

Returns:

`true` if the argument is not null or undefined; otherwise, `false`.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/nullish.utils.ts#L19)

#### :gear: notEmptyString

Checks if a given value is not null, not undefined, and not an empty string.

| Function         | Type                                                      |
| ---------------- | --------------------------------------------------------- |
| `notEmptyString` | `(value: string or null or undefined) => value is string` |

Parameters:

- `value`: - The value to check.

Returns:

`true` if the value is not null, not undefined, and not an empty string; otherwise, `false`.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/nullish.utils.ts#L29)

#### :gear: isEmptyString

Checks if a given value is null, undefined, or an empty string.

| Function        | Type                                                                       |
| --------------- | -------------------------------------------------------------------------- |
| `isEmptyString` | `(value: string or null or undefined) => value is "" or null or undefined` |

Parameters:

- `value`: - The value to check.

Returns:

Type predicate indicating if the value is null, undefined, or an empty string.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/nullish.utils.ts#L39)

#### :gear: queryAndUpdate

This service performs a query (not-certified) call and/or an update (certified) call, and handles the results.

It is useful because it can do both type of calls for security reasons.
For example, malicious nodes can forge transactions and balance when calling an Index canister, if no update is performed to certify the results.

Furthermore, it can handle the results of the calls in different ways:

- `query` only performs a query call.
- `update` only performs an update call.
- `query_and_update` performs both calls.

The resolution can be:

- `all_settled` waits for all calls to settle.
- `race` waits for the first call to settle (typically, `query` is the fastest one).

Once the call(s) are done, the response is handled by the `onLoad` callback.
However, if an error occurs, it is handled by the error callbacks, if provided: one for the query call and one for the update call.
If no error callback is provided for the update call, the error is logged to the console.

| Function         | Type                                                                                                                                               |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `queryAndUpdate` | `<R, E = unknown>({ request, onLoad, onQueryError, onUpdateError, strategy, identity, resolution, }: QueryAndUpdateParams<R, E>) => Promise<void>` |

Parameters:

- `params`: The parameters to perform the request.
- `params.request`: The request to perform.
- `params.onLoad`: The callback to handle the response of the request.
- `params.onQueryError`: The callback to handle the error of the `query` request.
- `params.onUpdateError`: The callback to handle the error of the `update` request.
- `params.strategy`: The strategy to use. Default is `query_and_update`.
- `params.identity`: The identity to use for the request.
- `params.resolution`: The resolution to use. Default is `race`.

Returns:

A promise that resolves when the request is done.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/services/query.ts#L37)

#### :gear: defaultAgent

Get a default agent that connects to mainnet with the anonymous identity.

| Function       | Type          |
| -------------- | ------------- |
| `defaultAgent` | `() => Agent` |

Returns:

The default agent to use

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/agent.utils.ts#L14)

#### :gear: createAgent

Create an agent for a given identity

| Function      | Type                                                                                                              |
| ------------- | ----------------------------------------------------------------------------------------------------------------- |
| `createAgent` | `({ identity, host, fetchRootKey, verifyQuerySignatures, retryTimes, }: CreateAgentParams) => Promise<HttpAgent>` |

Parameters:

- `params`: The parameters to create a new HTTP agent
- `params.identity`: A mandatory identity to use for the agent
- `params.host`: An optional host to connect to, particularly useful for local development
- `params.fetchRootKey`: Fetch root key for certificate validation during local development or on testnet
- `params.verifyQuerySignatures`: Check for signatures in the state tree signed by the node that replies to queries - i.e. certify responses.
- `params.retryTimes`: Set the number of retries the agent should perform before error.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/agent.utils.ts#L30)

#### :gear: createServices

| Function         | Type                                                                                                                                                                                                                                                                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `createServices` | `<T>({ options: { canisterId, serviceOverride, certifiedServiceOverride, agent: agentOption, callTransform, queryTransform, }, idlFactory, certifiedIdlFactory, }: { options: Required<Pick<CanisterOptions<T>, "canisterId">> and Omit<CanisterOptions<T>, "canisterId"> and Pick<...>; idlFactory: IDL.InterfaceFactory; certifi...` |

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/actor.utils.ts#L17)

#### :gear: assertNonNullish

| Function           | Type                                                                              |
| ------------------ | --------------------------------------------------------------------------------- |
| `assertNonNullish` | `<T>(value: T, message?: string or undefined) => asserts value is NonNullable<T>` |

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/asserts.utils.ts#L4)

#### :gear: asNonNullish

| Function       | Type                                                             |
| -------------- | ---------------------------------------------------------------- |
| `asNonNullish` | `<T>(value: T, message?: string or undefined) => NonNullable<T>` |

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/asserts.utils.ts#L18)

#### :gear: assertPercentageNumber

| Function                 | Type                           |
| ------------------------ | ------------------------------ |
| `assertPercentageNumber` | `(percentage: number) => void` |

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/asserts.utils.ts#L23)

#### :gear: assertNever

Utility to enforce exhaustiveness checks in TypeScript.

This function should only be called in branches of a `switch` or conditional
that should be unreachable if the union type has been fully handled.

By typing the parameter as `never`, the compiler will emit an error if
a new variant is added to the union but not covered in the logic.

| Function      | Type                                                 |
| ------------- | ---------------------------------------------------- |
| `assertNever` | `(_: never, message?: string or undefined) => never` |

Parameters:

- `_`: - A value that should be of type `never`. If this is not the case,
  the TypeScript compiler will flag a type error.
- `message`: - Optional custom error message to include in the thrown error.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/asserts.utils.ts#L47)

#### :gear: uint8ArrayToBigInt

| Function             | Type                                             |
| -------------------- | ------------------------------------------------ |
| `uint8ArrayToBigInt` | `(array: Uint8Array<ArrayBufferLike>) => bigint` |

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/arrays.utils.ts#L3)

#### :gear: bigIntToUint8Array

| Function             | Type                                             |
| -------------------- | ------------------------------------------------ |
| `bigIntToUint8Array` | `(value: bigint) => Uint8Array<ArrayBufferLike>` |

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/arrays.utils.ts#L14)

#### :gear: numberToUint8Array

| Function             | Type                                             |
| -------------------- | ------------------------------------------------ |
| `numberToUint8Array` | `(value: number) => Uint8Array<ArrayBufferLike>` |

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/arrays.utils.ts#L30)

#### :gear: arrayBufferToUint8Array

| Function                  | Type                                                   |
| ------------------------- | ------------------------------------------------------ |
| `arrayBufferToUint8Array` | `(buffer: ArrayBuffer) => Uint8Array<ArrayBufferLike>` |

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/arrays.utils.ts#L39)

#### :gear: uint8ArrayToArrayOfNumber

| Function                    | Type                                               |
| --------------------------- | -------------------------------------------------- |
| `uint8ArrayToArrayOfNumber` | `(array: Uint8Array<ArrayBufferLike>) => number[]` |

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/arrays.utils.ts#L42)

#### :gear: arrayOfNumberToUint8Array

| Function                    | Type                                                 |
| --------------------------- | ---------------------------------------------------- |
| `arrayOfNumberToUint8Array` | `(numbers: number[]) => Uint8Array<ArrayBufferLike>` |

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/arrays.utils.ts#L45)

#### :gear: asciiStringToByteArray

| Function                 | Type                         |
| ------------------------ | ---------------------------- |
| `asciiStringToByteArray` | `(text: string) => number[]` |

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/arrays.utils.ts#L48)

#### :gear: hexStringToUint8Array

| Function                | Type                                                 |
| ----------------------- | ---------------------------------------------------- |
| `hexStringToUint8Array` | `(hexString: string) => Uint8Array<ArrayBufferLike>` |

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/arrays.utils.ts#L51)

#### :gear: uint8ArraysEqual

Compare two Uint8Arrays for byte-level equality.

| Function           | Type                                                                                         |
| ------------------ | -------------------------------------------------------------------------------------------- |
| `uint8ArraysEqual` | `({ a, b }: { a: Uint8Array<ArrayBufferLike>; b: Uint8Array<ArrayBufferLike>; }) => boolean` |

Parameters:

- `params.a`: - First Uint8Array to compare.
- `params.b`: - Second Uint8Array to compare.

Returns:

True if both arrays have the same length and identical contents.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/arrays.utils.ts#L67)

#### :gear: uint8ArrayToHexString

| Function                | Type                                                         |
| ----------------------- | ------------------------------------------------------------ |
| `uint8ArrayToHexString` | `(bytes: Uint8Array<ArrayBufferLike> or number[]) => string` |

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/arrays.utils.ts#L70)

#### :gear: candidNumberArrayToBigInt

| Function                    | Type                          |
| --------------------------- | ----------------------------- |
| `candidNumberArrayToBigInt` | `(array: number[]) => bigint` |

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/arrays.utils.ts#L80)

#### :gear: encodeBase32

Encode an Uint8Array to a base32 string.

| Function       | Type                                             |
| -------------- | ------------------------------------------------ |
| `encodeBase32` | `(input: Uint8Array<ArrayBufferLike>) => string` |

Parameters:

- `input`: The input array to encode.

Returns:

A Base32 string encoding the input.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/base32.utils.ts#L21)

#### :gear: decodeBase32

Decode a base32 string to Uint8Array.

| Function       | Type                                             |
| -------------- | ------------------------------------------------ |
| `decodeBase32` | `(input: string) => Uint8Array<ArrayBufferLike>` |

Parameters:

- `input`: The input string to decode.
- `input`: The base32 encoded string to decode.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/base32.utils.ts#L67)

#### :gear: uint8ArrayToBase64

Converts a Uint8Array (binary data) to a base64 encoded string.

| Function             | Type                                                  |
| -------------------- | ----------------------------------------------------- |
| `uint8ArrayToBase64` | `(uint8Array: Uint8Array<ArrayBufferLike>) => string` |

Parameters:

- `uint8Array`: - The Uint8Array containing binary data to be encoded.

Returns:

- The base64 encoded string representation of the binary data.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/base64.utils.ts#L7)

#### :gear: base64ToUint8Array

Converts a base64 encoded string to a Uint8Array (binary data).

| Function             | Type                                                    |
| -------------------- | ------------------------------------------------------- |
| `base64ToUint8Array` | `(base64String: string) => Uint8Array<ArrayBufferLike>` |

Parameters:

- `base64String`: - The base64 encoded string to be decoded.

Returns:

- The Uint8Array representation of the decoded binary data.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/base64.utils.ts#L16)

#### :gear: bigEndianCrc32

| Function         | Type                                                                  |
| ---------------- | --------------------------------------------------------------------- |
| `bigEndianCrc32` | `(bytes: Uint8Array<ArrayBufferLike>) => Uint8Array<ArrayBufferLike>` |

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/crc.utils.ts#L61)

#### :gear: jsonReplacer

A custom replacer for `JSON.stringify` that converts specific types not natively supported
by the API into JSON-compatible formats.

Supported conversions:

- `BigInt` → `{ "__bigint__": string }`
- `Principal` → `{ "__principal__": string }`
- `Uint8Array` → `{ "__uint8array__": number[] }`

| Function       | Type                                        |
| -------------- | ------------------------------------------- |
| `jsonReplacer` | `(_key: string, value: unknown) => unknown` |

Parameters:

- `_key`: - Ignored. Only provided for API compatibility.
- `value`: - The value to transform before stringification.

Returns:

The transformed value if it matches a known type, otherwise the original value.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/json.utils.ts#L22)

#### :gear: jsonReviver

A custom reviver for `JSON.parse` that reconstructs specific types from their JSON-encoded representations.

This reverses the transformations applied by `jsonReplacer`, restoring the original types.

Supported conversions:

- `{ "__bigint__": string }` → `BigInt`
- `{ "__principal__": string }` → `Principal`
- `{ "__uint8array__": number[] }` → `Uint8Array`

| Function      | Type                                        |
| ------------- | ------------------------------------------- |
| `jsonReviver` | `(_key: string, value: unknown) => unknown` |

Parameters:

- `_key`: - Ignored but provided for API compatibility.
- `value`: - The parsed value to transform.

Returns:

The reconstructed value if it matches a known type, otherwise the original value.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/json.utils.ts#L55)

#### :gear: hashObject

Generates a SHA-256 hash from the given object.

The object is first stringified using a custom `jsonReplacer`, then
hashed using the SubtleCrypto API. The resulting hash is returned as a hex string.

| Function     | Type                                               |
| ------------ | -------------------------------------------------- |
| `hashObject` | `<T extends object>(params: T) => Promise<string>` |

Parameters:

- `params`: - The object to hash.

Returns:

A promise that resolves to the hex string of the SHA-256 hash.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/crypto.utils.ts#L14)

#### :gear: hashText

Generates a SHA-256 hash from a plain text string.

The string is UTF-8 encoded and hashed using the SubtleCrypto API.
The resulting hash is returned as a hexadecimal string.

| Function   | Type                                |
| ---------- | ----------------------------------- |
| `hashText` | `(text: string) => Promise<string>` |

Parameters:

- `text`: - The text to hash.

Returns:

A promise that resolves to the hex string of the SHA-256 hash.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/crypto.utils.ts#L31)

#### :gear: secondsToDuration

Convert seconds to a human-readable duration, such as "6 days, 10 hours."

| Function            | Type                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| `secondsToDuration` | `({ seconds, i18n, }: { seconds: bigint; i18n?: I18nSecondsToDuration or undefined; }) => string` |

Parameters:

- `options`: - The options object.
- `options.seconds`: - The number of seconds to convert.
- `options.i18n`: - The i18n object for customizing language and units. Defaults to English.

Returns:

The human-readable duration string.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/date.utils.ts#L43)

#### :gear: nowInBigIntNanoSeconds

Returns the current timestamp in nanoseconds as a `bigint`.

| Function                 | Type           |
| ------------------------ | -------------- |
| `nowInBigIntNanoSeconds` | `() => bigint` |

Returns:

The current timestamp in nanoseconds.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/date.utils.ts#L123)

#### :gear: toBigIntNanoSeconds

Converts a given `Date` object to a timestamp in nanoseconds as a `bigint`.

| Function              | Type                     |
| --------------------- | ------------------------ |
| `toBigIntNanoSeconds` | `(date: Date) => bigint` |

Parameters:

- `date`: - The `Date` object to convert.

Returns:

The timestamp in nanoseconds.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/date.utils.ts#L132)

#### :gear: debounce

Creates a debounced version of the provided function.

The debounced function postpones its execution until after a certain amount of time
has elapsed since the last time it was invoked. This is useful for limiting the rate
at which a function is called (e.g. in response to user input or events).

| Function   | Type                                                                              |
| ---------- | --------------------------------------------------------------------------------- |
| `debounce` | `(func: Function, timeout?: number or undefined) => (...args: unknown[]) => void` |

Parameters:

- `func`: - The function to debounce. It will only be called after no new calls happen within the specified timeout.
- `timeout`: - The debounce delay in milliseconds. Defaults to 300ms if not provided or invalid.

Returns:

A debounced version of the original function.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/debounce.utils.ts#L13)

#### :gear: toNullable

Converts a value into a Candid-style variant representation of an optional value.

| Function     | Type                                                 |
| ------------ | ---------------------------------------------------- |
| `toNullable` | `<T>(value?: T or null or undefined) => Nullable<T>` |

Parameters:

- `value`: - The value to convert into a Candid-style variant.

Returns:

A Candid-style variant representation: an empty array for `null` and `undefined` or an array with the value.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/did.utils.ts#L12)

#### :gear: fromNullable

Extracts the value from a Candid-style variant representation of an optional value.

| Function       | Type                                        |
| -------------- | ------------------------------------------- |
| `fromNullable` | `<T>(value: Nullable<T>) => T or undefined` |

Parameters:

- `value`: - A Candid-style variant representing an optional value.

Returns:

The extracted value, or `undefined` if the array is empty.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/did.utils.ts#L22)

#### :gear: fromDefinedNullable

Extracts the value from a Candid-style variant representation of an optional value,
ensuring the value is defined. Throws an error if the array is empty or the value is nullish.

| Function              | Type                           |
| --------------------- | ------------------------------ |
| `fromDefinedNullable` | `<T>(value: Nullable<T>) => T` |

Parameters:

- `value`: - A Candid-style variant representing an optional value.

Returns:

The extracted value.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/did.utils.ts#L34)

#### :gear: fromNullishNullable

Extracts the value from a nullish Candid-style variant representation.

| Function              | Type                                               |
| --------------------- | -------------------------------------------------- |
| `fromNullishNullable` | `<T>(value: NullishNullable<T>) => T or undefined` |

Parameters:

- `value`: - A Candid-style variant or `undefined`.

Returns:

The extracted value, or `undefined` if the input is nullish or the array is empty.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/did.utils.ts#L49)

#### :gear: principalToSubAccount

Convert a principal to a Uint8Array 32 length.
e.g. Useful to convert a canister ID when topping up cycles with the Cmc canister

| Function                | Type                                                    |
| ----------------------- | ------------------------------------------------------- |
| `principalToSubAccount` | `(principal: Principal) => Uint8Array<ArrayBufferLike>` |

Parameters:

- `principal`: The principal that needs to be converted to Subaccount

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/principal.utils.ts#L8)

#### :gear: smallerVersion

Returns true if the current version is smaller than the minVersion, false if equal or bigger.
Tags after patch version are ignored, e.g. 1.0.0-beta.1 is considered equal to 1.0.0.

| Function         | Type                                                                                            |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| `smallerVersion` | `({ minVersion, currentVersion, }: { minVersion: string; currentVersion: string; }) => boolean` |

Parameters:

- `params.minVersion`: Ex: "1.0.0"
- `params.currentVersion`: Ex: "2.0.0"

Returns:

boolean

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/version.utils.ts#L34)

### :wrench: Constants

- [E8S_PER_TOKEN](#gear-e8s_per_token)
- [ICPToken](#gear-icptoken)

#### :gear: E8S_PER_TOKEN

| Constant        | Type     |
| --------------- | -------- |
| `E8S_PER_TOKEN` | `bigint` |

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/constants/constants.ts#L1)

#### :gear: ICPToken

| Constant   | Type    |
| ---------- | ------- |
| `ICPToken` | `Token` |

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/parser/token.ts#L116)

### :factory: TokenAmount

Deprecated. Use TokenAmountV2 instead which supports decimals !== 8.

Represents an amount of tokens.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/parser/token.ts#L130)

#### Static Methods

- [fromE8s](#gear-frome8s)
- [fromString](#gear-fromstring)
- [fromNumber](#gear-fromnumber)

##### :gear: fromE8s

Initialize from a bigint. Bigint are considered e8s.

| Method    | Type                                                                     |
| --------- | ------------------------------------------------------------------------ |
| `fromE8s` | `({ amount, token, }: { amount: bigint; token: Token; }) => TokenAmount` |

Parameters:

- `params.amount`: The amount in bigint format.
- `params.token`: The token type.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/parser/token.ts#L147)

##### :gear: fromString

Initialize from a string. Accepted formats:

1234567.8901
1'234'567.8901
1,234,567.8901

| Method       | Type                                                                                               |
| ------------ | -------------------------------------------------------------------------------------------------- |
| `fromString` | `({ amount, token, }: { amount: string; token: Token; }) => FromStringToTokenError or TokenAmount` |

Parameters:

- `params.amount`: The amount in string format.
- `params.token`: The token type.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/parser/token.ts#L168)

##### :gear: fromNumber

Initialize from a number.

1 integer is considered E8S_PER_TOKEN

| Method       | Type                                                                     |
| ------------ | ------------------------------------------------------------------------ |
| `fromNumber` | `({ amount, token, }: { amount: number; token: Token; }) => TokenAmount` |

Parameters:

- `params.amount`: The amount in number format.
- `params.token`: The token type.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/parser/token.ts#L198)

#### Methods

- [toE8s](#gear-toe8s)

##### :gear: toE8s

| Method  | Type           |
| ------- | -------------- |
| `toE8s` | `() => bigint` |

Returns:

The amount of e8s.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/parser/token.ts#L224)

### :factory: TokenAmountV2

Represents an amount of tokens.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/parser/token.ts#L236)

#### Static Methods

- [fromUlps](#gear-fromulps)
- [fromString](#gear-fromstring)
- [fromNumber](#gear-fromnumber)

##### :gear: fromUlps

Initialize from a bigint. Bigint are considered ulps.

| Method     | Type                                                                       |
| ---------- | -------------------------------------------------------------------------- |
| `fromUlps` | `({ amount, token, }: { amount: bigint; token: Token; }) => TokenAmountV2` |

Parameters:

- `params.amount`: The amount in bigint format.
- `params.token`: The token type.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/parser/token.ts#L249)

##### :gear: fromString

Initialize from a string. Accepted formats:

1234567.8901
1'234'567.8901
1,234,567.8901

| Method       | Type                                                                                                 |
| ------------ | ---------------------------------------------------------------------------------------------------- |
| `fromString` | `({ amount, token, }: { amount: string; token: Token; }) => FromStringToTokenError or TokenAmountV2` |

Parameters:

- `params.amount`: The amount in string format.
- `params.token`: The token type.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/parser/token.ts#L270)

##### :gear: fromNumber

Initialize from a number.

1 integer is considered 10^{token.decimals} ulps

| Method       | Type                                                                       |
| ------------ | -------------------------------------------------------------------------- |
| `fromNumber` | `({ amount, token, }: { amount: number; token: Token; }) => TokenAmountV2` |

Parameters:

- `params.amount`: The amount in number format.
- `params.token`: The token type.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/parser/token.ts#L294)

#### Methods

- [toUlps](#gear-toulps)
- [toE8s](#gear-toe8s)

##### :gear: toUlps

| Method   | Type           |
| -------- | -------------- |
| `toUlps` | `() => bigint` |

Returns:

The amount of ulps.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/parser/token.ts#L324)

##### :gear: toE8s

| Method  | Type           |
| ------- | -------------- |
| `toE8s` | `() => bigint` |

Returns:

The amount of ulps in e8s precision

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/parser/token.ts#L332)

### :factory: Canister

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/services/canister.ts#L4)

### :factory: AgentManager

AgentManager class manages HttpAgent instances for different identities.

It caches agents by identity to optimise resource usage and avoid unnecessary agent creation.
Provides functionality to create new agents, retrieve cached agents, and clear the cache when needed.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/agent.utils.ts#L56)

#### Static Methods

- [create](#gear-create)

##### :gear: create

Static factory method to create a new AgentManager instance.

This method serves as an alternative to directly using the private constructor,
making it more convenient to create instances of `AgentManager` using a simple and clear method.

| Method   | Type                                           |
| -------- | ---------------------------------------------- |
| `create` | `(config: AgentManagerConfig) => AgentManager` |

Parameters:

- `config`: - Configuration options for the AgentManager instance.
- `config.fetchRootKey`: - Whether to fetch the root key for certificate validation.
- `config.host`: - The host to connect to.

Returns:

A new instance of `AgentManager`.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/agent.utils.ts#L72)

#### Methods

- [getAgent](#gear-getagent)
- [clearAgents](#gear-clearagents)

##### :gear: getAgent

Get or create an HTTP agent for a given identity.

If the agent for the specified identity has been created and cached, it is retrieved from the cache.
If no agent exists for the identity, a new one is created, cached, and then returned.

| Method     | Type                                                             |
| ---------- | ---------------------------------------------------------------- |
| `getAgent` | `({ identity, }: { identity: Identity; }) => Promise<HttpAgent>` |

Parameters:

- `identity`: - The identity to be used to create the agent.

Returns:

The HttpAgent associated with the given identity.

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/agent.utils.ts#L85)

##### :gear: clearAgents

Clear the cache of HTTP agents.

This method removes all cached agents, forcing new agent creation on the next request for any identity.
Useful when identities have changed or if you want to reset all active connections.

| Method        | Type         |
| ------------- | ------------ |
| `clearAgents` | `() => void` |

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/agent.utils.ts#L117)

### :factory: InvalidPercentageError

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/asserts.utils.ts#L1)

### :factory: NullishError

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/utils/asserts.utils.ts#L2)

### :nut_and_bolt: Enum

- [FromStringToTokenError](#gear-fromstringtotokenerror)

#### :gear: FromStringToTokenError

| Property                      | Type | Description |
| ----------------------------- | ---- | ----------- |
| `FractionalMoreThan8Decimals` | ``   |             |
| `InvalidFormat`               | ``   |             |
| `FractionalTooManyDecimals`   | ``   |             |

[:link: Source](https://github.com/dfinity/icp-js-canisters/tree/main/packages/utils/src/enums/token.enums.ts#L1)

<!-- TSDOC_END -->
