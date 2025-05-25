import { vi, describe, it, expect } from "vitest";
import {
  getDiscount,
  getPriceInCurrency,
  getShippingInfo,
  isOnline,
  login,
  renderPage,
  signUp,
  submitOrder,
} from "../mocking";
import { getExchangeRate } from "../libs/currency";
import { getShippingQuote } from "../libs/shipping";
import { trackPageView } from "../libs/analytics";
import { charge } from "../libs/payment";
import { isValidEmail, sendEmail } from "../libs/email";
import security from "../libs/security";

describe("test suite", () => {
  it("should test suite", () => {
    const mockFn = vi.fn();
    mockFn.mockReturnValue("hello world");
    const result = mockFn();
    expect(result).toMatch(/hello/i);
  });
});

describe("mock suit", () => {
  it("should mock function sendText", () => {
    let sendText = vi.fn();
    sendText.mockImplementation((message) => message);
    const result = sendText("Hey Daniel");
    expect(sendText).toHaveBeenCalled();

    expect(sendText).toBeCalledWith("Hey Daniel");
  });
});

/* 
    # 3 ways
    1. mockReturnValue
    2. mockResolvedValue: promise
    3. mockImplementation: add implementation/logic
*/

vi.mock("../libs/currency.js");

describe("getPriceInCurrency", () => {
  it("should return an exchange rate of a currency", () => {
    vi.mocked(getExchangeRate).mockReturnValue(18.2);
    const price = getPriceInCurrency(100, "Rand");
    expect(price).toBe(100 * 18.2);
  });
});

vi.mock("../libs/shipping.js");

describe("getShippingInfo", () => {
  it("should  return unavailable if quote is not provided", () => {
    vi.mocked(getShippingQuote).mockReturnValue(null);
    const result = getShippingInfo("SA");
    expect(result).toMatch(/unavailable/i);
  });

  it("should return shipping information to a destination", () => {
    vi.mocked(getShippingQuote).mockReturnValue({
      cost: 100,
      estimatedDays: 5,
    });

    const result = getShippingInfo("SA");
    expect(result).toMatch(/shipping cost/i);
  });
});

/* interaction testing */
vi.mock("../libs/analytics.js");
describe("renderPage", () => {
  it("should return content if correct", async () => {
    // vi.mocked(trackPageView).mockReturnValue("/home");
    // const result = renderPage();
    // /\<\div\>\content\<\\div\>/;
    // expect(result).toMatchSnapshot(/\<\div\>\content\<\\div\>/i);
    const result = await renderPage();
    expect(result).toMatch(/content/i);
  });
  it("should call track-view", async () => {
    // vi.mocked(trackPageView).mockReturnValue("/home");
    // const result = renderPage();
    // /\<\div\>\content\<\\div\>/;
    // expect(result).toMatchSnapshot(/\<\div\>\content\<\\div\>/i);
    const result = await renderPage();
    expect(trackPageView).toHaveBeenCalledWith("/home");
  });
});

vi.mock("../libs/payment.js");

describe("submitOrder", () => {
  it("should return true for properties amount and credit card", async () => {
    vi.mocked(charge).mockImplementation((creditCardInfo, amount) => {
      return { creditCardInfo, amount };
    });
    const result = await charge("12344", 100);
    expect(result).toHaveProperty("creditCardInfo");
    expect(result).toHaveProperty("amount");
    // expect(result).toMatch(/success/i);
  });

  it("should return status failed for unsuccessful payment", async () => {
    vi.mocked(charge).mockReturnValue({
      status: "failed",
    });
    // const result = charge("12344", 100);
    const order = await submitOrder("1234", 100);
    expect(order).toMatchObject({
      success: false,
      error: "payment_error",
    });
  });

  it("should return status of true for success if order is successful", async () => {
    vi.mocked(charge).mockReturnValue({
      status: "success",
    });
    const result = await submitOrder("12344", 100);
    expect(result).toMatchObject({
      success: true,
    });
  });
});

/* partial mocking: */
vi.mock("../libs/email.js", async (original) => {
  const result = await original();
  return {
    ...result,
    sendEmail: vi.fn(),
  };
});

describe("signUp", () => {
  it("should return false for invalid email", async () => {
    const result = await signUp("dd.com");
    expect(result).toBeFalsy();
  });
  it("should send email if email is valid", async () => {
    const result = await signUp("dkmawasha@gmail.com", "Welcome aboard!");
    expect(result).toBeTruthy();
  });

  it("should send welcome email if email is valid", async () => {
    const result = await signUp("dkmawasha@gmail.com");
    expect(sendEmail).toHaveBeenCalled();

    const args = vi.mocked(sendEmail).mock.calls[0];
    expect(args[0]).toBe("dkmawasha@gmail.com");
    expect(args[1]).toBe("Welcome aboard!");
  });
});

// spy
vi.mock("../libs/security.js");
// describe("login", () => {
//   //   it("should send one-time pin email to user for login", async () => {
//   //     const spy = vi.spyOn(security, "generateCode");
//   //     // spy.mock();
//   //     await login("dkmawasha@gmail.com");
//   //     const code = spy.mock.results[0].value.toString();
//   //     console.log("====================================");
//   //     console.log("args: ", code);
//   //     console.log("====================================");
//   //     expect(sendEmail).toHaveBeenCalledWith("dkmawasha@gmail.com", code);
//   //   });
// });

/* testing dates */
describe("isOnline", () => {
  it("should return false for current time outside of open hours", () => {
    vi.setSystemTime("2025-06-09 07:20");
    const result = isOnline();
    expect(result).toBeFalsy();
  });
  it("should return false for current time outside of closed hours", () => {
    vi.setSystemTime("2025-06-09 21:20");
    const result = isOnline();
    expect(result).toBeFalsy();
  });
});

describe("getDiscount", () => {
  it("should return false if current month is not november and day is not 25", () => {
    vi.setSystemTime("2025-11-24");
    const result = getDiscount();
    expect(result).toBe(0);
  });
  it("should return true if current month is november and day is 25", () => {
    vi.setSystemTime("2025-12-25");
    const result = getDiscount();
    expect(result).toBe(0.2);
  });
});
