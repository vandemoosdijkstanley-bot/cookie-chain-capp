import React from 'react';
import { TrendingUp, Users, Droplets, Sparkles, BarChart3 } from 'lucide-react';
import { CookieMindshareService } from '../services/cookie-mindshare-service';

export const MindshareTerminal: React.FC = () => {
  const metrics = CookieMindshareService.getMindshareMetrics();
  const overview = CookieMindshareService.getEcosystemOverview();

  return (
    <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 lg:p-8 mb-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <span>Cookie AI Mindshare Leaderboard</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time sentiment, social traction, and liquidity index across Cookie Chain agents
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
          <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <BarChart3 className="h-3.5 w-3.5 text-amber-400" />
            <span>Agents Tracked:</span>
            <span className="text-slate-200 font-bold">{overview.activeAiAgents}</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span>24h Txs:</span>
            <span className="text-emerald-400 font-bold">{overview.dailyOnChainTxs.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-slate-800/80 text-slate-400 uppercase tracking-wider">
              <th className="pb-3 font-medium">Asset / AI Agent</th>
              <th className="pb-3 font-medium text-right">Mindshare</th>
              <th className="pb-3 font-medium text-right">24h Delta</th>
              <th className="pb-3 font-medium text-right">Sentiment</th>
              <th className="pb-3 font-medium text-right">Liquidity (USD)</th>
              <th className="pb-3 font-medium text-right">Holders</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {metrics.map((m, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3.5 font-sans">
                  <div className="font-bold text-slate-100 text-sm">{m.agentOrToken}</div>
                  <div className="text-xs font-mono text-amber-400 font-semibold">{m.ticker}</div>
                </td>
                <td className="py-3.5 text-right font-bold text-slate-200">
                  {m.mindsharePercentage.toFixed(1)}%
                </td>
                <td className="py-3.5 text-right">
                  <span
                    className={`inline-flex items-center space-x-0.5 px-2 py-0.5 rounded text-[11px] font-bold ${
                      m.mindshareDelta24h >= 0
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    <TrendingUp className="h-3 w-3 inline mr-0.5" />
                    {m.mindshareDelta24h >= 0 ? `+${m.mindshareDelta24h}%` : `${m.mindshareDelta24h}%`}
                  </span>
                </td>
                <td className="py-3.5 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full"
                        style={{ width: `${m.sentimentScore}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-200">{m.sentimentScore}/100</span>
                  </div>
                </td>
                <td className="py-3.5 text-right text-slate-300">
                  <span className="flex items-center justify-end space-x-1">
                    <Droplets className="h-3 w-3 text-sky-400" />
                    <span>${m.liquidityUsd.toLocaleString()}</span>
                  </span>
                </td>
                <td className="py-3.5 text-right text-slate-400">
                  <span className="flex items-center justify-end space-x-1">
                    <Users className="h-3 w-3 text-slate-500" />
                    <span>{m.onChainHolders.toLocaleString()}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
