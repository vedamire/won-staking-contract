export type WonStaking = {
  "version": "0.1.0",
  "name": "won_staking",
  "instructions": [
    {
      "name": "initializeWonConfig",
      "accounts": [
        {
          "name": "wonConfig",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "wonStakingAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "creator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bumpPoolsAuth",
          "type": "u8"
        },
        {
          "name": "unstakingUnblocksAt",
          "type": "u64"
        }
      ],
      "returns": null
    },
    {
      "name": "stakeWonNft",
      "accounts": [
        {
          "name": "wonStakingAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "wonConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "wonStakingAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultNftTokenAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftUserTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bumpPoolsAuth",
          "type": "u8"
        }
      ],
      "returns": null
    },
    {
      "name": "unstakeWonNft",
      "accounts": [
        {
          "name": "wonStakingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wonConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "wonStakingAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultNftTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftUserTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bumpPoolsAuth",
          "type": "u8"
        }
      ],
      "returns": null
    }
  ],
  "accounts": [
    {
      "name": "wonConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "wonStakingAuthority",
            "type": "publicKey"
          },
          {
            "name": "unstakingUnblocksAt",
            "type": "u64"
          },
          {
            "name": "stakedNfts",
            "type": "u64"
          },
          {
            "name": "var1",
            "type": "u64"
          },
          {
            "name": "var2",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "wonStakingAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "nftMint",
            "type": "publicKey"
          },
          {
            "name": "vaultNftTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "stakingState",
            "type": {
              "defined": "StakingState"
            }
          },
          {
            "name": "stakedAt",
            "type": "u64"
          },
          {
            "name": "var1",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "StakingState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Staked"
          },
          {
            "name": "Unstaked"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidInstruction",
      "msg": "InvalidInstruction"
    }
  ]
};

export const IDL: WonStaking = {
  "version": "0.1.0",
  "name": "won_staking",
  "instructions": [
    {
      "name": "initializeWonConfig",
      "accounts": [
        {
          "name": "wonConfig",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "wonStakingAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "creator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bumpPoolsAuth",
          "type": "u8"
        },
        {
          "name": "unstakingUnblocksAt",
          "type": "u64"
        }
      ],
      "returns": null
    },
    {
      "name": "stakeWonNft",
      "accounts": [
        {
          "name": "wonStakingAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "wonConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "wonStakingAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultNftTokenAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftUserTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bumpPoolsAuth",
          "type": "u8"
        }
      ],
      "returns": null
    },
    {
      "name": "unstakeWonNft",
      "accounts": [
        {
          "name": "wonStakingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wonConfig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "wonStakingAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultNftTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftUserTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bumpPoolsAuth",
          "type": "u8"
        }
      ],
      "returns": null
    }
  ],
  "accounts": [
    {
      "name": "wonConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "wonStakingAuthority",
            "type": "publicKey"
          },
          {
            "name": "unstakingUnblocksAt",
            "type": "u64"
          },
          {
            "name": "stakedNfts",
            "type": "u64"
          },
          {
            "name": "var1",
            "type": "u64"
          },
          {
            "name": "var2",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "wonStakingAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "nftMint",
            "type": "publicKey"
          },
          {
            "name": "vaultNftTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "stakingState",
            "type": {
              "defined": "StakingState"
            }
          },
          {
            "name": "stakedAt",
            "type": "u64"
          },
          {
            "name": "var1",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "StakingState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Staked"
          },
          {
            "name": "Unstaked"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidInstruction",
      "msg": "InvalidInstruction"
    }
  ]
};
