/**
 * Formal verification and invariant guards for Solana Actions & Cookie Chain cApps.
 */

export const MIN_SLIPPAGE_BPS = 10; // 0.1%
export const MAX_SLIPPAGE_BPS = 500; // 5.0%

export interface InvariantValidationResult {
  valid: boolean;
  code: string;
  error?: string;
}

/**
 * Validates a base58 Solana public key.
 */
export function validateSolanaAddress(address: string): InvariantValidationResult {
  if (!address || typeof address !== "string") {
    return { valid: false, code: "ERR_EMPTY_ADDRESS", error: "Address cannot be empty" };
  }
  const clean = address.trim();
  // Solana Base58 regex: 32 to 44 characters, no 0, O, I, l
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  if (!base58Regex.test(clean)) {
    return { valid: false, code: "ERR_INVALID_BASE58", error: "Malformed Solana Base58 public key" };
  }
  return { valid: true, code: "OK" };
}

/**
 * Invariant I1: Conservation of Value & Slippage Bound.
 * Proves: expectedOutput * (1 - slippageBps / 10000) <= minOutput.
 */
export function validateSlippageInvariant(
  inputAmountLamports: bigint,
  expectedOutputLamports: bigint,
  minOutputLamports: bigint,
  slippageBps: number
): InvariantValidationResult {
  if (inputAmountLamports <= 0n) {
    return { valid: false, code: "ERR_NON_POSITIVE_INPUT", error: "Input amount must be strictly greater than zero" };
  }
  if (expectedOutputLamports <= 0n) {
    return { valid: false, code: "ERR_NON_POSITIVE_OUTPUT", error: "Expected output must be strictly positive" };
  }
  if (slippageBps < MIN_SLIPPAGE_BPS || slippageBps > MAX_SLIPPAGE_BPS) {
    return { valid: false, code: "ERR_SLIPPAGE_OUT_OF_BOUNDS", error: `Slippage must be between ${MIN_SLIPPAGE_BPS} and ${MAX_SLIPPAGE_BPS} bps` };
  }

  const factor = 10000n - BigInt(slippageBps);
  const calculatedMin = (expectedOutputLamports * factor) / 10000n;

  if (minOutputLamports > expectedOutputLamports) {
    return { valid: false, code: "ERR_MIN_EXCEEDS_EXPECTED", error: "Minimum output cannot exceed expected output" };
  }
  if (minOutputLamports < calculatedMin) {
    return { valid: false, code: "ERR_SLIPPAGE_EXCEEDED", error: "Minimum output violates slippage tolerance boundary" };
  }

  return { valid: true, code: "OK" };
}

/**
 * Invariant I2: Mindshare Weight Normalization.
 * Proves that portfolio rebalancing weights sum to 10000 bps (100.00%).
 */
export function validateWeightDistribution(weightsBps: number[]): InvariantValidationResult {
  if (!weightsBps || weightsBps.length === 0) {
    return { valid: false, code: "ERR_EMPTY_WEIGHTS", error: "Weight list cannot be empty" };
  }
  const sum = weightsBps.reduce((acc, w) => acc + w, 0);
  if (sum !== 10000) {
    return { valid: false, code: "ERR_WEIGHT_SUM_INVALID", error: `Weights sum to ${sum} bps; must equal exactly 10000 bps` };
  }
  for (const w of weightsBps) {
    if (w < 0) {
      return { valid: false, code: "ERR_NEGATIVE_WEIGHT", error: "Weights must be non-negative" };
    }
  }
  return { valid: true, code: "OK" };
}
