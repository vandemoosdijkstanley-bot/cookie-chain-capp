import { describe, it, expect } from 'bun:test';
import { PublicKey } from '@solana/web3.js';
import { COOKIE_CHAIN_CONFIG, COOKIE_CHAIN_PROGRAMS, POPULAR_COOKIE_TOKENS } from '../src/config/cookie-chain';
import { CookieChainClient } from '../src/services/cookie-chain-client';
import { CookieMindshareService } from '../src/services/cookie-mindshare-service';

describe('CookiePulse cApp — Formal Verification & Invariants Test Suite', () => {
  describe('1. Network & Protocol Constants Invariants', () => {
    it('should configure official Cookie Chain SVM RPC endpoint', () => {
      expect(COOKIE_CHAIN_CONFIG.rpcUrl).toBe('https://rpc.cookiescan.io');
      expect(COOKIE_CHAIN_CONFIG.currencySymbol).toBe('COOK');
      expect(COOKIE_CHAIN_CONFIG.decimals).toBe(9);
    });

    it('should validate all core SVM program public keys', () => {
      expect(() => new PublicKey(COOKIE_CHAIN_PROGRAMS.SYSTEM_PROGRAM)).not.toThrow();
      expect(() => new PublicKey(COOKIE_CHAIN_PROGRAMS.TOKEN_PROGRAM)).not.toThrow();
      expect(() => new PublicKey(COOKIE_CHAIN_PROGRAMS.TOKEN_2022_PROGRAM)).not.toThrow();
      expect(() => new PublicKey(COOKIE_CHAIN_PROGRAMS.MEMO_PROGRAM)).not.toThrow();
    });

    it('should maintain consistent popular token metadata', () => {
      expect(POPULAR_COOKIE_TOKENS.length).toBeGreaterThanOrEqual(4);
      for (const token of POPULAR_COOKIE_TOKENS) {
        expect(token.symbol.length).toBeGreaterThan(0);
        expect(token.decimals).toBeGreaterThanOrEqual(6);
        expect(token.mindshareScore).toBeGreaterThan(0);
        expect(token.mindshareScore).toBeLessThanOrEqual(100);
      }
    });
  });

  describe('2. Client & Transaction Wire Invariants', () => {
    const client = new CookieChainClient('https://rpc.cookiescan.io');
    const mockSender = new PublicKey('Cook1e11111111111111111111111111111111111111');
    const mockRecipient = new PublicKey('11111111111111111111111111111111');

    it('should initialize Connection instance with confirmed commitment', () => {
      const conn = client.getConnection();
      expect(conn).toBeDefined();
      expect(conn.commitment).toBe('confirmed');
    });

    it('should correctly format and structure transfer transactions', async () => {
      // Mock getLatestBlockhash for deterministic offline test verification
      const origBlockhash = client.getConnection().getLatestBlockhash;
      client.getConnection().getLatestBlockhash = async () => ({
        blockhash: 'EkSnNWEM2jmpuiiyuytu22u798218128912192181921',
        lastValidBlockHeight: 26543000,
      });

      const tx = await client.buildTransferTx(mockSender, mockRecipient, 0.5);
      expect(tx.instructions.length).toBe(1);
      expect(tx.feePayer?.toBase58()).toBe(mockSender.toBase58());
      expect(tx.recentBlockhash).toBe('EkSnNWEM2jmpuiiyuytu22u798218128912192181921');

      client.getConnection().getLatestBlockhash = origBlockhash;
    });

    it('should correctly construct SPL memo transaction payload', async () => {
      const origBlockhash = client.getConnection().getLatestBlockhash;
      client.getConnection().getLatestBlockhash = async () => ({
        blockhash: 'EkSnNWEM2jmpuiiyuytu22u798218128912192181921',
        lastValidBlockHeight: 26543000,
      });

      const memoMsg = 'CookiePulse Automated Verification';
      const tx = await client.buildMemoTx(mockSender, memoMsg);
      expect(tx.instructions.length).toBe(1);
      expect(tx.instructions[0].programId.toBase58()).toBe(COOKIE_CHAIN_PROGRAMS.MEMO_PROGRAM);
      expect(tx.instructions[0].data.toString('utf-8')).toBe(memoMsg);

      client.getConnection().getLatestBlockhash = origBlockhash;
    });
  });

  describe('3. Cookie AI Mindshare & Staking Yield Invariants', () => {
    it('should provide indexed ecosystem overview metrics', () => {
      const overview = CookieMindshareService.getEcosystemOverview();
      expect(overview.totalMindshareIndexed).toBe(100.0);
      expect(overview.activeAiAgents).toBeGreaterThan(0);
      expect(overview.avgBlockTimeSeconds).toBeLessThan(1.5);
    });

    it('should calculate monotonic staking yield progression', () => {
      const yield1M = CookieMindshareService.calculateStakingYield(1000, 1);
      const yield6M = CookieMindshareService.calculateStakingYield(1000, 6);
      const yield12M = CookieMindshareService.calculateStakingYield(1000, 12);

      expect(yield1M.effectiveApy).toBeGreaterThan(0);
      expect(yield6M.effectiveApy).toBeGreaterThan(yield1M.effectiveApy);
      expect(yield12M.effectiveApy).toBeGreaterThan(yield6M.effectiveApy);

      expect(yield12M.projectedYieldCook).toBeGreaterThan(yield6M.projectedYieldCook);
      expect(yield12M.sCookMinted).toBe(920); // 1000 * 0.92
    });
  });
});
