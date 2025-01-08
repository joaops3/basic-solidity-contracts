import { ethers } from 'hardhat';

const tokens = (n: any) => {
  return ethers.parseUnits(n.toString(), 'ether');
};

async function main() {
  const [deployer, user1] = await ethers.getSigners();

  const addresses = await Promise.all([
    deployer.getAddress(),
    user1.getAddress(),
  ]);

  const Factory = await ethers.getContractFactory('MultiSig');
  const contract = await Factory.deploy(addresses, addresses.length);

  console.log(`Deployed Contract at: ${await contract.getAddress()}\n`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
