import { ethers } from 'hardhat';
import { expect } from 'chai';
import { Signer } from 'ethers';

import { CustomNFTToken, NFTMarketplace } from '../typechain-types';

describe('NFTMarketplace', function () {
  let nftMarketplace: NFTMarketplace;
  let owner: Signer;
  let seller: Signer;
  let buyer: Signer;
  let nftContract: CustomNFTToken;
  let tokenId = 0;
  let price: bigint;

  beforeEach(async function () {
    [owner, seller, buyer] = await ethers.getSigners();

    const MockNFT = await ethers.getContractFactory('CustomNFTToken');
    nftContract = await MockNFT.connect(owner).deploy('CustomNFTToken', 'CNFT');

    const NFTMarketplace = await ethers.getContractFactory('NFTMarketplace');
    nftMarketplace = await NFTMarketplace.deploy();

    await nftContract.mint(await seller.getAddress(), `${tokenId}`);

    price = ethers.parseEther('1');
  });

  describe('listNFT', function () {
    it('should list an NFT', async function () {
      const send = await nftContract
        .connect(seller)
        .approve(await nftMarketplace.getAddress(), tokenId);
      await send.wait();
      const t = nftMarketplace
        .connect(seller)
        .listNFT(await nftContract.getAddress(), tokenId, price);
      (await t).wait();

      const listing = await nftMarketplace.nftListings(
        await nftContract.getAddress(),
        tokenId
      );

      expect(listing.seller).to.equal(await seller.getAddress());
      expect(listing.price.toString()).to.equal(price.toString());
    });

    it('should fail if price is 0', async function () {
      await expect(
        nftMarketplace
          .connect(seller)
          .listNFT(await nftContract.getAddress(), tokenId, 0)
      ).to.be.reverted;
    });

    it('should fail if the seller is not the owner of the NFT', async function () {
      await expect(
        nftMarketplace
          .connect(buyer)
          .listNFT(await nftContract.getAddress(), tokenId, price)
      ).to.be.reverted;
    });
  });

  describe('buyNFT', function () {
    beforeEach(async function () {
      const r = await nftContract
        .connect(seller)
        .approve(await nftMarketplace.getAddress(), tokenId);
      await r.wait();
      const t = await nftMarketplace
        .connect(seller)
        .listNFT(await nftContract.getAddress(), tokenId, price);
      await t.wait();
    });

    it('should allow a buyer to purchase an NFT', async function () {
      const initialSellerBalance = await ethers.provider.getBalance(
        await seller.getAddress()
      );
      const transaction = await nftMarketplace
        .connect(buyer)
        .buyNFT(await nftContract.getAddress(), tokenId, { value: price });

      await transaction.wait();

      const finalSellerBalance = await ethers.provider.getBalance(
        await seller.getAddress()
      );
      expect(finalSellerBalance - initialSellerBalance).to.equal(price);
    });

    it('should fail if the NFT is not listed for sale', async function () {
      await expect(
        nftMarketplace
          .connect(buyer)
          .buyNFT(await nftContract.getAddress(), 1000, { value: price })
      ).to.be.reverted;
    });

    it('should fail if the buyer sends insufficient funds', async function () {
      await expect(
        nftMarketplace
          .connect(buyer)
          .buyNFT(await nftContract.getAddress(), tokenId, {
            value: price - ethers.parseEther('0.5'),
          })
      ).to.be.reverted;
    });

    it('should allow the owner to withdraw funds', async function () {
      const contractBalance = await ethers.provider.getBalance(
        nftMarketplace.getAddress()
      );

      expect(contractBalance).to.equal(ethers.parseEther('0'));
    });

    it('should fail if a non-owner tries to withdraw', async function () {
      await expect(nftMarketplace.connect(seller).withdraw()).to.be.reverted;
    });
  });

  describe('cancelListening', function () {
    beforeEach(async function () {
      const approval = await nftContract
        .connect(seller)
        .approve(await nftMarketplace.getAddress(), tokenId);
      await approval.wait();

      const transaction = await nftMarketplace
        .connect(seller)
        .listNFT(await nftContract.getAddress(), tokenId, price);
      await transaction.wait();
    });

    it('should allow the seller to cancel the listing', async function () {
      await expect(
        nftMarketplace
          .connect(seller)
          .cancelListening(await nftContract.getAddress(), tokenId)
      )
        .to.emit(nftMarketplace, 'NFTListingCanceled')
        .withArgs(
          await nftContract.getAddress(),
          tokenId,
          await seller.getAddress()
        );

      const listing = await nftMarketplace.nftListings(
        await nftContract.getAddress(),
        tokenId
      );
      expect(listing.seller).not.to.equal(await seller.getAddress());
    });

    it('should fail if someone other than the seller tries to cancel', async function () {
      await expect(
        nftMarketplace
          .connect(buyer)
          .cancelListening(await nftContract.getAddress(), tokenId)
      ).to.be.reverted;
    });
  });
});
