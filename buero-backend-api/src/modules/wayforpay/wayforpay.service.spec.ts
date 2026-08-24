import { ConfigService } from "@nestjs/config";
import { createHmac } from "crypto";
import { WayForPayService } from "./wayforpay.service";

const ENV: Record<string, string> = {
  WAYFORPAY_MERCHANT_ACCOUNT: "test_merch",
  WAYFORPAY_MERCHANT_SECRET: "test_secret",
  WAYFORPAY_MERCHANT_DOMAIN: "example.com",
  WAYFORPAY_CURRENCY: "EUR",
  WAYFORPAY_SERVICE_URL: "http://localhost:3000/api/webhooks/wayforpay",
};

const sign = (line: string): string =>
  createHmac("md5", ENV.WAYFORPAY_MERCHANT_SECRET)
    .update(line, "utf8")
    .digest("hex");

describe("WayForPayService", () => {
  let service: WayForPayService;

  beforeEach(() => {
    const config = {
      get: (key: string): string | undefined => ENV[key],
    } as unknown as ConfigService;
    service = new WayForPayService(config);
  });

  describe("formatAmount", () => {
    it.each([
      [69, "69"],
      [69.5, "69.5"],
      [1547.36, "1547.36"],
      [1547.364, "1547.36"],
    ])("formats %p as %p", (input, expected) => {
      expect(service.formatAmount(input)).toBe(expected);
    });
  });

  describe("buildPurchaseSignature", () => {
    it("uses the documented field order", () => {
      const signature = service.buildPurchaseSignature({
        merchantAccount: "test_merch",
        merchantDomainName: "example.com",
        orderReference: "bd-1",
        orderDate: 1700000000,
        amount: "69",
        currency: "EUR",
        productNames: ["German A1"],
        productCounts: [1],
        productPrices: ["69"],
      });

      expect(signature).toBe("c569488f5c44cfcfb00960ddd949fa9a");
    });

    it("groups names, then counts, then prices for multiple products", () => {
      const signature = service.buildPurchaseSignature({
        merchantAccount: "test_merch",
        merchantDomainName: "example.com",
        orderReference: "bd-2",
        orderDate: 1700000000,
        amount: "100",
        currency: "EUR",
        productNames: ["A", "B"],
        productCounts: [1, 2],
        productPrices: ["40", "30"],
      });

      expect(signature).toBe(
        sign("test_merch;example.com;bd-2;1700000000;100;EUR;A;B;1;2;40;30"),
      );
    });
  });

  describe("verifyServiceUrlSignature", () => {
    const payload = {
      merchantAccount: "test_merch",
      orderReference: "bd-1",
      amount: 69,
      currency: "EUR",
      authCode: "54321",
      cardPan: "44**44",
      transactionStatus: "Approved",
      reasonCode: 1100,
    };
    const validSignature = sign(
      "test_merch;bd-1;69;EUR;54321;44**44;Approved;1100",
    );

    it("accepts a correctly signed callback", () => {
      expect(
        service.verifyServiceUrlSignature({
          ...payload,
          merchantSignature: validSignature,
        }),
      ).toBe(true);
    });

    it("rejects a tampered amount", () => {
      expect(
        service.verifyServiceUrlSignature({
          ...payload,
          amount: 1,
          merchantSignature: validSignature,
        }),
      ).toBe(false);
    });

    it("rejects a missing signature", () => {
      expect(service.verifyServiceUrlSignature(payload)).toBe(false);
    });
  });

  describe("buildAcceptResponse", () => {
    it("signs orderReference, status and time", () => {
      jest.spyOn(Date, "now").mockReturnValue(1_700_000_000_000);

      expect(service.buildAcceptResponse("bd-1")).toEqual({
        orderReference: "bd-1",
        status: "accept",
        time: 1700000000,
        signature: "1df2f349d4fc8961e0778df79e68a932",
      });

      jest.restoreAllMocks();
    });
  });

  describe("status helpers", () => {
    it("recognises approved and pending statuses", () => {
      expect(service.isApproved("Approved")).toBe(true);
      expect(service.isApproved("Declined")).toBe(false);
      expect(service.isPendingStatus("InProcessing")).toBe(true);
      expect(service.isPendingStatus("Declined")).toBe(false);
    });
  });
});
