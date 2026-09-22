import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, MessageSquare, ArrowRight, ExternalLink } from 'lucide-react';
import { PublicKey } from '@solana/web3.js';
import { cookieClient } from '../services/cookie-chain-client';
import { COOKIE_CHAIN_CONFIG } from '../config/cookie-chain';

interface TransactionHubProps {
  isConnected: boolean;
  address: string | null;
  publicKey: PublicKey | null;
  signTransaction: (tx: any) => Promise<any>;
  onSuccess: () => void;
}

export const TransactionHub: React.FC<TransactionHubProps> = ({
  isConnected,
  publicKey,
  signTransaction,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'TRANSFER' | 'MEMO'>('MEMO');
  const [recipient, setRecipient] = useState<string>('Cook1e11111111111111111111111111111111111111');
  const [amount, setAmount] = useState<string>('0.05');
  const [memoText, setMemoText] = useState<string>('CookiePulse cApp Autonomous Verification: Verified on Cookie Chain SVM');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [txStatus, setTxStatus] = useState<{
    state: 'IDLE' | 'BUILDING' | 'SIGNING' | 'CONFIRMING' | 'SUCCESS' | 'ERROR';
    signature?: string;
    errorMsg?: string;
  }>({ state: 'IDLE' });

  const handleExecuteTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !publicKey) {
      setTxStatus({
        state: 'ERROR',
        errorMsg: 'Please connect your Nightly wallet first.',
      });
      return;
    }

    setIsProcessing(true);
    setTxStatus({ state: 'BUILDING' });

    try {
      let tx;
      if (activeTab === 'TRANSFER') {
        const toPubkey = new PublicKey(recipient.trim());
        const amountCook = parseFloat(amount);
        if (isNaN(amountCook) || amountCook <= 0) {
          throw new Error('Please enter a valid positive amount of COOK.');
        }
        tx = await cookieClient.buildTransferTx(publicKey, toPubkey, amountCook);
      } else {
        if (!memoText.trim()) {
          throw new Error('Memo content cannot be empty.');
        }
        tx = await cookieClient.buildMemoTx(publicKey, memoText.trim());
      }

      setTxStatus({ state: 'SIGNING' });
      const signedTx = await signTransaction(tx);

      setTxStatus({ state: 'CONFIRMING' });
      const rawWire = signedTx.serialize();
      const signature = await cookieClient.sendAndConfirmRawTx(rawWire);


      setTxStatus({
        state: 'SUCCESS',
        signature,
      });
      onSuccess();
    } catch (err: any) {
      setTxStatus({
        state: 'ERROR',
        errorMsg: err?.message || 'Transaction execution failed on Cookie Chain RPC.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 lg:p-8 mb-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <span>On-Chain Interaction Engine</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              Live SVM
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Execute native transfers or notarize on-chain memos directly via Cookie Chain RPC
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setActiveTab('MEMO');
              setTxStatus({ state: 'IDLE' });
            }}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'MEMO'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>On-Chain Memo</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('TRANSFER');
              setTxStatus({ state: 'IDLE' });
            }}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'TRANSFER'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Send className="h-3.5 w-3.5" />
            <span>COOK Transfer</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleExecuteTransaction} className="space-y-4">
        {activeTab === 'TRANSFER' ? (
          <>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                Recipient SVM Address
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="SVM Base58 Address..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-mono text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                Amount (COOK)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.05"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-mono text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
                  required
                />
                <span className="absolute right-4 top-3 text-xs font-bold text-amber-400 font-mono">
                  COOK
                </span>
              </div>
            </div>
          </>
        ) : (
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
              Notarized Memo Payload (SPL Memo v2)
            </label>
            <textarea
              rows={3}
              value={memoText}
              onChange={(e) => setMemoText(e.target.value)}
              placeholder="Enter message to immutably commit to Cookie Chain..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-mono text-slate-200 focus:outline-none focus:border-amber-500 transition-colors resize-none"
              required
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing || !isConnected}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold py-3.5 px-6 rounded-xl shadow-lg shadow-amber-500/20 transition-all transform active:scale-98 disabled:opacity-50 text-sm font-mono"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
              <span>
                {txStatus.state === 'BUILDING' && 'Building Transaction Wire...'}
                {txStatus.state === 'SIGNING' && 'Requesting Nightly Signature...'}
                {txStatus.state === 'CONFIRMING' && 'Confirming on Cookie Chain...'}
              </span>
            </>
          ) : (
            <>
              <span>
                {!isConnected
                  ? 'Connect Nightly Wallet to Execute'
                  : activeTab === 'TRANSFER'
                  ? 'Broadcast COOK Transfer'
                  : 'Broadcast On-Chain Memo'}
              </span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Real-Time Transaction Feedback */}
      {txStatus.state === 'SUCCESS' && (
        <div className="mt-5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start space-x-3 text-emerald-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs font-mono overflow-hidden">
            <div className="font-bold text-sm text-emerald-200">
              Transaction Confirmed on Cookie Chain!
            </div>
            <p className="text-slate-300 mt-1">
              Finalized in sub-second SVM block. Transaction signature:
            </p>
            <div className="mt-2 flex items-center space-x-2 bg-slate-950/80 p-2.5 rounded-lg border border-emerald-500/20">
              <span className="truncate text-slate-200">{txStatus.signature}</span>
              <a
                href={`${COOKIE_CHAIN_CONFIG.explorerUrl}/tx/${txStatus.signature}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-amber-400 hover:underline flex-shrink-0"
              >
                <span>View</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {txStatus.state === 'ERROR' && (
        <div className="mt-5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-3 text-rose-300">
          <AlertCircle className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs font-mono">
            <div className="font-bold text-sm text-rose-200">Execution Error</div>
            <p className="mt-1">{txStatus.errorMsg}</p>
          </div>
        </div>
      )}
    </div>
  );
};
