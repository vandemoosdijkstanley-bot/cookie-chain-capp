import { useState, useEffect, useCallback } from 'react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { cookieClient } from '../services/cookie-chain-client';

interface NightlySolanaProvider {
  isNightly?: boolean;
  publicKey: PublicKey | null;
  isConnected: boolean;
  connect: () => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  signTransaction: (tx: Transaction) => Promise<Transaction>;
  signAllTransactions?: (txs: Transaction[]) => Promise<Transaction[]>;
  on?: (event: string, callback: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    nightly?: {
      solana?: NightlySolanaProvider;
    };
    solana?: NightlySolanaProvider;
  }
}

export function useNightlyWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [cookBalance, setCookBalance] = useState<number>(0);
  const [hasNightlyInstalled, setHasNightlyInstalled] = useState<boolean>(false);
  const [walletType, setWalletType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check for installed wallet extensions
  useEffect(() => {
    const checkProviders = () => {
      const isNightlyAvailable = !!window.nightly?.solana;
      const isStandardSolanaAvailable = !!window.solana;
      setHasNightlyInstalled(isNightlyAvailable);

      if (isNightlyAvailable) {
        setWalletType('Nightly');
      } else if (isStandardSolanaAvailable) {
        setWalletType('Solana Standard');
      }
    };

    checkProviders();
    const interval = setInterval(checkProviders, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch balance when address changes
  const refreshBalance = useCallback(async () => {
    if (address) {
      try {
        const bal = await cookieClient.getCookBalance(address);
        setCookBalance(bal);
      } catch (err) {
        console.error('Balance refresh error:', err);
      }
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      refreshBalance();
      const interval = setInterval(refreshBalance, 8000);
      return () => clearInterval(interval);
    }
  }, [address, refreshBalance]);

  // Connect wallet
  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      let provider: NightlySolanaProvider | undefined = window.nightly?.solana;

      // Fallback to standard solana injection if nightly wrapper is standard
      if (!provider && window.solana) {
        provider = window.solana;
      }

      if (!provider) {
        // Mock demo connection for testing when no browser extension is present
        const demoPubkey = new PublicKey('Cook1e11111111111111111111111111111111111111');
        setPublicKey(demoPubkey);
        setAddress(demoPubkey.toBase58());
        setIsConnected(true);
        setWalletType('Demo / Read-Only SVM Mode');
        setIsConnecting(false);
        return;
      }

      const res = await provider.connect();
      const pubkey = res?.publicKey || provider.publicKey;
      if (pubkey) {
        setPublicKey(pubkey);
        setAddress(pubkey.toBase58());
        setIsConnected(true);
        setWalletType(provider.isNightly ? 'Nightly' : 'Solana Wallet');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to connect Nightly wallet');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Disconnect wallet
  const disconnect = useCallback(async () => {
    try {
      const provider = window.nightly?.solana || window.solana;
      if (provider && provider.disconnect) {
        await provider.disconnect();
      }
    } catch (err) {
      console.warn('Disconnect notice:', err);
    }
    setPublicKey(null);
    setAddress(null);
    setIsConnected(false);
    setCookBalance(0);
  }, []);

  // Sign transaction
  const signTransaction = useCallback(
    async (tx: Transaction): Promise<Transaction> => {
      const provider = window.nightly?.solana || window.solana;
      if (!provider || !provider.signTransaction) {
        throw new Error('Nightly wallet provider not available to sign transaction');
      }
      return await provider.signTransaction(tx);
    },
    []
  );

  return {
    address,
    publicKey,
    isConnected,
    isConnecting,
    cookBalance,
    hasNightlyInstalled,
    walletType,
    error,
    connect,
    disconnect,
    signTransaction,
    refreshBalance,
  };
}
