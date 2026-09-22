/**
 * Cookie AI Mindshare & Ecosystem Analytics Engine
 * Tracks sentiment, AI Agent Mindshare, and on-chain liquidity metrics
 */

export interface MindshareMetric {
  agentOrToken: string;
  ticker: string;
  mindsharePercentage: number;
  mindshareDelta24h: number;
  sentimentScore: number; // 0 - 100
  tweetsVolume24h: number;
  onChainHolders: number;
  liquidityUsd: number;
  category: 'AI_AGENT' | 'DEFI' | 'MEME' | 'INFRASTRUCTURE';
}

export interface EcosystemOverview {
  totalMindshareIndexed: number;
  activeAiAgents: number;
  dailyOnChainTxs: number;
  avgBlockTimeSeconds: number;
  estimatedTps: number;
}

export const MOCK_MINDSHARE_DATA: MindshareMetric[] = [
  {
    agentOrToken: 'Cookie AI Core Engine',
    ticker: 'COOK',
    mindsharePercentage: 38.4,
    mindshareDelta24h: +4.2,
    sentimentScore: 92,
    tweetsVolume24h: 18450,
    onChainHolders: 14200,
    liquidityUsd: 2850000,
    category: 'INFRASTRUCTURE',
  },
  {
    agentOrToken: 'Baking Autonomous Arbitrageur',
    ticker: 'BAKED',
    mindsharePercentage: 21.8,
    mindshareDelta24h: +7.5,
    sentimentScore: 88,
    tweetsVolume24h: 9320,
    onChainHolders: 6420,
    liquidityUsd: 1120000,
    category: 'AI_AGENT',
  },
  {
    agentOrToken: 'Cookiebox Yield Vault',
    ticker: 'sCOOK',
    mindsharePercentage: 15.6,
    mindshareDelta24h: +1.8,
    sentimentScore: 85,
    tweetsVolume24h: 4210,
    onChainHolders: 8900,
    liquidityUsd: 1940000,
    category: 'DEFI',
  },
  {
    agentOrToken: 'Fortune Cookie Sentinels',
    ticker: 'FORTUNE',
    mindsharePercentage: 12.3,
    mindshareDelta24h: -0.9,
    sentimentScore: 78,
    tweetsVolume24h: 3100,
    onChainHolders: 3950,
    liquidityUsd: 680000,
    category: 'MEME',
  },
  {
    agentOrToken: 'Sub-Second SVM Hyperlane Warp',
    ticker: 'WARP-COOK',
    mindsharePercentage: 11.9,
    mindshareDelta24h: +2.1,
    sentimentScore: 90,
    tweetsVolume24h: 2890,
    onChainHolders: 5120,
    liquidityUsd: 1450000,
    category: 'INFRASTRUCTURE',
  },
];

export class CookieMindshareService {
  public static getEcosystemOverview(): EcosystemOverview {
    return {
      totalMindshareIndexed: 100.0,
      activeAiAgents: 42,
      dailyOnChainTxs: 128450,
      avgBlockTimeSeconds: 0.95, // ~1s sub-second finality
      estimatedTps: 34.2,
    };
  }

  public static getMindshareMetrics(): MindshareMetric[] {
    return MOCK_MINDSHARE_DATA;
  }

  public static calculateStakingYield(amountCook: number, durationMonths: number): {
    sCookMinted: number;
    projectedYieldCook: number;
    effectiveApy: number;
  } {
    const baseApy = 18.5; // 18.5% Base APY on Cookie Chain
    const durationMultiplier = 1 + (durationMonths / 12) * 0.25; // Up to 25% boost for 12 months
    const effectiveApy = baseApy * durationMultiplier;
    const projectedYieldCook = amountCook * (effectiveApy / 100) * (durationMonths / 12);
    const sCookMinted = amountCook * 0.92; // Exchange rate 1 COOK = 0.92 sCOOK (appreciating vault)

    return {
      sCookMinted: Number(sCookMinted.toFixed(4)),
      projectedYieldCook: Number(projectedYieldCook.toFixed(4)),
      effectiveApy: Number(effectiveApy.toFixed(2)),
    };
  }
}
