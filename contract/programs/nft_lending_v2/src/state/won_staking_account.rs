use anchor_lang::prelude::*;

#[repr(C)]
#[derive(Debug, Copy, Clone, AnchorSerialize, AnchorDeserialize, PartialEq)]
pub enum StakingState {
    Staked,
    Unstaked,
}

#[account]
pub struct WonStakingAccount {
    pub user: Pubkey,
    pub nft_mint: Pubkey,
    pub vault_nft_token_account: Pubkey,
    pub staking_state: StakingState,
    pub staked_at: u64,
    pub var1: u64,
}