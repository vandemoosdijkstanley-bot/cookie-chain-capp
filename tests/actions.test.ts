import { describe, expect, it } from "bun:test";
import {
  validateSolanaAddress,
  validateSlippageInvariant,
  validateWeightDistribution,
} from "../src/invariants.ts";
import { CookieMindshareOracle } from "../src/cookie-oracle.ts";
import { CookieActionsHandler } from "../src/actions.ts";
import { Transaction } from "@solana/web3.js";


describe("Cookie Chain Solana cApp & Blink Test Suite", () => {
  const validSolanaAddress = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU";
  const invalidSolanaAddress = "0xInvalidEthereumAddressNotSolana123456789";

  describe("1. Mathematical & Address Invariants", () => {
    it("should validate real Solana Base58 public keys", () => {
      const res = validateSolanaAddress(validSolanaAddress);
      expect(res.valid).toBe(true);
      expect(res.code).toBe("OK");
    });

    it("should reject invalid addresses", () => {
      const res = validateSolanaAddress(invalidSolanaAddress);
      expect(res.valid).toBe(false);
      expect(res.code).toBe("ERR_INVALID_BASE58");
    });

    it("should enforce Conservation of Value and slippage boundary", () => {
      const input = 1000000000n; // 1 SOL
      const expected = 1000000000n;
      const minOutput = 990000000n; // 1% slippage
      const res = validateSlippageInvariant(input, expected, minOutput, 100); // 100 bps = 1%
      expect(res.valid).toBe(true);
    });

    it("should reject excessive slippage breach", () => {
      const input = 1000000000n;
      const expected = 1000000000n;
      const minOutput = 900000000n; // 10% drop
      const res = validateSlippageInvariant(input, expected, minOutput, 100); // Allowed 1% only
      expect(res.valid).toBe(false);
      expect(res.code).toBe("ERR_SLIPPAGE_EXCEEDED");
    });

    it("should enforce 100.00% (10000 bps) weight normalization", () => {
      const validWeights = [4000, 3500, 2500];
      expect(validateWeightDistribution(validWeights).valid).toBe(true);

      const invalidWeights = [4000, 3500, 2000]; // sum = 9500
      expect(validateWeightDistribution(invalidWeights).valid).toBe(false);
    });
  });

  describe("2. Cookie Mindshare Oracle", () => {
    it("should normalize arbitrary raw mindshare scores to exact 10,000 bps", () => {
      const oracle = new CookieMindshareOracle();
      const rawScores = {
        "Agent-Alpha": 320,
        "Agent-Beta": 180,
        "Agent-Gamma": 500,
      };

      const weights = oracle.calculateMindshareWeights(rawScores);
      const totalBps = Object.values(weights).reduce((a, b) => a + b, 0);
      expect(totalBps).toBe(10000);
      expect(weights["Agent-Gamma"]).toBeGreaterThan(weights["Agent-Alpha"]);
    });

    it("should create execution plan matching deposit amount", () => {
      const oracle = new CookieMindshareOracle();
      const deposit = 500000000n; // 0.5 SOL
      const plan = oracle.createRebalancePlan(deposit, { "A": 100, "B": 200 });

      expect(plan.totalInputLamports).toBe(deposit);
      expect(plan.agents.length).toBe(2);
      const sumBps = plan.agents.reduce((acc, a) => acc + a.weightBps, 0);
      expect(sumBps).toBe(10000);
    });
  });

  describe("3. Solana Actions & Blink Specification", () => {
    it("should return valid ActionGetResponse conforming to Dialect Blink spec", () => {
      const handler = new CookieActionsHandler();
      const meta = handler.getMetadata();

      expect(meta.title).toContain("Cookie Chain");
      expect(meta.icon).toContain("http");
      expect(meta.links?.actions.length).toBeGreaterThanOrEqual(3);
    });

    it("should successfully build ActionPostResponse for valid account", () => {
      const handler = new CookieActionsHandler();
      const postRes = handler.handlePostRequest(validSolanaAddress, 0.5);

      expect(postRes.transaction).toBeDefined();
      expect(postRes.transaction.length).toBeGreaterThan(20);
      expect(postRes.message).toContain("0.5 COOK");

      // Verify deserializability as a valid Solana Transaction wire
      const tx = Transaction.from(Buffer.from(postRes.transaction, "base64"));
      expect(tx.feePayer?.toBase58()).toBe(validSolanaAddress);
      expect(tx.instructions.length).toBe(1);
    });

    it("should throw for invalid account in POST request", () => {
      const handler = new CookieActionsHandler();
      expect(() => handler.handlePostRequest(invalidSolanaAddress, 0.5)).toThrow("Invalid account");
    });
  });
});

