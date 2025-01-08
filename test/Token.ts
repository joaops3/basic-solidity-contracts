import { expect } from 'chai';
import hre from 'hardhat';
import { CustomToken } from '../typechain-types';
import { EventLog, Signer } from 'ethers';

describe('CustomToken', function () {
  let deployer: Signer, user1: Signer;
  let contract: CustomToken;
  let NAME = 'CustomToken';
  let SYMBOL = 'CT';

  before(async function () {
    [deployer, user1] = await hre.ethers.getSigners();
    const factory = await hre.ethers.getContractFactory('CustomToken');
    contract = await factory.deploy(NAME, SYMBOL, 20);
  });

  describe('Deployment', function () {
    it('should deploy the contract with owner', async function () {
      const balance = await contract.balanceOf(await deployer.getAddress());
      expect(balance).to.equal(hre.ethers.parseEther('20'));
    });

    it('should have the correct name and symbol', async function () {
      expect(await contract.name()).to.equal(NAME);
      expect(await contract.symbol()).to.equal(SYMBOL);
    });

    it('should transfer tokens', async function () {
      const balance = await contract.balanceOf(await deployer.getAddress());
      await contract.transfer(
        await user1.getAddress(),
        hre.ethers.parseEther('10')
      );
      expect(await contract.balanceOf(await deployer.getAddress())).to.equal(
        balance - hre.ethers.parseEther('10')
      );
    });

    it('should burn', async () => {
      const balance = await contract.balanceOf(await deployer.getAddress());
      const transaction = await contract.burn(hre.ethers.parseEther('5'));
      const result = await transaction.wait();
      const event = (await result?.logs?.find(
        (e: any) => e.fragment.name === 'Burn'
      )) as EventLog;

      expect(transaction).to.emit(contract, 'Burn');
      expect(event).not.to.be.undefined;
      expect(await contract.balanceOf(await deployer.getAddress())).to.equal(
        balance - hre.ethers.parseEther('5')
      );
    });

    it('should not mint', async () => {
      await expect(
        contract.mint(await deployer.getAddress(), hre.ethers.parseEther('5'))
      ).to.be.revertedWith('Minting exceeds total supply');
    });
  });
});
