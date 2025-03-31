import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();
  const FactoryWallet = await ethers.getContractFactory('Wallet');
  const Wallet = await FactoryWallet.deploy();
  console.log(`Deployed Contract at: ${await Wallet.getAddress()}\n`);

  const ProxyAdminFactory = await ethers.getContractFactory('ProxyAdminCustom');

  const ProxyAdmin = await ProxyAdminFactory.deploy(
    FactoryWallet.interface.encodeFunctionData('initialize', [])
  );
  console.log(`Deployed Contract at: ${await ProxyAdmin.getAddress()}\n`);

  const TransparentProxyFactory = await ethers.getContractFactory(
    'TransparentUpgrade'
  );

  const TransparentProxy = await TransparentProxyFactory.deploy(
    await Wallet.getAddress(),
    await ProxyAdmin.getAddress(),
    FactoryWallet.interface.encodeFunctionData('initialize', []),
    { from: await deployer.getAddress(), gasLimit: 1000000 }
  );
  console.log(`Deployed Contract at: ${await TransparentProxy.getAddress()}\n`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
