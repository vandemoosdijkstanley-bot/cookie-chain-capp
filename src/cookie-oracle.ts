/**
 * Cookie.fun AI Mindshare Index & Rebalancing Calculator.
 */

export interface AgentMindshare {
  agentName: string;
  tokenMint: string;
  mindshareScore: number;
  weightBps: number;
}

export interface RebalancePlan {
  totalInputLamports: bigint;
  agents: AgentMindshare[];
  timestamp: number;
}

export class CookieMindshareOracle {
  /**
   * Generates deterministic normalized mindshare weights from raw agent mindshare scores.
   */
  public calculateMindshareWeights(rawScores: Record<string, number>): Record<string, number> {
    const keys = Object.keys(rawScores);
    const totalScore = keys.reduce((acc, k) => acc + Math.max(0, rawScores[k]), 0);

    if (totalScore === 0) {
      const equalShare = Math.floor(10000 / keys.length);
      const result: Record<string, number> = {};
      let allocated = 0;
      keys.forEach((k, idx) => {
        if (idx === keys.length - 1) {
          result[k] = 10000 - allocated;
        } else {
          result[k] = equalShare;
          allocated += equalShare;
        }
      });
      return result;
    }

    const weights: Record<string, number> = {};
    let totalAllocated = 0;
    keys.forEach((k, idx) => {
      if (idx === keys.length - 1) {
        weights[k] = 10000 - totalAllocated;
      } else {
        const share = Math.floor((rawScores[k] / totalScore) * 10000);
        weights[k] = share;
        totalAllocated += share;
      }
    });

    return weights;
  }

  /**
   * Prepares rebalance allocation plan for incoming deposit.
   */
  public createRebalancePlan(depositLamports: bigint, scores: Record<string, number>): RebalancePlan {
    const weights = this.calculateMindshareWeights(scores);
    const agents: AgentMindshare[] = Object.entries(weights).map(([name, weightBps]) => ({
      agentName: name,
      tokenMint: `Mint_${name.replace(/\s+/g, "_")}_Solana`,
      mindshareScore: scores[name] || 0,
      weightBps,
    }));

    return {
      totalInputLamports: depositLamports,
      agents,
      timestamp: Date.now(),
    };
  }
}
