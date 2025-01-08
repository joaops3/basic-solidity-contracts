import { expect } from 'chai';
import hre from 'hardhat';
import { Wallet } from '../typechain-types';
import { Signer } from 'ethers';

describe('Wallet', function () {
  let deployer: Signer, user1: Signer;
  let contract: Wallet;

  before(async function () {
    [deployer, user1] = await hre.ethers.getSigners();
    const factory = await hre.ethers.getContractFactory('Wallet');
    contract = await factory.deploy();
  });

  describe('Deployment', function () {
    it('should deploy the contract with owner', async function () {
      expect(await contract.getOwner()).to.equal(await deployer.getAddress());
    });

    it('should transfer to wallet and emit event', async function () {
      const QTD = hre.ethers.parseEther('1');
      const initialBalance = await hre.ethers.provider.getBalance(
        await contract.getAddress()
      );

      const transaction = await user1.sendTransaction({
        to: await contract.getAddress(),
        value: QTD,
      });
      await transaction.wait();

      expect(await contract.getBalance()).to.equal(initialBalance + QTD);
    });

    it('withdraw and emit event', async function () {
      const deployerInitialBalance = await hre.ethers.provider.getBalance(
        await deployer.getAddress()
      );
      const initialBalance = await hre.ethers.provider.getBalance(
        await contract.getAddress()
      );

      const transaction = await contract
        .connect(deployer)
        .withdraw(initialBalance);
      const receipt = await transaction.wait();

      const event = receipt?.logs?.find(
        (log: any) => log.fragment.name === 'Withdraw'
      );

      const balanceAfter = await hre.ethers.provider.getBalance(
        await deployer.getAddress()
      );
      expect(await contract.getBalance()).to.equal(0);
      expect(balanceAfter).to.above(deployerInitialBalance);
      expect(transaction).to.emit(contract, 'Withdraw');
      expect(event).not.to.be.undefined;
      expect((event as any)?.args[0]).to.equal(await deployer.getAddress());
    });
  });
});
