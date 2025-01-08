import { ethers } from 'hardhat';

const tokens = (n: any) => {
  return ethers.parseUnits(n.toString(), 'ether');
};

async function main() {
  const FactoryToken = await ethers.getContractFactory('CustomToken');
  const Token = await FactoryToken.deploy('CustomToken', 'CT', 200000);

  const FactoryAirdrop = await ethers.getContractFactory('Airdrop');
  const Airdrop = await FactoryAirdrop.deploy(await Token.getAddress());
  console.log(`Deployed Contract at: ${await Airdrop.getAddress()}\n`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
