use anchor_lang::{
    prelude::*,
        solana_program::{
            program::{invoke_signed},
        }};

        
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount, Transfer, 
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
pub struct UnstakeWonNft<'info> {
    #[account(
        mut,
    )] 
    pub won_staking_account: Box<Account<'info, WonStakingAccount>>,

    #[account(
        mut,
        has_one=won_staking_authority,
        constraint=won_config.unstaking_unblocks_at < now_ts()?
    )] 
    pub won_config: Box<Account<'info, WonConfig>>,

    #[account(mut,)]
    pub user: Signer<'info>,
    
    /// CHECK: 
    #[account(mut, seeds = [PREFIX.as_bytes(),], bump = bump_pools_auth)]
   pub won_staking_authority: AccountInfo<'info>,

    #[account(mut, 
        // owner = token::ID,
        token::mint = nft_mint,
        token::authority = won_staking_authority,)]
    pub vault_nft_token_account: Box<Account<'info, TokenAccount>>,

    #[account(mut, 
        // owner = token::ID,
        associated_token::mint = nft_mint,
        associated_token::authority = user)]
    pub nft_user_token_account: Box<Account<'info, TokenAccount>>,

    #[account(mut,
        constraint = nft_mint.decimals == TOKEN_MINT_DECIMALS, 
        constraint = nft_mint.supply == TOKEN_MINT_SUPPLY)]
    pub nft_mint: Account<'info, Mint>,

    
    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,

    pub system_program: Program<'info, System>,
    
}

pub fn handler(ctx: Context<UnstakeWonNft>, bump_pools_auth: u8) -> Result<()> {
    let won_staking_account = &mut ctx.accounts.won_staking_account;
    let won_config = &mut ctx.accounts.won_config;

    won_staking_account.staking_state = StakingState::Unstaked;

    won_config.staked_nfts = won_config.staked_nfts-1;

    let program_seeds = &[PREFIX.as_bytes(), &[bump_pools_auth]];
    let program_signer = &[&program_seeds[..]];
    
    msg!("Nft is withdrawn: {}", &ctx.accounts.nft_mint.key());
    let cpi_transfer_nft_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        token::Transfer {
            from: ctx.accounts.vault_nft_token_account
            .to_account_info()
            .clone(),
            to: ctx.accounts.nft_user_token_account.to_account_info().clone(),
            authority: ctx.accounts.won_staking_authority.to_account_info().clone(),
        },
        program_signer,
    );
    token::transfer(cpi_transfer_nft_ctx, TOKEN_MINT_SUPPLY)?;

    Ok(())
}