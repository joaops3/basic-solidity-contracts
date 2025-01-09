import { ethers } from 'hardhat';

async function main() {
  const FactoryToken = await ethers.getContractFactory('CustomNFTToken');
  const Token = await FactoryToken.deploy('CustomNFTToken', 'CT');

  const FactoryNFTMarketplace = await ethers.getContractFactory(
    'NFTMarketplace'
  );
  const NFTMarketplace = await FactoryNFTMarketplace.deploy();
  console.log(`Deployed Contract at: ${await NFTMarketplace.getAddress()}\n`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
