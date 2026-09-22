import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { COOKIE_CHAIN_CONFIG, COOKIE_CHAIN_PROGRAMS } from '../config/cookie-chain';

export interface NetworkHealth {
  slot: number;
  blockHeight: number;
  solanaCoreVersion: string;
  featureSet: number;
  latencyMs: number;
  isHealthy: boolean;
}

export class CookieChainClient {
  private connection: Connection;

  constructor(rpcUrl: string = COOKIE_CHAIN_CONFIG.rpcUrl) {
    this.connection = new Connection(rpcUrl, {
      commitment: 'confirmed',
      disableRetryOnRateLimit: false,
    });
  }

  public getConnection(): Connection {
    return this.connection;
  }

  /**
   * Fetches real-time slot, block, and node health from Cookie Chain RPC
   */
  public async getNetworkHealth(): Promise<NetworkHealth> {
    const t0 = performance.now();
    try {
      const [slot, version, blockHeight] = await Promise.all([
        this.connection.getSlot('confirmed'),
        this.connection.getVersion(),
        this.connection.getBlockHeight('confirmed').catch(() => 0),
      ]);
      const latencyMs = Math.round(performance.now() - t0);

      return {
        slot,
        blockHeight,
        solanaCoreVersion: version['solana-core'] || '4.1.2',
        featureSet: version['feature-set'] || 0,
        latencyMs,
        isHealthy: true,
      };
    } catch (err) {
      const latencyMs = Math.round(performance.now() - t0);
      return {
        slot: 0,
        blockHeight: 0,
        solanaCoreVersion: 'Offline/Unreachable',
        featureSet: 0,
        latencyMs,
        isHealthy: false,
      };
    }
  }

  /**
   * Retrieves native COOK balance for a public key
   */
  public async getCookBalance(address: string): Promise<number> {
    try {
      const pubkey = new PublicKey(address);
      const lamports = await this.connection.getBalance(pubkey, 'confirmed');
      return lamports / LAMPORTS_PER_SOL;
    } catch (err) {
      console.error('Failed to get COOK balance:', err);
      return 0;
    }
  }

  /**
   * Builds a native COOK transfer transaction
   */
  public async buildTransferTx(
    fromPubkey: PublicKey,
    toPubkey: PublicKey,
    amountCook: number
  ): Promise<Transaction> {
    const lamports = BigInt(Math.floor(amountCook * LAMPORTS_PER_SOL));
    const tx = new Transaction();

    tx.add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports,
      })
    );

    const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash('confirmed');
    tx.recentBlockhash = blockhash;
    tx.lastValidBlockHeight = lastValidBlockHeight;
    tx.feePayer = fromPubkey;

    return tx;
  }

  /**
   * Builds an on-chain Memo transaction on Cookie Chain
   */
  public async buildMemoTx(
    fromPubkey: PublicKey,
    memoContent: string
  ): Promise<Transaction> {
    const tx = new Transaction();
    const memoProgramId = new PublicKey(COOKIE_CHAIN_PROGRAMS.MEMO_PROGRAM);

    tx.add(
      new TransactionInstruction({
        keys: [{ pubkey: fromPubkey, isSigner: true, isWritable: true }],
        programId: memoProgramId,
        data: Buffer.from(memoContent, 'utf-8'),
      })
    );

    const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash('confirmed');
    tx.recentBlockhash = blockhash;
    tx.lastValidBlockHeight = lastValidBlockHeight;
    tx.feePayer = fromPubkey;

    return tx;
  }

  /**
   * Broadcasts raw signed transaction wire to Cookie Chain RPC
   */
  public async sendAndConfirmRawTx(rawTx: Uint8Array): Promise<string> {
    const signature = await this.connection.sendRawTransaction(rawTx, {
      skipPreflight: false,
      preflightCommitment: 'confirmed',
    });

    await this.connection.confirmTransaction(signature, 'confirmed');
    return signature;
  }
}

export const cookieClient = new CookieChainClient();
