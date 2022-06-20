use anchor_lang::prelude::*;
pub mod instructions;
use crate::instructions::*;
pub mod utils;
pub mod state;
pub mod constants;
pub mod errors;
use crate::state::*;


declare_id!("AwctH8wbf4D5sJwbYkmsPHSihmj3Kqt4TzwvZAo2sXkB");


#[program]
pub mod won_staking {
    use super::*;
    pub fn initialize_won_config(ctx: Context<InitializeWonConfig>, bump_pools_auth: u8, unstaking_unblocks_at: u64) -> Result<()> {
        instructions::initialize_won_config::handler(ctx, bump_pools_auth, unstaking_unblocks_at)
    }
    pub fn stake_won_nft(ctx: Context<StakeWonNft>, bump_pools_auth: u8) -> Result<()> {
        instructions::stake_won_nft::handler(ctx, bump_pools_auth)
    }
    pub fn unstake_won_nft(ctx: Context<UnstakeWonNft>, bump_pools_auth: u8) -> Result<()> {
        instructions::unstake_won_nft::handler(ctx, bump_pools_auth)
    }
}
