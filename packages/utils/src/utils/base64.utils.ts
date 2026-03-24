/**
 * Converts a Uint8Array (binary data) to a base64 encoded string.
 *
 * @param {Uint8Array} uint8Array - The Uint8Array containing binary data to be encoded.
 * @returns {string} - The base64 encoded string representation of the binary data.
 */
export const uint8ArrayToBase64 = (uint8Array: Uint8Array): string => {
  // Spreading large Uint8Arrays or using Array.from loses precision when used together with String.fromCharCode.
  // Therefore, we use a for loop, which also performs better than a reducer in this case.
  let binary = "";
  for (const uint8 of uint8Array) {
    binary += String.fromCharCode(uint8);
  }
  return btoa(binary);
};

/**
 * Converts a base64 encoded string to a Uint8Array (binary data).
 *
 * @param {string} base64String - The base64 encoded string to be decoded.
 * @returns {Uint8Array} - The Uint8Array representation of the decoded binary data.
 */
export const base64ToUint8Array = (base64String: string): Uint8Array =>
  Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0));
