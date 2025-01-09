import { Signer } from 'ethers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { CustomNFTToken } from '../typechain-types';

describe('CustomNFTToken', function () {
  let nft: CustomNFTToken;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;
  let name = 'CustomNFT';
  let symbol = 'CNFT';

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory('CustomNFTToken');
    nft = await NFT.deploy(name, symbol);
  });

  it('should have name and symbol', async function () {
    expect(await nft.name()).to.equal(name);
    expect(await nft.symbol()).to.equal(symbol);
  });

  it('should allow owner to mint NFT', async function () {
    const tokenURI = 'https://myapi.com/metadata/1';

    await nft.mint(await addr1.getAddress(), tokenURI);

    expect(await nft.ownerOf(0)).to.equal(await addr1.getAddress());
    expect(await nft.tokenURI(0)).to.equal(tokenURI);
  });

  it('must now allow, other addresses to mint NFT', async function () {
    const tokenURI = 'https://myapi.com/metadata/2';

    await expect(nft.connect(addr1).mint(await addr2.getAddress(), tokenURI)).to
      .be.reverted;
  });

  it('must increment nextTokenId after mint', async function () {
    const tokenURI1 = 'https://myapi.com/metadata/1';
    const tokenURI2 = 'https://myapi.com/metadata/2';

    await nft.mint(await addr1.getAddress(), tokenURI1);
    await nft.mint(await addr2.getAddress(), tokenURI2);

    expect(await nft.ownerOf(0)).to.equal(await addr1.getAddress());
    expect(await nft.ownerOf(1)).to.equal(await addr2.getAddress());

    expect(await nft.nextTokenId()).to.equal(2);
  });
});
