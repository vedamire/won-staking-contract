import { createKeypairFromFile, getAllProgramAccounts, initializeWonConfig, stakeWonNft } from './../index';
import { getAllUserTokens } from 'solana-nft-metadata';
// import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

import { PublicKey, Connection, Keypair, Transaction, SystemProgram } from '@solana/web3.js';
// import { readKeypairFromPath } from 'solana-nft-metadata';
import { NodeWallet, programs } from '@metaplex/js';
import { BN, Idl, Program, Provider, Wallet } from '@project-serum/anchor';
// import { getMetadataByMintAddress } from "solana-nft-metadata";
import * as anchor from '@project-serum/anchor';

import fs from 'mz/fs';
import { getTokenBalance, returnAnchorProgram } from '../utils';
import { lstat } from 'fs';

const {
  metadata: { Metadata },
} = programs;

const DEVNET_ENDPOINT = 'https://api.devnet.solana.com';
// const MAINNET_ENDPOINT = 'https://solana-api.projectserum.com';
// 'https://fraktion.rpcpool.com/';
const MAINNET_ENDPOINT =
  'https://thrumming-rough-moon.solana-mainnet.quiknode.pro/78d2f0e33956a4c1e40c5eaf90d0fa49a5882298/';
// const WSOL_MINT = new PublicKey('So11111111111111111111111111111111111111112');

const devnet_connection = new Connection(DEVNET_ENDPOINT, 'confirmed');
const mainnetConnection = new Connection(MAINNET_ENDPOINT, 'finalized');

const MAINNET_PROGRAM = new PublicKey('A66HabVL3DzNzeJgcHYtRRNW1ZRMKwBfrdSR4kLsZ9DJ');
// @ts-ignore
jest.setTimeout(1000000000);

// @ts-ignore
test('Examples', async () => {
  void (await exampleGetAllProgramAccounts());
  // void (await exampleInitWonConfig());
}); // old pool YtGpLunzsgHmCZsndwfHSTKRUBt2HvcJ6jUNpuhQj2Q , old mint: AewTfhgsuiWyBkwYEyi4qjqX3k5eTtzGPAZnXyexvxq3
// meta NFT wEoZA7ffKh1txgJgsP2DmRjyMxUuRjhnAVssxT5uc7J

const exampleInitWonConfig = async () => {
  const admin = await createKeypairFromFile('/home/roger/allKeys/won_staking/ won_staking_admin.json');

  const programId = new PublicKey('AwctH8wbf4D5sJwbYkmsPHSihmj3Kqt4TzwvZAo2sXkB');
  const provider = new Provider(devnet_connection, new NodeWallet(admin), Provider.defaultOptions());

  const creator = new PublicKey('6UxcvZck7aZvAe6NmE1E3MTJTrBrQGceJS4QxsfHDm6D');
  const unstaking_unblocks_at = 1655552778;

  void (await initializeWonConfig({
    programId: programId,
    unstakingUnblocksAt: unstaking_unblocks_at,
    adminPubkey: admin.publicKey,
    creator: creator,
    provider,
    sendTxn: async (txn, signers) => void devnet_connection.sendTransaction(txn, [admin, ...signers]),
  }));
};

const exampleGetAllProgramAccounts = async () => {
  const programId = new PublicKey('AwctH8wbf4D5sJwbYkmsPHSihmj3Kqt4TzwvZAo2sXkB');

  const allAccounts = await getAllProgramAccounts(programId, devnet_connection);
  console.log(allAccounts.wonConfigs[0].publicKey.toBase58());
};

const exampleGetAllUserTokens = async () => {
  const programId = new PublicKey('AwctH8wbf4D5sJwbYkmsPHSihmj3Kqt4TzwvZAo2sXkB');

  const allAccounts = await getAllUserTokens(new PublicKey('AwctH8wbf4D5sJwbYkmsPHSihmj3Kqt4TzwvZAo2sXkB'), {
    connection: devnet_connection,
  });
};

const exampleStakeWonNft = async () => {
  const admin = await createKeypairFromFile('/home/roger/allKeys/won_staking/ won_staking_admin.json');

  const programId = new PublicKey('AwctH8wbf4D5sJwbYkmsPHSihmj3Kqt4TzwvZAo2sXkB');
  const provider = new Provider(devnet_connection, new NodeWallet(admin), Provider.defaultOptions());

  const creator = new PublicKey('6UxcvZck7aZvAe6NmE1E3MTJTrBrQGceJS4QxsfHDm6D');
  const unstaking_unblocks_at = 1655552778;
  const nftMint = new PublicKey('6UxcvZck7aZvAe6NmE1E3MTJTrBrQGceJS4QxsfHDm6D');

  void (await stakeWonNft({
    wonConfig: new PublicKey('FiH7tJzMyoMLP81FirTogBMrjmB9oRGe2DFamK3DpL2S'),
    userPubkey: admin.publicKey,
    nftMint: nftMint,
    programId,
    provider,
    sendTxn: async (txn, signers) => {
      const { signature } = await window.solana.signAndSendTransaction(txn);
      await devnet_connection.confirmTransaction(signature);
    },
  }));
};
