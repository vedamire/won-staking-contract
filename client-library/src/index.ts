// import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';
export { AllAccounts, CollectionInfoView, LiquidityPoolView, DepositView, LoanView } from './accounts';
import { PublicKey, Connection, Transaction, Keypair, TransactionInstruction, SystemProgram } from '@solana/web3.js';
import * as utils from './utils';
import { PREFIX } from './constants';
import { TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
export { returnAnchorProgram } from './utils';
import { WonStaking, IDL } from './idl/types/won_staking';
import { fs } from 'mz';

const encoder = new TextEncoder();

export const initializeWonConfig = async ({
  programId,
  unstakingUnblocksAt,
  adminPubkey,
  creator,
  provider,
  sendTxn,
}: {
  unstakingUnblocksAt: number;
  adminPubkey: PublicKey;
  creator: PublicKey;
  provider: anchor.Provider;
  programId: PublicKey;
  sendTxn: (txn: Transaction, signers: Keypair[]) => Promise<void>;
}) => {
  const program = await utils.returnAnchorProgram(programId, provider);
  const [won_staking_authority, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode(PREFIX)],
    program.programId,
  );
  const wonConfigKey = anchor.web3.Keypair.generate();

  const signers = [wonConfigKey];

  const tx = program.instruction.initializeWonConfig(bump, new anchor.BN(unstakingUnblocksAt), {
    accounts: {
      wonConfig: wonConfigKey.publicKey,
      admin: adminPubkey,
      wonStakingAuthority: won_staking_authority,
      creator: creator,
      systemProgram: SystemProgram.programId,
      // clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
    },
    signers: signers,
  });

  const txn = new Transaction().add(tx);

  await sendTxn(txn, signers);
};

export const stakeWonNft = async ({
  wonConfig,
  userPubkey,
  nftMint,
  programId,
  provider,
  sendTxn,
}: {
  wonConfig: PublicKey;
  userPubkey: PublicKey;
  nftMint: PublicKey;

  provider: anchor.Provider;
  programId: PublicKey;
  sendTxn: (txn: Transaction, signers: Keypair[]) => Promise<void>;
}) => {
  const program = await utils.returnAnchorProgram(programId, provider);
  const [won_staking_authority, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode(PREFIX)],
    program.programId,
  );

  const userNftTokenAccount = await utils.findAssociatedTokenAddress(userPubkey, nftMint);

  const wonStakingAccountKey = anchor.web3.Keypair.generate();
  const vaultNftTokenAccountKey = anchor.web3.Keypair.generate();

  const signers = [wonStakingAccountKey, vaultNftTokenAccountKey];
  const tx = program.instruction.stakeWonNft(bump, {
    accounts: {
      wonStakingAccount: wonStakingAccountKey.publicKey,
      wonConfig: wonConfig,
      user: userPubkey,
      wonStakingAuthority: won_staking_authority,
      nftMint: nftMint,
      nftUserTokenAccount: userNftTokenAccount,
      vaultNftTokenAccount: vaultNftTokenAccountKey.publicKey,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      // clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
    },
    signers: signers,
  });

  const txn = new Transaction().add(tx);

  await sendTxn(txn, signers);
};

export const unstakeWonNft = async ({
  wonConfig,
  userPubkey,
  nftMint,
  vaultNftTokenAccount,
  wonStakingAccount,
  programId,
  provider,
  sendTxn,
}: {
  wonConfig: PublicKey;
  userPubkey: PublicKey;
  nftMint: PublicKey;
  vaultNftTokenAccount: PublicKey;
  wonStakingAccount: PublicKey;

  provider: anchor.Provider;
  programId: PublicKey;
  sendTxn: (txn: Transaction, signers: Keypair[]) => Promise<void>;
}) => {
  const program = await utils.returnAnchorProgram(programId, provider);
  const [won_staking_authority, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode(PREFIX)],
    program.programId,
  );

  const userNftTokenAccount = await utils.findAssociatedTokenAddress(userPubkey, nftMint);

  const signers = [];
  const tx = program.instruction.unstakeWonNft(bump, {
    accounts: {
      wonStakingAccount: wonStakingAccount,
      wonConfig: wonConfig,
      user: userPubkey,
      wonStakingAuthority: won_staking_authority,
      nftMint: nftMint,
      nftUserTokenAccount: userNftTokenAccount,
      vaultNftTokenAccount: vaultNftTokenAccount,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      // clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
    },
    signers: signers,
  });

  const txn = new Transaction().add(tx);

  await sendTxn(txn, signers);
};

export const getAllProgramAccounts = async (
  programId: PublicKey,
  connection: Connection,
): Promise<{ wonConfigs: any[]; wonStakingAccounts: any[] }> => {
  const provider = new anchor.Provider(connection, utils.createFakeWallet(), anchor.Provider.defaultOptions());
  let program = await utils.returnAnchorProgram(programId, provider);

  const wonConfigs = await program.account.wonConfig.all();
  const wonStakingAccounts = await program.account.wonStakingAccount.all();

  return {
    wonConfigs,
    wonStakingAccounts,
  };
};

export * from './idl/types/won_staking';

export const createKeypairFromFile = async (filePath: string): Promise<Keypair> => {
  const secretKeyString = await fs.readFile(filePath, { encoding: 'utf8' });
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  return Keypair.fromSecretKey(secretKey);
};
