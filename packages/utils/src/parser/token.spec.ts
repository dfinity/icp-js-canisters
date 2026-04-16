import { FromStringToTokenError } from "../enums/token.enums";
import { ICPToken, TokenAmount, TokenAmountV2 } from "./token";

describe("ICP with 8 decimals", () => {
  it("can be initialized from a whole number string", () => {
    expect(TokenAmount.fromString({ token: ICPToken, amount: "1" })).toEqual(
      TokenAmount.fromE8s({ token: ICPToken, amount: BigInt(100000000) }),
    );
    expect(TokenAmount.fromString({ token: ICPToken, amount: "1234" })).toEqual(
      TokenAmount.fromE8s({ token: ICPToken, amount: BigInt(123400000000) }),
    );
    expect(
      TokenAmount.fromString({ token: ICPToken, amount: "000001234" }),
    ).toEqual(
      TokenAmount.fromE8s({ token: ICPToken, amount: BigInt(123400000000) }),
    );
    expect(TokenAmount.fromString({ token: ICPToken, amount: " 1" })).toEqual(
      TokenAmount.fromE8s({ token: ICPToken, amount: BigInt(100000000) }),
    );
    expect(
      TokenAmount.fromString({ token: ICPToken, amount: "1,000" }),
    ).toEqual(
      TokenAmount.fromE8s({ token: ICPToken, amount: BigInt(100000000000) }),
    );
    expect(
      TokenAmount.fromString({ token: ICPToken, amount: "1'000" }),
    ).toEqual(
      TokenAmount.fromE8s({ token: ICPToken, amount: BigInt(100000000000) }),
    );
    expect(
      TokenAmount.fromString({ token: ICPToken, amount: "1'000'000" }),
    ).toEqual(
      TokenAmount.fromE8s({ token: ICPToken, amount: BigInt(100000000000000) }),
    );
    expect(
      TokenAmount.fromString({ token: ICPToken, amount: "1'000'000" }),
    ).toEqual(TokenAmount.fromNumber({ token: ICPToken, amount: 1_000_000 }));
    expect(
      TokenAmount.fromString({ token: ICPToken, amount: "1'000'000" }),
    ).toEqual(
      TokenAmount.fromE8s({ token: ICPToken, amount: BigInt(100000000000000) }),
    );
    expect(
      TokenAmount.fromString({ token: ICPToken, amount: "1'000" }),
    ).toEqual(TokenAmount.fromNumber({ token: ICPToken, amount: 1_000 }));
  });

  it("can be initialized from a fractional number string", () => {
    expect(TokenAmount.fromString({ token: ICPToken, amount: "0.1" })).toEqual(
      TokenAmount.fromE8s({ token: ICPToken, amount: BigInt(10000000) }),
    );
    expect(TokenAmount.fromString({ token: ICPToken, amount: "0.1" })).toEqual(
      TokenAmount.fromNumber({ token: ICPToken, amount: 0.1 }),
    );
    expect(
      TokenAmount.fromString({ token: ICPToken, amount: "45.1231" }),
    ).toEqual(TokenAmount.fromNumber({ token: ICPToken, amount: 45.1231 }));
    expect(
      TokenAmount.fromString({ token: ICPToken, amount: "0.3319" }),
    ).toEqual(TokenAmount.fromNumber({ token: ICPToken, amount: 0.3319 }));
    expect(
      TokenAmount.fromString({ token: ICPToken, amount: "0.0001" }),
    ).toEqual(TokenAmount.fromE8s({ token: ICPToken, amount: BigInt(10000) }));
    expect(
      TokenAmount.fromString({ token: ICPToken, amount: "0.00000001" }),
    ).toEqual(TokenAmount.fromE8s({ token: ICPToken, amount: BigInt(1) }));
    expect(
      TokenAmount.fromString({ token: ICPToken, amount: "0.0000000001" }),
    ).toEqual(FromStringToTokenError.FractionalMoreThan8Decimals);
    expect(TokenAmount.fromString({ token: ICPToken, amount: ".01" })).toEqual(
      TokenAmount.fromE8s({ token: ICPToken, amount: BigInt(1000000) }),
    );
  });

  it("can be initialized from a mixed string", () => {
    expect(TokenAmount.fromString({ token: ICPToken, amount: "1.1" })).toEqual(
      TokenAmount.fromE8s({ token: ICPToken, amount: BigInt(110000000) }),
    );
    expect(TokenAmount.fromString({ token: ICPToken, amount: "1.1" })).toEqual(
      TokenAmount.fromE8s({ token: ICPToken, amount: BigInt(110000000) }),
    );
    expect(
      TokenAmount.fromString({ token: ICPToken, amount: "12,345.00000001" }),
    ).toEqual(
      TokenAmount.fromE8s({ token: ICPToken, amount: BigInt(1234500000001) }),
    );
    expect(
      TokenAmount.fromString({ token: ICPToken, amount: "12'345.00000001" }),
    ).toEqual(
      TokenAmount.fromE8s({ token: ICPToken, amount: BigInt(1234500000001) }),
    );
    expect(
      TokenAmount.fromString({ token: ICPToken, amount: "12345.00000001" }),
    ).toEqual(
      TokenAmount.fromE8s({ token: ICPToken, amount: BigInt(1234500000001) }),
    );
    expect(TokenAmount.fromString({ token: ICPToken, amount: "1e-8" })).toEqual(
      TokenAmount.fromE8s({ token: ICPToken, amount: BigInt(1) }),
    );
  });

  it("returns an error on invalid formats", () => {
    expect(TokenAmount.fromString({ token: ICPToken, amount: "1.1.1" })).toBe(
      FromStringToTokenError.InvalidFormat,
    );
    expect(TokenAmount.fromString({ token: ICPToken, amount: "a" })).toBe(
      FromStringToTokenError.InvalidFormat,
    );
    expect(TokenAmount.fromString({ token: ICPToken, amount: "3.a" })).toBe(
      FromStringToTokenError.InvalidFormat,
    );
    expect(
      TokenAmount.fromString({ token: ICPToken, amount: "123asdf$#@~!" }),
    ).toBe(FromStringToTokenError.InvalidFormat);

    const callToNumber = () =>
      TokenAmount.fromNumber({ token: ICPToken, amount: 1e-9 });

    expect(callToNumber).toThrow(
      expect.objectContaining({
        message: "Number 1e-9 has more than 8 decimals",
      }),
    );
  });

  it("rejects negative numbers", () => {
    expect(TokenAmount.fromString({ token: ICPToken, amount: "-1" })).toBe(
      FromStringToTokenError.InvalidFormat,
    );
  });
});

describe("TokenAmount v1", () => {
  const token = {
    symbol: "token",
    name: "token",
    decimals: 6,
  };

  it("Fails when decimals !== 8", () => {
    const call = () => {
      TokenAmount.fromE8s({ token, amount: BigInt(1) });
    };

    expect(call).toThrow(
      new Error("Use TokenAmountV2 for number of decimals other than 8"),
    );
  });
});

describe("TokenAmountV2 with 18 decimals", () => {
  const token = {
    symbol: "ckETH",
    name: "ckETH",
    decimals: 18,
  };

  it("can be initialized from a whole number string", () => {
    expect(TokenAmountV2.fromString({ token, amount: "1" })).toEqual(
      TokenAmountV2.fromUlps({
        token,
        amount: 1000000000000000000n,
      }),
    );
    expect(TokenAmountV2.fromString({ token, amount: "1234" })).toEqual(
      TokenAmountV2.fromUlps({
        token,
        amount: 1234000000000000000000n,
      }),
    );
    expect(TokenAmountV2.fromString({ token, amount: "000001234" })).toEqual(
      TokenAmountV2.fromUlps({
        token,
        amount: 1234000000000000000000n,
      }),
    );
    expect(TokenAmountV2.fromString({ token, amount: " 1" })).toEqual(
      TokenAmountV2.fromUlps({
        token,
        amount: 1000000000000000000n,
      }),
    );
    expect(TokenAmountV2.fromString({ token, amount: "1,000" })).toEqual(
      TokenAmountV2.fromUlps({
        token,
        amount: 1000000000000000000000n,
      }),
    );
    expect(TokenAmountV2.fromString({ token, amount: "1'000" })).toEqual(
      TokenAmountV2.fromUlps({
        token,
        amount: 1000000000000000000000n,
      }),
    );
    expect(TokenAmountV2.fromString({ token, amount: "1'000'000" })).toEqual(
      TokenAmountV2.fromUlps({
        token,
        amount: 1000000000000000000000000n,
      }),
    );
    expect(TokenAmountV2.fromString({ token, amount: "1'000'000" })).toEqual(
      TokenAmountV2.fromNumber({
        token,
        amount: 1_000_000,
      }),
    );
    expect(TokenAmountV2.fromString({ token, amount: "1'000'000" })).toEqual(
      TokenAmountV2.fromUlps({
        token,
        amount: 1000000000000000000000000n,
      }),
    );
    expect(TokenAmountV2.fromString({ token, amount: "1'000" })).toEqual(
      TokenAmountV2.fromNumber({ token, amount: 1_000 }),
    );
  });

  it("can be initialized from a fractional number string", () => {
    expect(TokenAmountV2.fromString({ token, amount: "0.1" })).toEqual(
      TokenAmountV2.fromUlps({
        token,
        amount: 100000000000000000n,
      }),
    );
    expect(TokenAmountV2.fromString({ token, amount: "0.1" })).toEqual(
      TokenAmountV2.fromNumber({ token, amount: 0.1 }),
    );
    expect(TokenAmountV2.fromString({ token, amount: "45.1231" })).toEqual(
      TokenAmountV2.fromNumber({ token, amount: 45.1231 }),
    );
    expect(TokenAmountV2.fromString({ token, amount: "0.3319" })).toEqual(
      TokenAmountV2.fromNumber({ token, amount: 0.3319 }),
    );
    expect(TokenAmountV2.fromString({ token, amount: "0.0001" })).toEqual(
      TokenAmountV2.fromUlps({ token, amount: 100000000000000n }),
    );
    expect(TokenAmountV2.fromString({ token, amount: "0.00000001" })).toEqual(
      TokenAmountV2.fromUlps({ token, amount: 10000000000n }),
    );
    expect(
      TokenAmountV2.fromString({
        token,
        amount: "0.00000000000000000001",
      }),
    ).toEqual(FromStringToTokenError.FractionalTooManyDecimals);
    expect(TokenAmountV2.fromString({ token, amount: ".01" })).toEqual(
      TokenAmountV2.fromUlps({
        token,
        amount: 10000000000000000n,
      }),
    );
  });

  it("can be initialized from a mixed string", () => {
    expect(TokenAmountV2.fromString({ token, amount: "1.1" })).toEqual(
      TokenAmountV2.fromUlps({
        token,
        amount: 1100000000000000000n,
      }),
    );
    expect(TokenAmountV2.fromString({ token, amount: "1.1" })).toEqual(
      TokenAmountV2.fromUlps({
        token,
        amount: 1100000000000000000n,
      }),
    );
    expect(
      TokenAmountV2.fromString({ token, amount: "12,345.00000001" }),
    ).toEqual(
      TokenAmountV2.fromUlps({
        token,
        amount: 12345000000010000000000n,
      }),
    );
    expect(
      TokenAmountV2.fromString({ token, amount: "12'345.00000001" }),
    ).toEqual(
      TokenAmountV2.fromUlps({
        token,
        amount: 12345000000010000000000n,
      }),
    );
    expect(
      TokenAmountV2.fromString({ token, amount: "12345.00000001" }),
    ).toEqual(
      TokenAmountV2.fromUlps({
        token,
        amount: 12345000000010000000000n,
      }),
    );
    expect(
      TokenAmountV2.fromString({
        token,
        amount: "100000000.000000000000000001",
      }),
    ).toEqual(
      TokenAmountV2.fromUlps({
        token,
        amount: 100000000000000000000000001n,
      }),
    );
    expect(
      TokenAmountV2.fromString({
        token,
        amount: "199999999.999999999999999991",
      }),
    ).toEqual(
      TokenAmountV2.fromUlps({
        token,
        amount: 199999999999999999999999991n,
      }),
    );
  });

  it("returns an error on invalid formats", () => {
    expect(TokenAmountV2.fromString({ token, amount: "1.1.1" })).toBe(
      FromStringToTokenError.InvalidFormat,
    );
    expect(TokenAmountV2.fromString({ token, amount: "a" })).toBe(
      FromStringToTokenError.InvalidFormat,
    );
    expect(TokenAmountV2.fromString({ token, amount: "3.a" })).toBe(
      FromStringToTokenError.InvalidFormat,
    );
    expect(TokenAmountV2.fromString({ token, amount: "123asdf$#@~!" })).toBe(
      FromStringToTokenError.InvalidFormat,
    );
  });

  it("does not support scientific notation as string", () => {
    expect(TokenAmountV2.fromString({ token, amount: "1e-9" })).toEqual(
      FromStringToTokenError.InvalidFormat,
    );
  });

  it("rejects negative numbers", () => {
    expect(TokenAmountV2.fromString({ token, amount: "-1" })).toBe(
      FromStringToTokenError.InvalidFormat,
    );
  });

  it("returns the value in e8s", () => {
    expect(
      (
        TokenAmountV2.fromString({ amount: "2", token }) as TokenAmountV2
      ).toE8s(),
    ).toEqual(200_000_000n);

    expect(
      (
        TokenAmountV2.fromString({ amount: "0.21", token }) as TokenAmountV2
      ).toE8s(),
    ).toEqual(21_000_000n);

    expect(
      (
        TokenAmountV2.fromString({ amount: "0.00021", token }) as TokenAmountV2
      ).toE8s(),
    ).toEqual(21_000n);

    expect(
      (
        TokenAmountV2.fromString({ amount: "2000", token }) as TokenAmountV2
      ).toE8s(),
    ).toEqual(200_000_000_000n);
  });
});

describe("TokenAmountV2 with 2 decimals", () => {
  const token = {
    symbol: "USD",
    name: "US Dollar",
    decimals: 2,
  };

  it("can be initialized from a whole number string", () => {
    expect(TokenAmountV2.fromString({ token, amount: "123" })).toEqual(
      TokenAmountV2.fromUlps({
        token,
        amount: 12300n,
      }),
    );
  });

  it("can be initialized from a fractional number string", () => {
    expect(TokenAmountV2.fromString({ token, amount: "0.99" })).toEqual(
      TokenAmountV2.fromUlps({
        token,
        amount: 99n,
      }),
    );
    expect(
      TokenAmountV2.fromString({
        token,
        amount: "0.001",
      }),
    ).toEqual(FromStringToTokenError.FractionalTooManyDecimals);
  });

  it("can be initialized from a mixed string", () => {
    expect(
      TokenAmountV2.fromString({
        token,
        amount: "100000000.91",
      }),
    ).toEqual(
      TokenAmountV2.fromUlps({
        token,
        amount: 10000000091n,
      }),
    );
  });

  it("can be initialized from a number", () => {
    expect(
      TokenAmountV2.fromNumber({
        token,
        amount: 100000000.91,
      }),
    ).toEqual(
      TokenAmountV2.fromUlps({
        token,
        amount: 10000000091n,
      }),
    );
  });

  it("returns the value in e8s", () => {
    expect(
      (
        TokenAmountV2.fromString({ amount: "2", token }) as TokenAmountV2
      ).toE8s(),
    ).toEqual(200_000_000n);

    expect(
      (
        TokenAmountV2.fromString({ amount: "0.21", token }) as TokenAmountV2
      ).toE8s(),
    ).toEqual(21_000_000n);

    expect(
      (
        TokenAmountV2.fromString({ amount: "2000", token }) as TokenAmountV2
      ).toE8s(),
    ).toEqual(200_000_000_000n);
  });
});

describe("TokenAmountV2 with 0 decimals", () => {
  const token = {
    symbol: "CENT",
    name: "Cents",
    decimals: 0,
  };

  it("can be initialized from a whole number string", () => {
    expect(TokenAmountV2.fromString({ token, amount: "123" })).toEqual(
      TokenAmountV2.fromUlps({
        token,
        amount: 123n,
      }),
    );
  });

  it("can not be initialized from a fractional number string", () => {
    expect(
      TokenAmountV2.fromString({
        token,
        amount: "0.5",
      }),
    ).toEqual(FromStringToTokenError.FractionalTooManyDecimals);
  });

  it("can not be initialized from a mixed string", () => {
    expect(
      TokenAmountV2.fromString({
        token,
        amount: "1.5",
      }),
    ).toEqual(FromStringToTokenError.FractionalTooManyDecimals);
  });
});

describe("TokenAmountV2 with 8 decimals", () => {
  const token = {
    symbol: "ICP",
    name: "ICP",
    decimals: 8,
  };

  it("can be initialized from a number", () => {
    expect(TokenAmountV2.fromNumber({ token, amount: 1 })).toEqual(
      TokenAmountV2.fromUlps({
        token,
        amount: 100000000n,
      }),
    );
    expect(TokenAmountV2.fromNumber({ token, amount: 1234 })).toEqual(
      TokenAmountV2.fromUlps({
        token,
        amount: 123400000000n,
      }),
    );
    expect(TokenAmountV2.fromNumber({ token, amount: 0.00000002 })).toEqual(
      TokenAmountV2.fromUlps({
        token,
        amount: 2n,
      }),
    );
    expect(TokenAmountV2.fromNumber({ token, amount: 0.00000001 })).toEqual(
      TokenAmountV2.fromUlps({
        token,
        amount: 1n,
      }),
    );
  });

  it("truncates small numbers to 8 decimals", () => {
    expect(TokenAmountV2.fromNumber({ token, amount: 1e-9 })).toEqual(
      TokenAmountV2.fromUlps({ token, amount: 0n }),
    );
  });

  it("returns the value in e8s", () => {
    expect(
      (
        TokenAmountV2.fromString({ amount: "2", token }) as TokenAmountV2
      ).toE8s(),
    ).toEqual(200_000_000n);

    expect(
      (
        TokenAmountV2.fromString({ amount: "0.21", token }) as TokenAmountV2
      ).toE8s(),
    ).toEqual(21_000_000n);

    expect(
      (
        TokenAmountV2.fromString({ amount: "0.00021", token }) as TokenAmountV2
      ).toE8s(),
    ).toEqual(21_000n);

    expect(
      (
        TokenAmountV2.fromString({ amount: "2000", token }) as TokenAmountV2
      ).toE8s(),
    ).toEqual(200_000_000_000n);
  });
});
