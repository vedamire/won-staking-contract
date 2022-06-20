import * as anchor from "@project-serum/anchor";
const { SystemProgram } = anchor.web3;
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  Token,
} from "@solana/spl-token";
import * as index from "../../client-library/src/index";
import { PublicKey, Transaction, Keypair } from "@solana/web3.js";

import fs from "mz/fs";
import * as utils from "../../client-library/src/utils";
import { Program } from "@project-serum/anchor";
import { WonStaking } from "../target/types/won_staking";
// import { CommunityPoolsAnchor, IDL } from './utils/community_pools_anchor';
const { TextEncoder, TextDecoder } = require("util");
const encoder = new TextEncoder();

// let adminStr = "[35,167,28,212,157,40,7,232,157,15,244,104,104,129,246,80,90,28,159,32,58,206,218,200,196,170,241,149,64,101,127,90,95,82,101,81,131,101,12,178,236,179,116,177,75,187,129,44,192,106,126,138,11,226,83,147,28,244,244,204,252,54,36,167]"
export async function createKeypairFromFile(
  filePath: string
): Promise<Keypair> {
  const secretKeyString = await fs.readFile(filePath, { encoding: "utf8" });
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  return Keypair.fromSecretKey(secretKey);
}

describe("community-pools-anchor", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const provider = anchor.Provider.env();
  const programCom = anchor.workspace.WonStaking as Program<WonStaking>;

  const userAccount = anchor.web3.Keypair.generate();
  const userAccount2 = anchor.web3.Keypair.generate();
  const PREFIX = "wonstaking";

  // const ADMIN_KEYPAIR = anchor.web3.Keypair.fromSecretKey(
  //   Uint8Array.from([254,167,61,208,32,113,50,136,71,56,192,104,150,155,90,235,242,219,105,160,143,22,204,137,99,183,76,160,1,86,220,41,216,235,135,132,111,220,134,156,106,214,31,207,183,138,209,204,226,136,190,58,224,11,18,49,238,16,17,4,10,28,197,248]))
  const WHITELISTED_PRICEMINT = new anchor.web3.PublicKey(
    "So11111111111111111111111111111111111111112"
  );
  const WHITELISTED_MINT = new anchor.web3.PublicKey(
    "So11111111111111111111111111111111111111112"
  );

  const CREATOR = new anchor.web3.PublicKey(
    "So11111111111111111111111111111111111111112"
  );

  it("Is initialized!", async () => {
    // const secretKey = Uint8Array.from(JSON.parse(adminStr));
    // admin = anchor.web3.Keypair.fromSecretKey(secretKey);
    // admin = await createKeypairFromFile("/home/roger/allKeys/communitypools/production_admin.json");
    console.log("here its ok");
    const admin = await createKeypairFromFile(
      "/home/roger/allKeys/won_staking/won_staking_admin.json"
    );

    // console.log(adminMul.publicKey.toBase58())
    const wonConfigKey = anchor.web3.Keypair.generate();

    const [won_staking_authority, bump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [encoder.encode(PREFIX)],
        programCom.programId
      );

    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        userAccount.publicKey,
        100000000
      ),
      "processed"
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        userAccount2.publicKey,
        100000000
      ),
      "processed"
    );

    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(admin.publicKey, 100000000),
      "processed"
    );

    const unstaking_unblocks_at = 1655545113;
    await programCom.rpc.initializeWonConfig(
      bump,
      new anchor.BN(unstaking_unblocks_at),
      {
        accounts: {
          wonConfig: wonConfigKey.publicKey,
          admin: admin.publicKey,
          wonStakingAuthority: won_staking_authority,
          creator: CREATOR,
          systemProgram: SystemProgram.programId,
          // clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        },
        signers: [admin, wonConfigKey],
      }
    );

    const nftMint = await Token.createMint(
      provider.connection,
      userAccount,
      userAccount.publicKey,
      null,
      0,
      TOKEN_PROGRAM_ID
    );

    const userNftTokenAccount = await nftMint.createAssociatedTokenAccount(
      userAccount.publicKey
    );

    await nftMint.mintTo(
      userNftTokenAccount,
      userAccount.publicKey,
      [userAccount],
      1
    );

    const vaultNftTokenAccount = anchor.web3.Keypair.generate();
    const wonStakingAccount = anchor.web3.Keypair.generate();

    await programCom.rpc.stakeWonNft(bump, {
      accounts: {
        wonStakingAccount: wonStakingAccount.publicKey,
        wonConfig: wonConfigKey.publicKey,
        user: userAccount.publicKey,
        wonStakingAuthority: won_staking_authority,
        nftMint: nftMint.publicKey,
        nftUserTokenAccount: userNftTokenAccount,
        vaultNftTokenAccount: vaultNftTokenAccount.publicKey,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        // clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
      },
      signers: [userAccount, wonStakingAccount, vaultNftTokenAccount],
    });

    await programCom.rpc.unstakeWonNft(bump, {
      accounts: {
        wonStakingAccount: wonStakingAccount.publicKey,
        wonConfig: wonConfigKey.publicKey,
        user: userAccount.publicKey,
        wonStakingAuthority: won_staking_authority,
        nftMint: nftMint.publicKey,
        nftUserTokenAccount: userNftTokenAccount,
        vaultNftTokenAccount: vaultNftTokenAccount.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        // clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
      },
      signers: [userAccount],
    });

    // await programCom.rpc.w(bump, unstaking_unblocks_at, {
    //   accounts: {
    //     wonConfig: wonConfigKey.publicKey,
    //     admin: admin,
    //     wonStakingAuthority: won_staking_authority,
    //     creator: CREATOR,
    //     systemProgram: SystemProgram.programId,
    //     // clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
    //   },
    //   signers: [userAccount, wonConfigKey],
    // });

    // nftMint2 = await Token.createMint(
    //   provider.connection,
    //   userAccount,
    //   userAccount.publicKey,
    //   null,
    //   0,
    //   TOKEN_PROGRAM_ID
    // );
  });
});
async function getAssociatedTokenAccount(
  userPubkey: anchor.web3.PublicKey,
  mint: anchor.web3.PublicKey
) {
  const res = (
    await anchor.web3.PublicKey.findProgramAddress(
      [userPubkey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      TOKEN_PROGRAM_ID
    )
  )[0];
  return res;
  // return (
  //   await findProgramAddress(
  //     [toPublicKey(userPubkey).toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), toPublicKey(mint).toBuffer()],
  //     ASSOCIATED_TOKEN_PROGRAM_ID,
  //   )
  // )[0];
}

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

export async function findAssociatedTokenAddress(
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey
): Promise<PublicKey> {
  return (
    await PublicKey.findProgramAddress(
      [
        walletAddress.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintAddress.toBuffer(),
      ],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
  )[0];
}
