import React from 'react';
import { Cpu, Zap, Radio, Globe, Clock, Layers } from 'lucide-react';
import { NetworkHealth } from '../services/cookie-chain-client';

interface TelemetryProps {
  health: NetworkHealth;
}

export const NetworkTelemetryCard: React.FC<TelemetryProps> = ({ health }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Slot & Heartbeat */}
      <div className="bg-slate-900/60 backdrop-blur border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden group hover:border-amber-500/40 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Cookie SVM Tip Slot
          </span>
          <div className="h-8 w-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Layers className="h-4 w-4" />
          </div>
        </div>
        <div className="text-2xl font-black font-mono text-slate-100 group-hover:text-amber-300 transition-colors">
          {health.slot > 0 ? health.slot.toLocaleString() : '---'}
        </div>
        <div className="mt-2 flex items-center text-xs text-emerald-400 font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse" />
          Sub-second finality active
        </div>
      </div>

      {/* Latency */}
      <div className="bg-slate-900/60 backdrop-blur border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden group hover:border-amber-500/40 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            RPC Response Time
          </span>
          <div className="h-8 w-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
            <Zap className="h-4 w-4" />
          </div>
        </div>
        <div className="text-2xl font-black font-mono text-slate-100 group-hover:text-orange-300 transition-colors">
          {health.latencyMs} <span className="text-sm font-normal text-slate-400">ms</span>
        </div>
        <div className="mt-2 text-xs text-slate-400 font-mono flex items-center">
          <Radio className="h-3 w-3 mr-1 text-slate-500" />
          Direct rpc.cookiescan.io socket
        </div>
      </div>

      {/* Solana-Core Version */}
      <div className="bg-slate-900/60 backdrop-blur border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden group hover:border-amber-500/40 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            SVM Engine Version
          </span>
          <div className="h-8 w-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Cpu className="h-4 w-4" />
          </div>
        </div>
        <div className="text-2xl font-black font-mono text-slate-100 group-hover:text-amber-300 transition-colors">
          v{health.solanaCoreVersion}
        </div>
        <div className="mt-2 text-xs text-slate-400 font-mono flex items-center">
          <Globe className="h-3 w-3 mr-1 text-slate-500" />
          Feature-Set: {health.featureSet || '3345198602'}
        </div>
      </div>

      {/* Block Time */}
      <div className="bg-slate-900/60 backdrop-blur border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden group hover:border-amber-500/40 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Block Time Velocity
          </span>
          <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="text-2xl font-black font-mono text-emerald-400">
          ~0.92 <span className="text-sm font-normal text-slate-400">sec</span>
        </div>
        <div className="mt-2 text-xs text-slate-400 font-mono">
          Community Multi-Validator
        </div>
      </div>
    </div>
  );
};
