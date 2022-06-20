use anchor_lang::{
    prelude::*,
        solana_program::{
            program::{invoke_signed},
        }};
use anchor_spl::{
    token::{self, Mint, Token, TokenAccount, revoke, Revoke, set_authority, SetAuthority
        // Burn
    },
};

use std::convert::TryInto;
use spl_token::instruction::AuthorityType;

// use std::TryInto::*;
use crate::state::*;
use crate::{utils::*};

use crate::constants::*;
use crate::errors::*;

#[derive(Accounts)]
#[instruction(bump_pools_auth: u8)]
pub struct InitializeWonConfig<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + std::mem::size_of::<WonConfig>()
    )] 
    pub won_config: Box<Account<'info, WonConfig>>,

    #[account(mut, address = ADMIN_ADDRESS.parse::<Pubkey>().unwrap(),)]
    pub admin: Signer<'info>,

    /// CHECK: 
    #[account(mut, seeds = [PREFIX.as_bytes(), ], bump = bump_pools_auth)]
    pub won_staking_authority: AccountInfo<'info>,
    /// CHECK: 
    // #[account(rent_exempt = enforce)]
    pub creator: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
    
}

pub fn handler(ctx: Context<InitializeWonConfig>, bump_pools_auth: u8, unstaking_unblocks_at: u64) -> Result<()> {
    let won_config = &mut ctx.accounts.won_config;

    won_config.creator = ctx.accounts.creator.key();
    won_config.won_staking_authority = ctx.accounts.won_staking_authority.key();
    won_config.unstaking_unblocks_at = unstaking_unblocks_at;
    won_config.staked_nfts = 0;
    Ok(())
}