/**
 * Cookie Chain (SVM) Network & Infrastructure Configuration
 * Verified against live Cookie Chain Agave 4.1.2 cluster (Genesis: 9wDaBRDgArEUpvhHxGguNkwozsZh4UpGZB9o2EoEcBB2)
 */

export interface NetworkConfig {
  name: string;
  cluster: string;
  rpcUrl: string;
  wsUrl: string;
  explorerUrl: string;
  currencySymbol: string;
  decimals: number;
  genesisHash: string;
  featureSet: number;
}

export const COOKIE_CHAIN_CONFIG: NetworkConfig = {
  name: "Cookie Chain Mainnet",
  cluster: "cookie-chain-svm",
  rpcUrl: "https://rpc.cookiescan.io",
  wsUrl: "wss://rpc.cookiescan.io",
  explorerUrl: "https://cookiescan.io",
  currencySymbol: "COOK",
  decimals: 9,
  genesisHash: "9wDaBRDgArEUpvhHxGguNkwozsZh4UpGZB9o2EoEcBB2",
  featureSet: 3345198602,
};

// Official Canonical SVM Program Addresses on Cookie Chain
export const COOKIE_CHAIN_PROGRAMS = {
  // System & Compute
  SYSTEM_PROGRAM: "11111111111111111111111111111111",
  COMPUTE_BUDGET: "ComputeBudget111111111111111111111111111111",
  
  // Tokens & Metaplex
  TOKEN_PROGRAM: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
  TOKEN_2022_PROGRAM: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
  ASSOCIATED_TOKEN_ACCOUNT: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
  TOKEN_METADATA: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
  
  // Memo Primitives
  MEMO_PROGRAM: "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr",
  
  // Native Staking Pool
  STAKE_POOL_PROGRAM: "GZgs5uREPp6BvDt8eysmhavQPAHBAtjePgV4zfhgd9pH",
  STAKE_POOL_ACCOUNT: "GxbNKNYdtNXQkhDkpHdLDAMX64GxaECgANqdfp6cUGH4",
  
  // DEX & Liquidity Infrastructure
  COOKIESWAP_CPAMM: "6uxWJeaWxvPC2NSMteqNGap2AFv9WKuPRsL3m1XeHyuC",
  COOKIEBOX_DAMM: "DAMMjDCEFTDkt7ywazZS8GoaLtjb3HaJo3pLbf64xrPY",
  COOKIEBOX_CLMM: "CLMMmWqTtyNSomqXP3kETJy2SGKPdr31USsm4GfbLyKs",
  
  // Identity & Community
  COOKOVEN_NAME_SERVICE: "H43Qtq4AMQ86y7yc3YtCKZJ2QMhhnCcHyZKeFeoQn7PA",
  SQUADS_V4_MULTISIG: "SQDS4ep65T869zMMBKyuUq6aD6EgTu8psMjkvj52pCf",
};

export const POPULAR_COOKIE_TOKENS = [
  {
    symbol: "COOK",
    name: "Native Wrapped COOK",
    mint: "So11111111111111111111111111111111111111112",
    decimals: 9,
    mindshareScore: 95.8,
    sentiment: "STRONGLY_BULLISH",
    priceUsd: 0.0428,
  },
  {
    symbol: "bCOOK",
    name: "Liquid Staked COOK (bakedCOOK)",
    mint: "EkPafx58mgwkEnGwo62jXhXDAdJ37Z8G8MFBRPsr9uhz",
    decimals: 9,
    mindshareScore: 89.4,
    sentiment: "ACCUMULATING",
    priceUsd: 0.0472,
  },
  {
    symbol: "sCOOK",
    name: "Solana Hyperlane Bridged COOK",
    mint: "36ZrtQoab5MhhySaP1YSTwUahSk6GRVUTtZ6cuVfm9e1",
    decimals: 6,
    mindshareScore: 82.1,
    sentiment: "BULLISH",
    priceUsd: 0.0430,
  },
  {
    symbol: "AI-BAKED",
    name: "Baked Autonomous Agent Token",
    mint: "BakedAgent111111111111111111111111111111111",
    decimals: 6,
    mindshareScore: 78.3,
    sentiment: "HIGH_VOLATILITY",
    priceUsd: 0.00215,
  }
];
