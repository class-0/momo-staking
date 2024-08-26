import BN from "bn.js";
import * as web3 from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import * as splToken from "@solana/spl-token";
import type { PeinStaking } from "../target/types/pein_staking";

let stakingInfo: web3.PublicKey;
let stakingTokenMint: web3.PublicKey;
let rewardTokenMint: web3.PublicKey;
let stakingWalletATA: web3.PublicKey;
let rewardWalletATA: web3.PublicKey;
let stakingTokenVaults: web3.PublicKey;
let rewardTokenVaults: web3.PublicKey;

describe("Test", () => {
  // Configure the client to use the local cluster
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.PeinStaking as anchor.Program<PeinStaking>;
  
  before(async () => {
    rewardTokenMint = new web3.PublicKey(
      "EivE3x68mijknzjhnJqBBad32njcgZy4niLsYeBWA9bu"
    );
    stakingTokenMint = new web3.PublicKey(
      "3cZgprrFWMqvmFB93aFoXXmpZL5mXb8PzZM8srdHwdVG"
    );
    rewardWalletATA = await splToken.getAssociatedTokenAddress(
      rewardTokenMint,
      program.provider.publicKey
    );
    stakingWalletATA = await splToken.getAssociatedTokenAddress(
      stakingTokenMint,
      program.provider.publicKey
    );
    await splToken.mintTo(
      program.provider.connection,
      program.provider.wallet.payer,
      rewardTokenMint,
      rewardWalletATA,
      program.provider.publicKey,
      1_000_000_000_000_000
    );
    await splToken.mintTo(
      program.provider.connection,
      program.provider.wallet.payer,
      stakingTokenMint,
      stakingWalletATA,
      program.provider.publicKey,
      1_000_000_000_000_000
    );
    [stakingInfo] = await web3.PublicKey.findProgramAddress(
      [anchor.utils.bytes.utf8.encode("staking_info")],
      program.programId
    );
    [rewardTokenVaults] = await web3.PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("reward_token_vaults"),
        rewardTokenMint.toBuffer(),
      ],
      program.programId
    );
    [stakingTokenVaults] = await web3.PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("staking_token_vaults"),
        stakingTokenMint.toBuffer(),
      ],
      program.programId
    );
  }),
    // before(async () => {
    //   rewardTokenMint = await splToken.createMint(
    //     program.provider.connection,
    //     program.provider.wallet.payer,
    //     program.provider.publicKey,
    //     null,
    //     6
    //   );
    //   stakingTokenMint = await splToken.createMint(
    //     program.provider.connection,
    //     program.provider.wallet.payer,
    //     program.provider.publicKey,
    //     null,
    //     6
    //   );
    //   console.log(rewardTokenMint.toString(), stakingTokenMint.toString());
    //   rewardWalletATA = await splToken.createAssociatedTokenAccount(
    //     program.provider.connection,
    //     program.provider.wallet.payer,
    //     rewardTokenMint,
    //     program.provider.publicKey
    //   );
    //   stakingWalletATA = await splToken.createAssociatedTokenAccount(
    //     program.provider.connection,
    //     program.provider.wallet.payer,
    //     stakingTokenMint,
    //     program.provider.publicKey
    //   );
    //   await splToken.mintTo(
    //     program.provider.connection,
    //     program.provider.wallet.payer,
    //     rewardTokenMint,
    //     rewardWalletATA,
    //     program.provider.publicKey,
    //     1_000_000_000_000_000
    //   );
    //   await splToken.mintTo(
    //     program.provider.connection,
    //     program.provider.wallet.payer,
    //     stakingTokenMint,
    //     stakingWalletATA,
    //     program.provider.publicKey,
    //     1_000_000_000_000_000
    //   );
    //   [stakingInfo] = await web3.PublicKey.findProgramAddress(
    //     [anchor.utils.bytes.utf8.encode("staking_info")],
    //     program.programId
    //   );
    //   [rewardTokenVaults] = await web3.PublicKey.findProgramAddress(
    //     [
    //       anchor.utils.bytes.utf8.encode("reward_token_vaults"),
    //       rewardTokenMint.toBuffer(),
    //     ],
    //     program.programId
    //   );
    //   [stakingTokenVaults] = await web3.PublicKey.findProgramAddress(
    //     [
    //       anchor.utils.bytes.utf8.encode("staking_token_vaults"),
    //       stakingTokenMint.toBuffer(),
    //     ],
    //     program.programId
    //   );
    // }),
    it("initialize", async () => {
      // Generate keypair for the new account
      const tx = await program.methods
        .initialize(
          [
            new BN(2592000),
            new BN(7776000),
            new BN(15552000),
            new BN(31104000),
          ],
          [new BN(4), new BN(12), new BN(24), new BN(48)]
        )
        .accounts({
          signer: program.provider.publicKey,
          stakingInfo,
          rewardTokenMint,
          rewardTokenVaults,
          stakingTokenMint,
          stakingTokenVaults,
          systemProgram: web3.SystemProgram.programId,
          tokenProgram: splToken.TOKEN_PROGRAM_ID,
        })
        .signers([program.provider.wallet.payer])
        .rpc();
      console.log(tx);
    });
  // it("stake", async () => {
  //   const [userStakeInfo] = await web3.PublicKey.findProgramAddress(
  //     [
  //       anchor.utils.bytes.utf8.encode("user_stake_info"),
  //       program.provider.publicKey.toBuffer(),
  //     ],
  //     program.programId
  //   );
  //   const tx = await program.methods
  //     .stake(new BN("8000000"))
  //     .accounts({
  //       signer: program.provider.publicKey,
  //       stakingInfo,
  //       systemProgram: web3.SystemProgram.programId,
  //       tokenProgram: splToken.TOKEN_PROGRAM_ID,
  //       userStakeInfo,
  //       senderToken: stakingWalletATA,
  //       stakingTokenMint,
  //       stakingTokenVaults,
  //     })
  //     .signers([program.provider.wallet.payer])
  //     .rpc();
  //   console.log(tx);
  // });
  // it("unstake", async () => {
  //   const [userStakeInfo] = await web3.PublicKey.findProgramAddress(
  //     [
  //       anchor.utils.bytes.utf8.encode("user_stake_info"),
  //       program.provider.publicKey.toBuffer(),
  //     ],
  //     program.programId
  //   );
  //   const tx = await program.methods
  //     .unstake()
  //     .accounts({
  //       signer: program.provider.publicKey,
  //       stakingInfo,
  //       systemProgram: web3.SystemProgram.programId,
  //       tokenProgram: splToken.TOKEN_PROGRAM_ID,
  //       userStakeInfo,
  //       recipientRewardToken: rewardWalletATA,
  //       recipientStakingToken: stakingWalletATA,
  //       rewardTokenMint,
  //       rewardTokenVaults,
  //       stakingTokenMint,
  //       stakingTokenVaults,
  //     })
  //     .signers([program.provider.wallet.payer])
  //     .rpc();
  //   console.log(tx);
  // });
  // it("claim", async () => {
  //   const [userStakeInfo] = await web3.PublicKey.findProgramAddress(
  //     [
  //       anchor.utils.bytes.utf8.encode("user_stake_info"),
  //       program.provider.publicKey.toBuffer(),
  //     ],
  //     program.programId
  //   );
  //   const tx = await program.methods
  //     .claim()
  //     .accounts({
  //       signer: program.provider.publicKey,
  //       stakingInfo,
  //       systemProgram: web3.SystemProgram.programId,
  //       tokenProgram: splToken.TOKEN_PROGRAM_ID,
  //       userStakeInfo,
  //       recipientRewardToken: rewardWalletATA,
  //       rewardTokenMint,
  //       rewardTokenVaults,
  //     })
  //     .signers([program.provider.wallet.payer])
  //     .rpc();
  //   console.log(tx);
  // });
  it("deposit", async () => {
    const tx = await program.methods
      .depositRewardToken(new BN("1000000"))
      .accounts({
        signer: program.provider.publicKey,
        stakingInfo,
        tokenProgram: splToken.TOKEN_PROGRAM_ID,
        rewardTokenMint,
        rewardTokenVaults,
        senderToken: rewardWalletATA,
      })
      .signers([program.provider.wallet.payer])
      .rpc();
    console.log(tx);
  });
  // it("withdraw", async () => {
  //   const tx = await program.methods
  //     .withdrawRewardToken(new BN("888"))
  //     .accounts({
  //       signer: program.provider.publicKey,
  //       stakingInfo,

  //       tokenProgram: splToken.TOKEN_PROGRAM_ID,
  //       recipientToken: rewardWalletATA,
  //       rewardTokenMint,
  //       rewardTokenVaults,
  //     })
  //     .signers([program.provider.wallet.payer])
  //     .rpc();
  //   console.log(tx);
  // });
});
