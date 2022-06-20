use anchor_lang::prelude::*;

#[account]
pub struct WonConfig {
    pub creator: Pubkey,
    pub won_staking_authority: Pubkey,
    pub unstaking_unblocks_at: u64,
    pub staked_nfts: u64,
    pub var1: u64,
    pub var2: Pubkey,


}