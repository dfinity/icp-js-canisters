/**
 * Converts a Uint8Array (binary data) to a base64 encoded string.
 *
 * @param {Uint8Array} uint8Array - The Uint8Array containing binary data to be encoded.
 * @returns {string} - The base64 encoded string representation of the binary data.
 */
export const uint8ArrayToBase64 = (uint8Array: Uint8Array): string => {
  // Spreading large Uint8Arrays or using Array.from loses precision when used together with String.fromCharCode.
  // Therefore, we use a chunked loop, which better than a reducer or iterating on every value.
  // Spreading a small chunk - such as 32kb - works as expected.
  const chunkSize = 0x8000; // 32 kb
  const chunks: string[] = [];
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    chunks.push(String.fromCharCode(...uint8Array.subarray(i, i + chunkSize)));
  }
  return btoa(chunks.join(""));
};

/**
 * Converts a base64 encoded string to a Uint8Array (binary data).
 *
 * @param {string} base64String - The base64 encoded string to be decoded.
 * @returns {Uint8Array} - The Uint8Array representation of the decoded binary data.
 */
export const base64ToUint8Array = (base64String: string): Uint8Array =>
  Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0));
