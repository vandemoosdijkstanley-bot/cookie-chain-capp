import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { NetworkTelemetryCard } from './components/NetworkTelemetryCard';
import { TransactionHub } from './components/TransactionHub';
import { MindshareTerminal } from './components/MindshareTerminal';
import { StakingCalculator } from './components/StakingCalculator';
import { useNightlyWallet } from './hooks/useNightlyWallet';
import { cookieClient, NetworkHealth } from './services/cookie-chain-client';
import { COOKIE_CHAIN_CONFIG } from './config/cookie-chain';
import { Sparkles, Terminal, Shield, BookOpen, ExternalLink, Github } from 'lucide-react';

export const App: React.FC = () => {
  const wallet = useNightlyWallet();
  const [health, setHealth] = useState<NetworkHealth>({
    slot: 26542213,
    blockHeight: 26541900,
    solanaCoreVersion: '4.1.2',
    featureSet: 3345198602,
    latencyMs: 45,
    isHealthy: true,
  });
  const [activeTab, setActiveTab] = useState<'INTERACT' | 'MINDSHARE' | 'STAKING'>('INTERACT');

  // Poll real-time health from Cookie Chain RPC
  useEffect(() => {
    const updateHealth = async () => {
      try {
        const res = await cookieClient.getNetworkHealth();
        if (res.isHealthy) {
          setHealth(res);
        }
      } catch (err) {
        console.warn('Network health poll notice:', err);
      }
    };

    updateHealth();
    const interval = setInterval(updateHealth, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header / Navbar */}
      <Navbar
        isConnected={wallet.isConnected}
        isConnecting={wallet.isConnecting}
        address={wallet.address}
        cookBalance={wallet.cookBalance}
        walletType={wallet.walletType}
        onConnect={wallet.connect}
        onDisconnect={wallet.disconnect}
        currentSlot={health.slot}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Hero Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent p-6 sm:p-8 rounded-3xl border border-amber-500/20">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Built for Cookie Chain SVM Ecosystem</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-100 font-sans">
              CookiePulse Terminal
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
              Ultra-fast, community-driven SVM cApp combining real-time on-chain telemetry, 
              Nightly wallet transactions, SPL memo notarization, and Cookie AI Mindshare analytics.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <a
              href="https://docs.cookiechain.wtf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-amber-400 hover:border-amber-500/40 transition-all font-mono"
            >
              <BookOpen className="h-4 w-4" />
              <span>Docs</span>
              <ExternalLink className="h-3 w-3 text-slate-500" />
            </a>
            <a
              href="https://cookiescan.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-amber-400 hover:border-amber-500/40 transition-all font-mono"
            >
              <ExternalLink className="h-4 w-4" />
              <span>CookieScan</span>
            </a>
          </div>
        </div>

        {/* Telemetry Metrics Card */}
        <NetworkTelemetryCard health={health} />

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800/80 mb-6 space-x-2">
          <button
            onClick={() => setActiveTab('INTERACT')}
            className={`flex items-center space-x-2 pb-3 px-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'INTERACT'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="h-4 w-4" />
            <span>On-Chain Interaction Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('MINDSHARE')}
            className={`flex items-center space-x-2 pb-3 px-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'MINDSHARE'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>AI Mindshare Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('STAKING')}
            className={`flex items-center space-x-2 pb-3 px-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'STAKING'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="h-4 w-4" />
            <span>Cookiebox Vault</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'INTERACT' && (
          <TransactionHub
            isConnected={wallet.isConnected}
            address={wallet.address}
            publicKey={wallet.publicKey}
            signTransaction={wallet.signTransaction}
            onSuccess={wallet.refreshBalance}
          />
        )}

        {activeTab === 'MINDSHARE' && <MindshareTerminal />}

        {activeTab === 'STAKING' && <StakingCalculator />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 bg-slate-950/80 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            CookiePulse cApp — Powered by Cookie Chain SVM (Chain Cluster: {COOKIE_CHAIN_CONFIG.cluster})
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-emerald-400">RPC: {COOKIE_CHAIN_CONFIG.rpcUrl}</span>
            <a
              href="https://github.com/vandemoosdijkstanley-bot/cookie-chain-capp"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-slate-400 hover:text-amber-400 transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
