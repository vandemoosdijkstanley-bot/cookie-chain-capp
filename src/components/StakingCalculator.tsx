import React, { useState } from 'react';
import { Calculator, Coins, ShieldCheck, Sparkles } from 'lucide-react';
import { CookieMindshareService } from '../services/cookie-mindshare-service';

export const StakingCalculator: React.FC = () => {
  const [stakeAmount, setStakeAmount] = useState<number>(1000);
  const [durationMonths, setDurationMonths] = useState<number>(6);

  const yieldProjection = CookieMindshareService.calculateStakingYield(
    stakeAmount || 0,
    durationMonths
  );

  return (
    <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 lg:p-8 mb-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Coins className="h-5 w-5 text-amber-400" />
            <span>Cookiebox Vault & sCOOK Staking Simulator</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simulate native yield generation and sCOOK receipt minting on Cookie Chain
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Non-Custodial Auto-Compounding</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Deposit Amount (COOK)
              </label>
              <span className="text-xs font-mono font-bold text-amber-400">
                {stakeAmount.toLocaleString()} COOK
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="50000"
              step="100"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(parseFloat(e.target.value))}
              className="w-full accent-amber-500 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Lock Duration
              </label>
              <span className="text-xs font-mono font-bold text-orange-400">
                {durationMonths} Months
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 3, 6, 12].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setDurationMonths(m)}
                  className={`py-2 text-xs font-mono font-bold rounded-xl border transition-all ${
                    durationMonths === m
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {m}M
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projection Display */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
            <span>Projection Parameter</span>
            <span>Value</span>
          </div>

          <div className="space-y-3 py-3 font-mono text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-xs">Effective APY:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                {yieldProjection.effectiveApy}%
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-xs">sCOOK Vault Tokens:</span>
              <span className="text-slate-100 font-bold">
                {yieldProjection.sCookMinted.toLocaleString()} sCOOK
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-xs">Estimated COOK Rewards:</span>
              <span className="text-amber-400 font-bold">
                +{yieldProjection.projectedYieldCook.toLocaleString()} COOK
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calculator className="h-3.5 w-3.5 text-amber-500" />
              <span>Simulated via Cookiebox Curve</span>
            </div>
            <span className="text-[10px] text-slate-500">Sub-second SVM Yield</span>
          </div>
        </div>
      </div>
    </div>
  );
};
