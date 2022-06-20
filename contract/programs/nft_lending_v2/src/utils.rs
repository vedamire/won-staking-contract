use std::convert::TryInto;

use anchor_lang::{prelude::*, solana_program::clock};

pub fn now_ts() -> Result<u64> {
    //i64 -> u64 ok to unwrap
    Ok(clock::Clock::get()?.unix_timestamp.try_into().unwrap())
}

pub fn create_transfer_signed<'a>(
    sender: &AccountInfo<'a>,
    receiver: &AccountInfo<'a>,
    system_program: &AccountInfo<'a>,
    amount: u64,
    seeds: &[&[&[u8]]],
) -> Result<()> {
    let ix = anchor_lang::solana_program::system_instruction::transfer(
        sender.key,
        receiver.key,
        amount,
    );
    anchor_lang::solana_program::program::invoke_signed(
        &ix,
        &[
            sender.clone(),
            receiver.clone(),
            system_program.clone()
        ],
        seeds,
    )?;
    Ok(())
}

pub fn create_transfer<'a>(
    sender: &AccountInfo<'a>,
    receiver: &AccountInfo<'a>,
    system_program: &AccountInfo<'a>,
    amount: u64,
) -> Result<()> {
    let ix = anchor_lang::solana_program::system_instruction::transfer(
        sender.key,
        receiver.key,
        amount,
    );
    anchor_lang::solana_program::program::invoke(
        &ix,
        &[
            sender.clone(),
            receiver.clone(),
            system_program.clone()
        ],
    )?;
    Ok(())
}

pub fn convert_u128_to_u64(v: u128) -> Option<u64> {
    if v > std::u64::MAX as u128 {
        None
    } else {
        Some(v as u64)
    }
}