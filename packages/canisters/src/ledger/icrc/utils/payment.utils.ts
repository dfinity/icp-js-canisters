import { isNullish, nonNullish } from "@dfinity/utils";

/**
 * 👀 This feature is currently in draft. You can find more information about it at https://github.com/dfinity/ICRC/issues/22.
 *
 * A naive implementation of a payment parser. Given a code, the function attempts to extract a token name, account identifier (textual representation), and an optional amount.
 *
 * If the code doesn't match the expected pattern, `undefined` is returned for simplicity.
 * Similarly, if an optional amount is provided but it's not a valid number, the parser will not throw an exception and returns `undefined`.
 *
 * Please note that this function doesn't perform any validity checks on the extracted information.
 * It does not verify if the token is known or if the identifier is a valid address.
 *
 * ```
 * urn            = token ":" address [ "?" params]
 * token         = [ ckbtc / icp / chat / bitcoin / ethereum ... ]
 * address       = STRING
 * params        = param [ "&" params ]
 * param         = [ amountparam ]
 * amountparam   = "amount=" *digit [ "." *digit ]
 * ```
 *
 * @param code string
 * @returns { token: string; identifier: string; amount?: number } | undefined
 */
export const decodePayment = (
  code: string,
): { token: string; identifier: string; amount?: number } | undefined => {
  const regex =
    /^([a-zA-Z]+):([A-Za-z0-9:\-.]+).*?(?:[?&](?:amount|value)=(\d+(?:\.\d+)?))?$/;

  const match = code.match(regex);
  if (isNullish(match)) {
    return undefined;
  }

  const [_, token, identifier, amount] = match;

  return {
    token,
    identifier,
    ...(nonNullish(amount) &&
      !isNaN(parseFloat(amount)) && { amount: parseFloat(amount) }),
  };
};
