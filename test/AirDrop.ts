import { ethers } from 'hardhat';
import { expect } from 'chai';
import { Signer } from 'ethers';
import { CustomToken } from '../typechain-types';

describe('Airdrop', function () {
  let Token: CustomToken;
  let Airdrop: any;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;
  let addr3: Signer;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    const TokenFactory = await ethers.getContractFactory('CustomToken');
    Token = await TokenFactory.deploy('CustomToken', 'CTK', 1000000);

    const AirdropFactory = await ethers.getContractFactory('Airdrop');
    Airdrop = await AirdropFactory.deploy(await Token.getAddress());

    await Token.transfer(
      await Airdrop.getAddress(),
      ethers.parseEther('10000')
    );
  });

  it('should distribute tokens correctly', async function () {
    const recipients = await Promise.all([
      addr1.getAddress(),
      addr2.getAddress(),
      addr3.getAddress(),
    ]);
    const amounts = [
      ethers.parseEther('1000'),
      ethers.parseEther('2000'),
      ethers.parseEther('3000'),
    ];

    await Airdrop.distribute(recipients, amounts);

    expect(await Token.balanceOf(await addr1.getAddress())).to.equal(
      amounts[0]
    );
    expect(await Token.balanceOf(await addr2.getAddress())).to.equal(
      amounts[1]
    );
    expect(await Token.balanceOf(await addr3.getAddress())).to.equal(
      amounts[2]
    );

    const remainingTokens = ethers.parseEther('4000'); // 10.000 - (1000 + 2000 + 3000)
    expect(await Token.balanceOf(await Airdrop.getAddress())).to.equal(
      remainingTokens
    );
  });

  it('should fail if recipients and amounts length mismatch', async function () {
    const recipients = await Promise.all([
      addr1.getAddress(),
      addr2.getAddress(),
    ]);
    const amounts = [
      ethers.parseEther('1000'),
      ethers.parseEther('2000'),
      ethers.parseEther('3000'),
    ];

    await expect(Airdrop.distribute(recipients, amounts)).to.be.revertedWith(
      'Recipients and amounts length mismatch'
    );
  });

  it('should fail if contract has insufficient tokens', async function () {
    const recipients = await Promise.all([
      addr1.getAddress(),
      addr2.getAddress(),
    ]);
    const amounts = [
      ethers.parseEther('5000'), // 5000 tokens
      ethers.parseEther('6000'), // 6000 tokens
    ];

    await expect(Airdrop.distribute(recipients, amounts)).to.be.revertedWith(
      'Insufficient tokens in contract'
    );
  });

  it('should allow owner to withdraw tokens', async function () {
    const initialOwnerBalance = await Token.balanceOf(await owner.getAddress());

    await Airdrop.withdrawTokens(ethers.parseEther('5000'));

    expect(await Token.balanceOf(await owner.getAddress())).to.equal(
      initialOwnerBalance + ethers.parseEther('5000')
    );

    const remainingTokens = ethers.parseEther('5000'); // 10.000 - 5.000
    expect(await Token.balanceOf(await Airdrop.getAddress())).to.equal(
      remainingTokens
    );
  });

  it('should not allow non-owner to call restricted functions', async function () {
    const recipients = await Promise.all([addr1.getAddress()]);
    const amounts = [ethers.parseEther('1000')];

    await expect(
      Airdrop.connect(addr1).distribute(recipients, amounts)
    ).to.be.revertedWith('Only owner can perform this action');

    await expect(
      Airdrop.connect(addr1).withdrawTokens(ethers.parseEther('1000'))
    ).to.be.revertedWith('Only owner can perform this action');
  });
});
