# Basic contracts example for Solidity learners

This repository contains basic examples of Solidity contracts for learners to understand the fundamentals of smart contract development.

## Contracts Overview

### 1. **[Wallet](./contracts/Wallet.sol)**

A simple wallet contract that demonstrates:

- Storing and withdrawing Ether.
- Secure management of user balances.
- Basic ownership and access control mechanisms.

### 2. **[Multisig](./contracts/MultiSig.sol)**

A multisignature wallet contract that showcases:

- How multiple participants can manage funds together.
- Requiring approvals from a set number of participants before executing transactions.
- Core principles of decentralized fund management.

### 3. **[Token](./contracts/Token.sol)**

An ERC20-compatible token contract that teaches:

- How to create and manage a custom token.
- Token minting and burning functionalities.
- Implementing transfer, allowance, and approval mechanisms based on the ERC20 standard.

### 4. **[Airdrop](./contracts/AirDrop.sol)**

An airdrop contract designed to distribute tokens to multiple recipients efficiently:

- Demonstrates the use of `calldata` for optimized gas consumption.
- How to handle bulk token transfers securely.
- Emission of events for transaction transparency.

### 5. **[NFTToken](./contracts/NFTToken.sol)**

An ERC721-compatible non-fungible token (NFT) contract that covers:

- How to create and manage unique digital assets.
- Minting, transferring, and burning NFTs.
- Implementing metadata and ownership tracking.

### 6. **[NFTMarketplace](./contracts/NFTMarketplace.sol)**

A marketplace contract for trading tokens that demonstrates:

- Listing tokens for sale and managing bids.
- Securely transferring ownership of tokens upon sale.
- Handling payments and fees in a decentralized manner.
