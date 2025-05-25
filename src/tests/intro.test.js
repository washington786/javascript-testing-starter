import { describe, it, expect } from "vitest";
import { fizzBuzz, max } from "../intro";

describe("max", () => {
  it("should return first argument if it is greater than second argument", () => {
    expect(max(4, 2)).toBe(4);
  });
  it("should return second argument if it is greater than second argument", () => {
    expect(max(5, 8)).toBe(8);
  });
});

describe("fizzbuzz", () => {
  it("should return FizzBuzz if argument is divisible by both 3 and 5", () => {
    expect(fizzBuzz(15)).toBe("FizzBuzz");
  });

  it("should return Fizz if argument is divisible by 3", () => {
    expect(fizzBuzz(9)).toBe("Fizz");
  });

  it("should return Buzz if argument is divisible by 5", () => {
    expect(fizzBuzz(10)).toBe("Buzz");
  });

  it("should return string if not divisible by 3 or 5", () => {
    expect(fizzBuzz(7)).toBe("7");
  });
});
