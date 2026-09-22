/**
 * Cookie Chain (SVM) Network & Infrastructure Configuration
 * Official RPC & Program Constants
 */

export interface NetworkConfig {
  name: string;
  cluster: string;
  rpcUrl: string;
  wsUrl?: string;
  explorerUrl: string;
  currencySymbol: string;
  decimals: number;
}

export const COOKIE_CHAIN_CONFIG: NetworkConfig = {
  name: "Cookie Chain Mainnet",
  cluster: "cookie-chain-svm",
  rpcUrl: "https://rpc.cookiescan.io",
  wsUrl: "wss://rpc.cookiescan.io",
  explorerUrl: "https://cookiescan.io",
  currencySymbol: "COOK",
  decimals: 9,
};

// Core SVM Program Addresses on Cookie Chain
export const COOKIE_CHAIN_PROGRAMS = {
  // Native Solana/SVM System Program
  SYSTEM_PROGRAM: "11111111111111111111111111111111",
  // Standard SPL Token Program
  TOKEN_PROGRAM: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
  // Token-2022 Extensions Program
  TOKEN_2022_PROGRAM: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
  // SPL Memo Program for On-Chain Notarization & Telemetry
  MEMO_PROGRAM: "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr",
  // Hyperlane Warp Route COOK Bridge (Reserves Custodied by Community Multisig)
  HYPERLANE_WARP_ROUTE: "cook1Hyper1aneWarpRouteCustodian11111111111",
};

export const POPULAR_COOKIE_TOKENS = [
  {
    symbol: "COOK",
    name: "Cookie Chain Native Asset",
    mint: "11111111111111111111111111111111",
    decimals: 9,
    mindshareScore: 94.2,
    sentiment: "STRONGLY_BULLISH",
    priceUsd: 0.0428,
  },
  {
    symbol: "cCOOK",
    name: "Canonical Cookie Wrapped",
    mint: "cCook111111111111111111111111111111111111111",
    decimals: 9,
    mindshareScore: 88.5,
    sentiment: "BULLISH",
    priceUsd: 0.0431,
  },
  {
    symbol: "sCOOK",
    name: "Staked Cookie Vault Shares",
    mint: "sCook111111111111111111111111111111111111111",
    decimals: 9,
    mindshareScore: 81.3,
    sentiment: "ACCUMULATING",
    priceUsd: 0.0465,
  },
  {
    symbol: "AI-BAKED",
    name: "Baked Autonomous Agent Token",
    mint: "BakedAgent111111111111111111111111111111111",
    decimals: 6,
    mindshareScore: 76.9,
    sentiment: "HIGH_VOLATILITY",
    priceUsd: 0.00195,
  }
];
