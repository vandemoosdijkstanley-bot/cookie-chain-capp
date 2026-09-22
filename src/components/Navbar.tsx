import React from 'react';
import { Wallet, ShieldCheck, Activity, ExternalLink } from 'lucide-react';
import { COOKIE_CHAIN_CONFIG } from '../config/cookie-chain';

interface NavbarProps {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  cookBalance: number;
  walletType: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  currentSlot: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  isConnected,
  isConnecting,
  address,
  cookBalance,
  walletType,
  onConnect,
  onDisconnect,
  currentSlot,
}) => {
  const truncatedAddress = address
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : null;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 text-2xl font-bold border border-amber-300/30">
            🍪
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-orange-300 to-amber-400 bg-clip-text text-transparent">
                CookiePulse
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                cApp SVM
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Cookie Chain Sub-Second Terminal
            </p>
          </div>
        </div>

        {/* Live Chain Status Badge */}
        <div className="hidden md:flex items-center space-x-4 bg-slate-900/60 border border-slate-800 rounded-full px-4 py-1.5 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300">{COOKIE_CHAIN_CONFIG.name}</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center space-x-1 text-slate-400">
            <Activity className="h-3.5 w-3.5 text-amber-400" />
            <span>Slot:</span>
            <span className="text-amber-300 font-bold">
              {currentSlot > 0 ? currentSlot.toLocaleString() : 'Connecting...'}
            </span>
          </div>
        </div>

        {/* Wallet Connection Actions */}
        <div className="flex items-center space-x-3">
          {isConnected && (
            <div className="hidden sm:flex flex-col items-end mr-2">
              <div className="text-xs text-slate-400 font-mono">Balance</div>
              <div className="text-sm font-bold text-amber-400 font-mono">
                {cookBalance.toFixed(3)} COOK
              </div>
            </div>
          )}

          {isConnected ? (
            <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-700/80 rounded-xl p-1.5 pl-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-mono font-semibold text-slate-200">
                  {truncatedAddress}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                  {walletType || 'Nightly'}
                </span>
              </div>
              <button
                onClick={onDisconnect}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors font-medium ml-2"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={onConnect}
              disabled={isConnecting}
              className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all transform active:scale-95 disabled:opacity-50 text-sm"
            >
              <Wallet className="h-4 w-4 text-slate-950" />
              <span>{isConnecting ? 'Connecting...' : 'Connect Nightly'}</span>
            </button>
          )}

          <a
            href={COOKIE_CHAIN_CONFIG.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
            title="Open CookieScan Explorer"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
};
