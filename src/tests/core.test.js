import { describe, it, expect, beforeEach } from "vitest";
import {
  calculateDiscount,
  canDrive,
  fetchData,
  getCoupons,
  isValidUsername,
  Stack,
  validateUserInput,
} from "../core";

describe("get coupons", () => {
  // should have a property of code.
  it("should have property of code", () => {
    expect(getCoupons()[0]).toHaveProperty("code");
  });

  // should have a property of discount.
  it("should have a property discount", () => {
    expect(getCoupons()[0]).toHaveProperty("discount");
  });

  // type of code to be string

  it("should return type of string for code", () => {
    expect(getCoupons()[0].code).toBeTypeOf("string");
  });

  // type of discount to be a number
  it("should return type of number for discount", () => {
    expect(getCoupons()[0].discount).toBeTypeOf("number");
  });

  // first code should match SAVE20NOW
  it("should match object of 0.2 discount", () => {
    expect(getCoupons()[0]).toMatchObject({ code: "SAVE20NOW", discount: 0.2 });
  });

  // second code should match DISCOUNT50OFF
  it("should match object of 0.5 discount", () => {
    expect(getCoupons()[1]).toMatchObject({
      code: "DISCOUNT50OFF",
      discount: 0.5,
    });
  });
});

describe("calculateDiscount", () => {
  // should return invalid price if argument of price is not a number

  it("should return invalid price if argument of price is not a number ", () => {
    expect(calculateDiscount("122", "TEST")).toMatch("Invalid price");
  });

  // should return invalid discount code if discount code is not a string
  it("should return invalid discount code if discount code is not a string", () => {
    expect(calculateDiscount(1000, 5442)).toMatch("Invalid discount code");
  });

  // should return discount if both arguments are valid
  it("should return discount of type number if both arguments are valid", () => {
    expect(calculateDiscount(1000, "SAVE10")).toBeTypeOf("number");
  });
});

describe("validateUserInput", () => {
  // username is string
  it("should return invalid username if type is not string", () => {
    expect(validateUserInput(124, 23)).toMatch(/invalid/i);
  });

  // username is less than 3 characters
  it("should return invalid username if username is less than 3 characters", () => {
    expect(validateUserInput("12", 25)).toMatch(/invalid/i);
  });

  // age is number
  it("should return invalid age if age is not a number", () => {
    expect(validateUserInput("test", "35")).toMatch(/invalid/i);
  });

  // age is less than 28
  it("should return invalid age if age is less than 18", () => {
    expect(validateUserInput("test", 15)).toMatch(/invalid/i);
  });

  // should return validation successful if both arguments are valid
  it("should return validation successful if both arguments are valid", () => {
    expect(validateUserInput("test", 22)).toMatch(/successful/i);
  });
});

describe("isValidUsername", () => {
  // should be within range of 5 and 15
  it("should return true for username greater than 4 and less than 16", () => {
    expect(isValidUsername("daniel mawasha")).toBeTruthy();
    expect(isValidUsername("daniel")).toBeTruthy();
  });
});

describe("canDrive", () => {
  // country code check
  // it("should return invalid if country code is not in US or UK", () => {
  //   expect(canDrive(20, "SA")).toMatch(/invalid/i);
  // });
  // it("should return invalid if country code is a number", () => {
  //   expect(canDrive(20, 145)).toMatch(/invalid/i);
  // });
  // // US should be 16
  // it("should return false if age is less than minimal required age of US", () => {
  //   expect(canDrive(15, "US")).toBeFalsy();
  // });
  // // UK should be 17
  // it("should should false if age is less than minimal required age of UK", () => {
  //   expect(canDrive(16, "UK")).toBeFalsy();
  // });

  /* parametrized testing using inputs*/
  it.each([
    {
      age: 15,
      countryCode: "US",
      result: false,
    },
    {
      age: 16,
      countryCode: "US",
      result: true,
    },
    {
      age: 17,
      countryCode: "US",
      result: true,
    },
    {
      age: 16,
      countryCode: "UK",
      result: false,
    },
    {
      age: 17,
      countryCode: "UK",
      result: true,
    },
    {
      age: 18,
      countryCode: "UK",
      result: true,
    },
  ])(
    "shout be $result for age $age and country code $countryCode",
    ({ age, countryCode, result }) => {
      expect(canDrive(age, countryCode)).toBe(result);
    }
  );
});

// testing asynchronous code
describe("fetchData", () => {
  it("should return a promise that will resolve into an array of numbers", () => {
    // let result = fetchData();
    // expect(Array.isArray(result)).toBeTruthy();
    // expect(result.length).toBeGreaterThan(0);
    fetchData().then((result) => {
      expect(Array.isArray(result)).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
      expect(result).toEqual([1, 2, 3]);
    });
  });
});

describe("Stack", () => {
  var stack;

  beforeEach(() => {
    stack = new Stack();
  });

  it("should initialize with empty array", () => {
    expect(stack).toBeInstanceOf(Stack);
    expect(Array.isArray(stack.items)).toBe(true);
    expect(stack.items.length).toBe(0);
  });

  it("should push an item into the stack", () => {
    stack.push(1);
    expect(stack.items).toEqual([1]);
  });

  it("should pop an item in the stack", () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);
    expect(stack.pop()).toBe(3);
  });

  it("should return stack is empty error for pop if stack is empty", () => {
    let result = () => {
      stack.pop();
    };
    expect(result).toThrowError(/empty/i);
  });

  it("should peek an item in the stack", () => {
    stack.push(2);
    stack.push(6);
    stack.push(5);
    expect(stack.peek()).toBe(5);
  });

  it("should return stack is empty for peek", () => {
    let result = () => stack.peek();
    expect(result).toThrowError(/empty/i);
  });

  it("should return an empty stack", () => {
    expect(stack.isEmpty()).toBeTruthy();
  });

  it("should return the length of the stack", () => {
    stack.push(1);
    stack.push(7);
    expect(stack.size()).toBe(stack.items.length);
  });

  it("should clear the stack items", () => {
    stack.clear();
    expect(stack.items).toEqual([]);
  });
});
